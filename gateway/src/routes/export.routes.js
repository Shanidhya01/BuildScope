const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../utils/proxy");

module.exports = createProxyMiddleware({
  target: services.export,
  changeOrigin: true,
  pathRewrite: {
    "^/export": ""
  }
});
