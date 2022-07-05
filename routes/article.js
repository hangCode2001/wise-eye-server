/**
 * 文章管理模块
 */
const router = require("koa-router")();
const util = require("../utils/util");
const { query } = require("../config/db");

router.prefix("/article");

// 获取新闻
router.post("/getArticles", async (ctx) => {
  const { category_id, limit, offset } = ctx.request.body;
  let sql = `select * from article`;
  if (category_id !== -1) {
    sql += ` where category_id=${category_id}`;
  }
  sql += ` LiMIT ${limit} OFFSET ${offset};`;

  console.log("category_id", category_id, limit, offset);
  console.log("sql", sql);
  const list = await query(sql);

  const res = {
    list,
    offset: offset + limit,
  };
  ctx.body = res;
});

module.exports = router;
