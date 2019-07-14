const xss = require('../controllers/xss');

module.exports = app => {
  // Whenever _ body is sent via /m/ POST it will trigger the capture request
  app.post('/m', xss.capture);
  // Captures HTTP interactions for example var x = New Image;x.src='//localhost/mH';
  app.get('/mH', xss.capture);
  // This GET query show's payloads that can be used when testing for bXSS.
  app.get('/payloads', xss.generatePayloads);
  // This GET query show's the disclaimer to the victim
  app.get('/disclaimer', xss.displayDisclaimer);
  // just shows alert(1), for normal xss.
  app.get('/alert', xss.displayDefault);
  // For CSP Base href redirection
  app.get('*', xss.displayScript);
};
