const cheerio = require("cheerio");
const axios = require("axios");
const path = require("path");
const fs = require("fs");
const { user_agent_list } = require("./config");

const d1 = new Date().getTime();
let articles = [];
let dirInput = path.join(__dirname, "urlList.json");
let dirOutput = path.join(__dirname, "article.json");
let count = -1;
let errCount = 0;
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const instance = axios.create({
  timeout: 10000, //超时配置
  // withCredentials: true, //跨域携带cookie
});
// 添加请求拦截器
instance.interceptors.request.use(async function (config) {
  try {
    // 在请求头中添加jwt
    let userAgent = user_agent_list[Math.floor(Math.random() * 18)];
    // console.log("userAgent", userAgent);
    config.headers["User-Agent"] = userAgent;
    config.headers["Referer"] = "https://blog.csdn.net/";
  } catch (err) {
    console.log("err", err);
  }
  return config;
});
async function getContent(url) {
  let content = "";
  let words_count = 0;
  try {
    const res = await instance.get(url);
    await sleep(Math.random() * 100);
    const $ = cheerio.load(res.data);
    $("font").each(function () {
      content = content + $(this).text() + "\n";
    });
    words_count = content.length;
    console.log("words_count", words_count);
    const d2 = new Date().getTime();
    console.log("耗费时间", (d2 - d1) / 1000);
  } catch (err) {
    console.log("错误了", errCount++);
    return {
      words_count: 0,
      content: "",
    };
  }

  return {
    content,
    words_count,
  };
}
function getArticle(list) {
  return new Promise(async (resolve) => {
    for (let urlIndex in list) {
      const urlItem = list[urlIndex];
      for (let index in urlItem.data) {
        const item = urlItem.data[index];
        console.log("执行到", index);
        const res = await getContent(item.url);
        if (res.words_count > 50) {
          count++;
          articles[count] = {
            article_id: count + 1,
            category_id: urlItem.index,
            created_at_ts: item.created_at_ts,
            title: item.title,
            ...res,
          };
          console.log("成功爬到 ", count, " 个");
          if (count >= 100) {
            setTimeout(() => {
              resolve(articles);
              fs.writeFile(
                dirOutput,
                JSON.stringify(articles),
                "utf8",
                (err) => {
                  console.log("写入成功", err);
                }
              );
            }, 1000);
          }
        }
        console.log("————————————————");
      }
    }
  });
}

module.exports = getArticle;
