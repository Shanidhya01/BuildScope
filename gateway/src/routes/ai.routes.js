const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware");
const services = require("../utils/proxy");

module.exports = createProxyMiddleware({
  target: services.ai,
  changeOrigin: true,
  pathRewrite: (path) => `/ai${path}`,
  proxyTimeout: 60000,
  timeout: 60000,
  selfHandleResponse: false,
  on: {
    proxyReq: (proxyReq, req, res) => {
      fixRequestBody(proxyReq, req, res);
    }
  }
});
