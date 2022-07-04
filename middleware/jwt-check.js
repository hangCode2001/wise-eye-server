const jwt = require("jsonwebtoken");
const config = require("../config/index");
const util = require("../utils/util");

/**
 * jwt验证的中间价
 */
module.exports = function () {
  return async function (ctx, next) {
    for (const value of config.unlessApi) {
      if (value.test(ctx.url)) {
        await next();
        return;
      }
    }
    try {
      // 获取jwt
      const token = ctx.header.authorization;
      // console.log("token", token);
      console.log("ctx.url", ctx.url);
      if (!token) {
        // ctx.body = util.userLoginError("用户未登录");
        throw new Error("用户未登录");
      } else {
        try {
          // 解密payload，获取用户名和ID
          const token2 = token.split(" ")[1];
          console.log("token2", token2);
          let payload = await jwt.verify(token2, config.jwtKey);
          console.log("payload", payload);
          console.log("访问", payload.name);
          ctx.user = {
            name: payload.name,
            id: payload.id,
          };
        } catch (err) {
          console.log("token verify fail: ", err);
        }
      }
      await next();
    } catch (err) {
      console.log("err", err.message);
      if (err.message === "用户未登录") {
        ctx.status = 401;
        ctx.body = util.userLoginError(err.message);
      } else if (err.status === 401) {
        ctx.status = 401;
        ctx.body = util.authFail("认证失败或TOKEN过期");
      } else {
        ctx.status = 404;
        ctx.body = {
          success: 0,
          message: err.message,
        };
      }
    }
  };
};
