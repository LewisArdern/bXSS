const express = require('express');
const config = require('./server/config/config');
const https = require('https');
const fs = require('fs');
const check = require('./server/utilities/check');
const save = require('./server/utilities/save');

const app = express();

require('./server/config/express')(app);
require('./server/config/routes')(app, config);

save.folderOrFileExists();

if (check.configurationValueExists([config.letsEncrypt])) {
  if (config.letsEncrypt.TLS) {
    const options = {
      cert: fs.readFileSync(config.letsEncrypt.publicKey),
      key: fs.readFileSync(config.letsEncrypt.privateKey),
      ca: fs.readFileSync(config.letsEncrypt.ca)
    };
    app.listen(config.port.http, () => console.log(`bXSS listening on port ${config.port.http}`));
    https.createServer(options, app).listen(config.port.https);
  } else {
    app.listen(config.port.http, () => console.log(`bXSS listening on port ${config.port.http}`));
  }
} else {
  app.listen(config.port.http, () => console.log(`bXSS listening on port ${config.port.http}`));
}
