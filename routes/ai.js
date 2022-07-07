const router = require("koa-router")();
const util = require("../utils/util");
const { textToVoice } = require("../controller/ai");
router.prefix("/ai");

router.post("/tts", async (ctx) => {
  try {
    const { text } = ctx.request.body;
    // console.log("ctx.request", ctx.request);
    console.log(" text", text);
    const res = await textToVoice(text);
    console.log("res", res);
    console.dir(res);
    ctx.body = res;
    ctx.set("Content-Type", "blob");
    // ctx.type = "Blob";
    // ctx.body = res;
  } catch (error) {
    console.log(" 错误", error);
    ctx.body = util.fail(error.msg);
  }
});

module.exports = router;
