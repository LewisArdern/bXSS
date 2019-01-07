process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

//
const express = require('express');
const fs = require('fs');
const https = require('https');

const app = express();
const config = require('server/utilities/config');
const save = require('server/utilities/save');

require('server/config/express')(app);
require('server/config/routes')(app, config);

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
