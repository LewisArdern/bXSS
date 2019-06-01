const bodyParser = require('body-parser');
const helmet = require('helmet');
const config = require('../utilities/config');

module.exports = app => {
  app.use(helmet()); // Remove x-powered and add default security headers
  app.use(bodyParser.json({ limit: config.bodyLimit })); // to support JSON-encoded bodies
  app.use(
    bodyParser.urlencoded({
      limit: config.bodyLimit,
      // to support URL-encoded bodies
      extended: true
    })
  );
};
