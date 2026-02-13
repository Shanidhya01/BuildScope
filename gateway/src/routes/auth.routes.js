const { createProxyMiddleware, fixRequestBody } = require("http-proxy-middleware");
const services = require("../utils/proxy");

module.exports = createProxyMiddleware({
  target: services.auth,
  changeOrigin: true,
  pathRewrite: {
    "^/auth": ""
  },
  on: {
    proxyReq: (proxyReq, req, res) => {
      fixRequestBody(proxyReq, req, res);
    }
  }
});
