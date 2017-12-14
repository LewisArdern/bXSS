const bodyParser = require('body-parser');
const helmet = require('helmet');

module.exports = (app) => {  
  app.use(helmet()); // Remove x-powered and add default security headers
  app.use(bodyParser.json()); // to support JSON-encoded bodies
  app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true,
  }));
};
