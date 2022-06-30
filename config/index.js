const jwtKey = "wise-eye-jwt-key";
const unlessApi = [/login/g, /register/];
const config = {
  jwtKey,
  unlessApi,
};
module.exports = config;
