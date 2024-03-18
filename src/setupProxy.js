const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app) {
  app.use(
    "/https://api.emailjs.com", // Your API endpoint
    createProxyMiddleware({
      target: "https://api.emailjs.com",
      changeOrigin: true,
      secure: false,
    })
  );
};
