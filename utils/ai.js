const CryptoJS = require("crypto-js");
const { Base64 } = require("js-base64");
const { accessKey, secretKey, requestMethod } = require("../config/index");
//日期格式
Date.prototype.format = function (fmt) {
  var o = {
    "M+": this.getMonth() + 1, //月份
    "d+": this.getDate(), //日
    "h+": this.getHours(), //小时
    "m+": this.getMinutes(), //分
    "s+": this.getSeconds(), //秒
    "q+": Math.floor((this.getMonth() + 3) / 3), //季度
    S: this.getMilliseconds(), //毫秒
  };
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (this.getFullYear() + "").substr(4 - RegExp.$1.length)
    );
  }
  for (var k in o) {
    if (new RegExp("(" + k + ")").test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length == 1 ? o[k] : ("00" + o[k]).substr(("" + o[k]).length)
      );
    }
  }
  return fmt;
};
//生成uuid作为signatureNonce
function uuid() {
  let s = [];
  let hexDigits = "0123456789abcdef";
  for (let i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
  }
  s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
  //s[8] = s[13] = s[18] = s[23] = "-";
  let res = s.join("");
  return res;
}
/**
 * 生成signature
 * @param {*} requestPath  请求路径，不带域名，例如 /api/lingxiyun/cloud/tts/v1
 * @returns
 */
function createQueryString(requestPath) {
  let signatureNonce = uuid();
  let signatureVersion = "V2.0";
  let signatureMethod = "HmacSHA1";
  let timestamp = new Date().format("yyyy-MM-ddThh%3Amm%3AssZ");

  let queryString =
    "AccessKey=" +
    accessKey +
    "&SignatureMethod=" +
    signatureMethod +
    "&SignatureNonce=" +
    signatureNonce +
    "&SignatureVersion=" +
    signatureVersion +
    "&Timestamp=" +
    timestamp;
  let sha256String = CryptoJS.SHA256(queryString).toString();

  requestPath = requestPath.replace(/\//g, "%2F");
  let before = requestMethod + "\n" + requestPath + "\n" + sha256String;

  let signature = CryptoJS.HmacSHA1(
    before,
    "BC_SIGNATURE&" + secretKey
  ).toString();
  // pm.environment.set("request_param", queryString + "&Signature=" + signature);
  queryString += "&Signature=" + signature;
  return queryString;
}

function uint8arrayToBase64(u8Arr) {
  let CHUNK_SIZE = 0x8000; //arbitrary number
  let index = 0;
  let length = u8Arr.length;
  let result = "";
  let slice;
  while (index < length) {
    slice = u8Arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
    result += String.fromCharCode.apply(null, slice);
    index += CHUNK_SIZE;
  }
  // web image base64图片格式: "data:image/png;base64," + b64encoded;
  // return  "data:image/png;base64," + btoa(result);
  return btoa(result);
}

//pcmToWav.js
function pcmtoWav(
  pcmsrt,
  sampleRate = 16000,
  numChannels = 1,
  bitsPerSample = 16
) {
  //参数->（base64编码的pcm流，采样频率，声道数，采样位数）
  let header = {
    // OFFS SIZE NOTES
    chunkId: [0x52, 0x49, 0x46, 0x46], // 0    4    "RIFF" = 0x52494646
    chunkSize: 0, // 4    4    36+SubChunk2Size = 4+(8+SubChunk1Size)+(8+SubChunk2Size)
    format: [0x57, 0x41, 0x56, 0x45], // 8    4    "WAVE" = 0x57415645
    subChunk1Id: [0x66, 0x6d, 0x74, 0x20], // 12   4    "fmt " = 0x666d7420
    subChunk1Size: 16, // 16   4    16 for PCM
    audioFormat: 1, // 20   2    PCM = 1
    numChannels: numChannels || 1, // 22   2    Mono = 1, Stereo = 2...
    sampleRate: sampleRate || 16000, // 24   4    8000, 44100...
    byteRate: 0, // 28   4    SampleRate*NumChannels*BitsPerSample/8
    blockAlign: 0, // 32   2    NumChannels*BitsPerSample/8
    bitsPerSample: bitsPerSample || 16, // 34   2    8 bits = 8, 16 bits = 16
    subChunk2Id: [0x64, 0x61, 0x74, 0x61], // 36   4    "data" = 0x64617461
    subChunk2Size: 0, // 40   4    data size = NumSamples*NumChannels*BitsPerSample/8
  };

  function u32ToArray(i) {
    return [i & 0xff, (i >> 8) & 0xff, (i >> 16) & 0xff, (i >> 24) & 0xff];
  }

  function u16ToArray(i) {
    return [i & 0xff, (i >> 8) & 0xff];
  }

  let pcm = Base64.toUint8Array(pcmsrt);
  header.blockAlign = (header.numChannels * header.bitsPerSample) >> 3;
  header.byteRate = header.blockAlign * header.sampleRate;
  header.subChunk2Size = pcm.length * (header.bitsPerSample >> 3);
  header.chunkSize = 36 + header.subChunk2Size;

  let wavHeader = header.chunkId.concat(
    u32ToArray(header.chunkSize),
    header.format,
    header.subChunk1Id,
    u32ToArray(header.subChunk1Size),
    u16ToArray(header.audioFormat),
    u16ToArray(header.numChannels),
    u32ToArray(header.sampleRate),
    u32ToArray(header.byteRate),
    u16ToArray(header.blockAlign),
    u16ToArray(header.bitsPerSample),
    header.subChunk2Id,
    u32ToArray(header.subChunk2Size)
  );
  let wavHeaderUnit8 = new Uint8Array(wavHeader);

  let mergedArray = new Uint8Array(wavHeaderUnit8.length + pcm.length);
  mergedArray.set(wavHeaderUnit8);
  mergedArray.set(pcm, wavHeaderUnit8.length);

  // return uint8arrayToBase64(mergedArray);
  let blob = new Blob([mergedArray], { type: "audio/wav" });
  let blobUrl = global.URL.createObjectURL(blob);
  return blob;
}

module.exports = {
  createQueryString,
  pcmtoWav,
  uuid,
};
