const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // ...You can now register proxies as you wish!
  app.use(createProxyMiddleware('/train', { 
    target: 'http://127.0.0.1:8080',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
     "^/train": "/"
    },
   }));
   app.use(createProxyMiddleware('/manage', { 
    target: 'http://127.0.0.1:9090',
    secure: false,
    changeOrigin: true,
    pathRewrite: {
     "^/manage": "/"
    },
   }));
};