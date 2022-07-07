const schedule = require("node-schedule");
const getList = require("./getList");
const getArticle = require("./getArticle");

async function startReptile() {
  const list = await getList();
  //   console.log("list", list);
  console.log("执行完list");
  const articles = await getArticle(list);
  //   console.log("articles", articles);
  return articles;
}
console.log("开始执行");
schedule.scheduleJob("0 59 9 * * *", () => {
  startReptile();
});

// module.exports = startReptile;
