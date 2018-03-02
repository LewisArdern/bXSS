const express = require('express');
const config = require('./server/config/config');
const https = require('https');
const fs = require('fs');

const app = express();

require('./server/config/express')(app);
require('./server/config/routes')(app, config);


if (config.letsEncrypt.TLS) {
  const options = {
    cert: fs.readFileSync(config.letsEncrypt.publicKey),
    key: fs.readFileSync(config.letsEncrypt.privateKey),
    ca: fs.readFileSync(config.letsEncrypt.ca),

  };
  app.listen(config.port, () => console.log(`bXSS listening on port ${config.port}`));
  https.createServer(options, app).listen(8443);
} else {
  app.listen(config.port, () => console.log(`bXSS listening on port ${config.port}`));
}

