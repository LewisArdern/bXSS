const bodyParser = require('body-parser');
const helmet = require('helmet');
const config = require('../utilities/config');
const cors = require('cors');

module.exports = app => {
  app.use(helmet()); // Remove x-powered and add default security headers
  app.use(cors()); // Use for payloads which perform XHR and trigger pre-flight.
  app.use(bodyParser.json({ limit: config.bodyLimit })); // to support JSON-encoded bodies
  app.use(
    bodyParser.urlencoded({
      limit: config.bodyLimit,
      // to support URL-encoded bodies
      extended: true
    })
  );
};
