const jwtKey = "wise-eye-jwt-key";
// 不进行jwt校验的URL
const unlessApi = [/login/g, /register/, /admin/];

/**
 * 移动云密钥相关
 */
const accessKey = "e92231e062f74fd9840959bb4c1f076d";
const secretKey = "d2c03cd246cc4612a157d596ddc283d2";
const requestMethod = "POST";

const config = {
  jwtKey,
  unlessApi,
  accessKey,
  secretKey,
  requestMethod,
};
module.exports = config;
