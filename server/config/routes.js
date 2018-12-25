// Copyright 2018 Lewis Ardern. All rights reserved.

const xss = require('../controllers/xss');

module.exports = (app) => {
  // Whenever _ body is sent via /m/ POST it will trigger the capture request
  app.post('/m', xss.capture);
  // Displays the payload
  app.get('/m', xss.displayScript);
  // Captures HTTP interactions for example var x = New Image;x.src='//localhost/mH';
  app.get('/mH', xss.httpGet);
  // This GET query show's payloads that can be used when testing for bXSS.
  app.get('/payloads', xss.generatePayloads);
  // just shows alert(1), for normal xss.
  app.get('*', xss.displayDefault);
};
