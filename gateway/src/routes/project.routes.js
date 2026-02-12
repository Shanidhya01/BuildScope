const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../utils/proxy");

module.exports = createProxyMiddleware({
  target: services.projects,
  changeOrigin: true,
  pathRewrite: (path) => `/projects${path}`
});
