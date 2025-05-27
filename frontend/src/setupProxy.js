// frontend/src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api', // This is the path that will trigger the proxy (e.g., /api/users/login)
    createProxyMiddleware({
      target: 'http://localhost:5005', // The URL of your backend server
      changeOrigin: true, // Recommended for virtual hosted sites (often helps with local dev)
    })
  );

  // If you have other API paths that don't start with /api, you can add more app.use blocks:
  // app.use(
  //   '/another-backend-route',
  //   createProxyMiddleware({
  //     target: 'http://localhost:5000',
  //     changeOrigin: true,
  //   })
  // );
};