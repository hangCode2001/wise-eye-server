/**
 * 用户管理模块
 */
require("../config/db");
const router = require("koa-router")();
const util = require("../utils/util");
let connection = require("../config/db");

router.prefix("/user");

const query = function (sql) {
  return new Promise((resolve, reject) => {
    connection.query(sql, function (error, results) {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  });
};
// 用户登录
router.get("/login", async (ctx) => {
  try {
    console.log(ctx.request.body);

    let sql = "select * from test";
    let results = await query(sql);
    ctx.body = results;
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});
module.exports = router;
