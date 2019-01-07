process.env.NODE_PATH = __dirname;
require('module').Module._initPaths();

//
const express = require('express');
const fs = require('fs');
const https = require('https');

const app = express();
const config = require('server/utilities/config');
const path = require('path');

const dir = path.normalize(`${__dirname}/server/found/`);
const urls = path.normalize(`${dir}urls.txt`);
const date = path.normalize(`${dir}date.txt`);
const moment = require('moment');

require('server/config/express')(app);
require('server/config/routes')(app, config);

/**
 * Checks if folders exist, creates them otherwise.
 */

if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
if (!fs.existsSync(urls)) {
  fs.writeFileSync(urls, 'http://example.com:3000/index.html\r\n', err => {
    if (err) throw err;
    console.log(`Created ${urls}`);
  });
}
if (!fs.existsSync(date)) {
  fs.writeFileSync(
    date,
    moment()
      .subtract(1, 'day')
      .format('YYYY-MM-DD'),
    err => {
      if (err) throw err;
      console.log(`Created ${date}`);
    }
  );
}

app.listen(config.port.http, () => console.log(`bXSS listening on port ${config.port.http}`));
if (config.isValid(['letsEncrypt.TLS'])) {
  if (
    fs.existsSync(config.letsEncrypt.publicKey) &&
    fs.existsSync(config.letsEncrypt.privateKey) &&
    fs.readFileSync(config.letsEncrypt.ca) &&
    config.letsEncrypt.TLS === true
  ) {
    const options = {
      cert: fs.readFileSync(config.letsEncrypt.publicKey),
      key: fs.readFileSync(config.letsEncrypt.privateKey),
      ca: fs.readFileSync(config.letsEncrypt.ca)
    };
    https.createServer(options, app).listen(config.port.https);
  }
}
