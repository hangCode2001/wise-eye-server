const axios = require("axios");
const path = require("path");
const { mod } = require("./config");
const fs = require("fs");

const baseUrl = "https://feeds.sina.cn/api/v4/tianyi";
const query = `?down=0&length=15&cre=tianyi&`;
let urlList = [];

let dir = path.join(__dirname, "urlList.json");
/**
 *
 * @param {*} action
 * @param {*} up
 * @param {*} mod
 * @returns {
 *  title:标题
 *  created_at_ts:创建时间
 *  url:地址,
 * }
 */
async function actionFn(action, up, mod) {
  const url = baseUrl + query + `action=${action}&up=${up}&mod=${mod}`;
  const { data } = await axios.post(url);
  const list = data.result.data;
  const resList = list.map((item) => {
    return {
      title: item.info.title,
      url: item.base.base.url,
      created_at_ts: item.info.showTime * 1000,
    };
  });
  return resList;
}

function getList() {
  return new Promise((resolve) => {
    mod.forEach(async (modItem, index) => {
      console.log("modItem.value", modItem.value);
      let tempList = [];
      for (let i = 0; i <= 5; i++) {
        const res = await actionFn(i === 0 ? 0 : 1, i, modItem.value);
        tempList = tempList.concat(res);
      }

      urlList[index] = {
        ...modItem,
        len: tempList.length,
        data: tempList,
      };
      console.log("modItem.index", modItem.index);
      console.log("index", index);

      if (index === mod.length - 1) {
        setTimeout(() => {
          resolve(urlList);
          fs.writeFile(dir, JSON.stringify(urlList), "utf8", (err) => {
            console.log("写入成功", err);
          });
        }, 2000);
      }
    });
  });
}

module.exports = getList;
