const jwt = require("jsonwebtoken");
const { jwtKey } = require("../config/index");
const { decoded } = require("../utils/util");

/**
 * jwt验证的中间价
 */
module.exports = function () {
  return async function (ctx, next) {
    try {
      // 获取jwt
      const token = ctx.header.authorization;
      console.log("token", token);
      if (token) {
        try {
          // 解密payload，获取用户名和ID
          let payload = await jwt.verify(token, jwtKey);
          console.log("payload", payload);
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
      if (err.status === 401) {
        ctx.status = 401;
        ctx.body = {
          success: 0,
          message: "认证失败",
        };
      } else {
        err.status = 404;
        ctx.body = {
          success: 0,
          message: "404",
        };
      }
    }
  };
};
