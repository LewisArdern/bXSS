import bodyParser = require('body-parser');
import helmet = require('helmet');
import config from '../config';
import cors = require('cors');

const { bodyLimit } = config

module.exports = app  => {
  app.use(helmet()); // Remove x-powered and add default security headers
  app.use(cors()); // Use for payloads which perform XHR and trigger pre-flight.
  app.use(bodyParser.json({ limit: bodyLimit })); // to support JSON-encoded bodies
  app.use(
    bodyParser.urlencoded({
      limit: bodyLimit,
      // to support URL-encoded bodies
      extended: true
    })
  );
};
