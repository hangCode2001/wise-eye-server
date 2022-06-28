/**
 * 用户管理模块
 */
const router = require("koa-router")();
const util = require("../utils/util");
const jwt = require("jsonwebtoken");
const { query } = require("../config/db");
const { jwtKey } = require("../config/index");

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
      console.log("到这一步");
      const token = jwt.sign(userToken, jwtKey, { expiresIn: "2h" });
      ctx.body = util.success({ token }, "用户注册成功");
    } else {
      ctx.body = util.USER_LOGIN_ERROR("账号或密码错误");
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
module.exports = router;
