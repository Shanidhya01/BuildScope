const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../utils/proxy");

module.exports = createProxyMiddleware({
  target: services.export,
  changeOrigin: true,
  pathRewrite: {
    "^/export": ""
  },
  on: {
    proxyReq: (proxyReq, req) => {
      if (req.user?.uid) {
        proxyReq.setHeader("x-user-id", req.user.uid);
      }
    }
  }
});
