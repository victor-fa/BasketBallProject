const proxy = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(proxy('/api', { target: 'http://toysburgadmin.mediahx.com', pathRewrite: {'/api': '/'}, changeOrigin: true}));
};