/**
 * 文章管理模块
 */
const router = require("koa-router")();
const util = require("../utils/util");
const { query } = require("../config/db");

router.prefix("/admin");

// 获取新闻
router.post("/getArticles", async (ctx) => {
  const { category_id, limit, offset } = ctx.request.body;
  let coutSql = `select COUNT(*) from article where category_id=${category_id};`;
  let sql = `select * from article `;
  if (category_id !== 14) {
    sql += `where category_id=${category_id} `;
  }
  sql += `LiMIT ${limit} OFFSET ${offset};`;

  console.log("category_id", category_id, limit, offset);
  const count = await query(coutSql);
  console.log("sql", sql);
  const list = await query(sql);

  const res = {
    page_total: count[0]["COUNT(*)"],
    offset: offset + limit,
    list,
  };
  ctx.body = res;
});

module.exports = router;
