const { pcmtoWav } = require("../utils/ai");
const axios = require("axios");
const { createQueryString, uuid } = require("../utils/ai");

// 拼接signature
function createUrl(path) {
  const url = "https://api-wuxi-1.cmecloud.cn:8443" + path;
  const queryString = createQueryString(path);
  return `${url}?${queryString}`;
}
// 文字 => 语音  tts
async function textToVoice(text) {
  const path = "/api/lingxiyun/cloud/tts/v1";
  const url = createUrl(path);
  const params = {
    text,
    sessionParam: {
      sid: uuid(),
      frame_size: 1920,
      audio_coding: "raw",
      native_voice_name: "xiaofeng",
      speed: 0,
      volume: 0,
      read_all_marks: 0,
      read_number: 0,
      read_english: 0,
    },
  };
  const res = await axios.post(url, params);
  const blobUrl = pcmtoWav(res.data.body.data);
  return blobUrl;
}
module.exports = {
  textToVoice,
};
