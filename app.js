const Koa = require("koa");
const app = new Koa();
const views = require("koa-views");
const json = require("koa-json"); //数据转json
const onerror = require("koa-onerror"); //错误监听
const bodyparser = require("koa-bodyparser");
const logger = require("koa-logger");
const log4js = require("./utils/log4j"); //控制日志信息输送
const router = require("koa-router")();
const user = require("./routes/user");
const article = require("./routes/article");
const jwtCheck = require("./middleware/jwt-check");
const cors = require("./middleware/cors");
// error handler
onerror(app);

let { connection } = require("./config/db");

//开始链接数据库
connection.connect(function (err) {
  if (err) {
    console.log(`mysql连接失败: ${err}!`);
  } else {
    console.log("mysql连接成功!");
  }
});

app.use(cors);

// jwt 验证
app.use(jwtCheck());

//获取前端post提交的数据
app.use(
  bodyparser({
    enableTypes: ["json", "form", "text"],
  })
);
app.use(json());
app.use(logger());
app.use(require("koa-static")(__dirname + "/public"));

//pug相当于带有引擎的html
//将数据和模板结合渲染html页面时
app.use(
  views(__dirname + "/views", {
    extension: "pug",
  })
);

router.prefix("/api"); //设置路由前缀

//allowedMethods响应 options 方法, 告诉它所支持的请求方法 / CORS 中的预检请求
router.use(user.routes(), user.allowedMethods());
router.use(article.routes(), article.allowedMethods());

app.use(router.routes(), router.allowedMethods());

// error-handling
app.on("error", (err, ctx) => {
  log4js.error(`${err.stack}`);
});

module.exports = app;
