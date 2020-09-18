const { createProxyMiddleware } = require("http-proxy-middleware");
module.exports = function (app) {
  app.use(
    ["/fetch-masks",'/filter-masks','/change-limit-reached','/remove-item-from-inventory','/create-payment-intent','/create-order','/public-key','/payment'],
    createProxyMiddleware({
        target: "http://localhost:5000",
      })
    );
  };