const express = require('express');
const https = require('https');
const fs = require('fs');
const save = require('./server/utilities/save');

const app = express();
const config = require('./server/utilities/config')();

require('./server/config/express')(app);
require('./server/config/routes')(app, config);

save.folderOrFileExists();

app.listen(config.port.http, () => console.log(`bXSS listening on port ${config.port.http}`));
if (config.isValid(['letsEncrypt.TLS'])) {
  const options = {
    // TODO Handle error if these keys don't exist
    cert: fs.readFileSync(config.letsEncrypt.publicKey),
    key: fs.readFileSync(config.letsEncrypt.privateKey),
    ca: fs.readFileSync(config.letsEncrypt.ca)
  };
  https.createServer(options, app).listen(config.port.https);
}
