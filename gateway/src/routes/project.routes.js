const { createProxyMiddleware } = require("http-proxy-middleware");
const services = require("../utils/proxy");

module.exports = createProxyMiddleware({
  target: services.projects,
  changeOrigin: true,
  pathRewrite: (path) => `/projects${path}`,
  on: {
    proxyReq: (proxyReq, req) => {
      if (req.user?.uid) {
        proxyReq.setHeader("x-user-id", req.user.uid);
      }
    }
  }
});
