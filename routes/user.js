/**
 * 用户管理模块
 */
const router = require("koa-router")();
const util = require("../utils/util");
const jwt = require("jsonwebtoken");
const { query } = require("../config/db");
const config = require("../config/index");

router.prefix("/user");

// 用户登录
router.post("/login", async (ctx) => {
  try {
    console.log(ctx.request.body);
    const { username, password } = ctx.request.body;
    let sql = `select * from user where username='${username}' AND password='${password}';`;
    let results = await query(sql);
    if (results.length !== 0) {
      const userToken = {
        name: username,
        id: results[0].id,
      };
      const token = jwt.sign(userToken, config.jwtKey, { expiresIn: 60 * 60 });
      ctx.body = util.success({ token }, "用户登陆成功");
    } else {
      ctx.body = util.userLoginFail("账号或密码错误");
    }
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});
// 用户注册
router.post("/register", async (ctx) => {
  try {
    console.log(ctx.request.body);
    const { username, password } = ctx.request.body;
    let sql = `insert into user (username,password) values('${username}','${password}')`;
    let results = await query(sql);
    ctx.body = util.success({}, "用户注册成功");
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});
// 记录点击日志
router.post("/addClickLog", async (ctx) => {
  try {
    console.log(ctx.request.body);
    const { click_article_id, click_timestamp } = ctx.request.body;
    const user_id = ctx.user.id;
    console.log("ctx.user", ctx.user);
    let sql = `insert into clickLog (user_id,click_article_id,click_timestamp) values(${user_id},${click_article_id},${click_timestamp})`;
    await query(sql);
    // console.log("results", results);
    ctx.body = util.success({}, "加入click_log成功");
  } catch (error) {
    ctx.body = util.fail(error.msg);
  }
});
module.exports = router;
