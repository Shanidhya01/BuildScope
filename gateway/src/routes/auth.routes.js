const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../utils/proxy");

module.exports = createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
  pathRewrite: {
    "^/auth": ""
  }
});
