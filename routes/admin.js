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
  let coutSql = `select COUNT(*) from article`;
  let sql = `select * from article`;
  if (category_id !== 14) {
    sql += ` where category_id=${category_id}`;
    coutSql += ` where category_id=${category_id};`;
  }
  sql += ` LiMIT ${limit} OFFSET ${offset};`;

  console.log("category_id", category_id, limit, offset);
  console.log("coutSql", coutSql);
  const count = await query(coutSql);
  console.log("sql", sql);
  const list = await query(sql);

  const res = {
    page_total: count[0]["COUNT(*)"],
    list,
  };
  ctx.body = res;
});

// 获取用户点击列表
router.post("/getLickLog", async (ctx) => {
  const { limit, offset } = ctx.request.body;
  let coutSql = `select COUNT(*) from clickLog;`;
  // let sql = `SELECT c.user_id, c.click_article_id, c.click_timestamp
  // FROM clickLog c `;
  let sql = `SELECT c.user_id, s.title, c.click_article_id, c.click_timestamp
  FROM clickLog c
  INNER JOIN article s
  ON s.article_id = c.click_article_id
  ORDER BY c.click_timestamp DESC
  limit ${limit} offset ${offset};`;

  console.log("limit", limit, offset);
  console.log("coutSql", coutSql);
  const count = await query(coutSql);
  console.log("sql", sql);
  const list = await query(sql);

  const res = {
    page_total: count[0]["COUNT(*)"],
    list,
  };
  ctx.body = res;
});

module.exports = router;
