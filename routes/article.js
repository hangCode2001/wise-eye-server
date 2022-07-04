/**
 * 文章管理模块
 */
const router = require("koa-router")();
const util = require("../utils/util");
const { query } = require("../config/db");

router.prefix("/article");

// 获取列表
router.post("/list", async (ctx) => {
  // ctx.body = util.success({ list: [1, 2, 3, 4] }, "jwt校验成功");
  let sql = `select * from article;`;
  let results = await query(sql);
  console.log("results", results);
  ctx.body = results;
});

module.exports = router;
