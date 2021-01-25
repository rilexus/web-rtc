const { createProxyMiddleware } = require('http-proxy-middleware');


module.exports = function (app) {
  const apiProxy = createProxyMiddleware(
    `/${process.env.REACT_APP_API_PREFIX}`,
    {
      target: `${process.env.REACT_APP_API_PROTOCOL}://${process.env.REACT_APP_API_ADDRESS}:${process.env.REACT_APP_API_PORT}`,
    });
  const proxies = [apiProxy]

  proxies.forEach(proxy => {
    app.use(proxy);
  })
};