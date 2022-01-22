require('module').Module._initPaths();

import * as express from 'express';
import * as fs from 'fs';
import * as https from 'https';

const app = express();
require('dotenv').config({ override: true, path: __dirname + '/config/.env' })
import config from './config';

const { website, url  } = config;

import * as path from 'path';



const dir = path.normalize(`${__dirname}/found/`);
const urls = path.normalize(`${dir}urls.txt`);
const date = path.normalize(`${dir}date.txt`);
const moment = require('moment');

require('./config/express')(app);
require('./config/routes')(app);

/**
 * Checks if folders exist, creates them otherwise.
 */
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}
if (!fs.existsSync(urls)) {
  fs.writeFileSync(urls, 'http://example.com:3000/index.html\r\n');
}
if (!fs.existsSync(date)) {
  fs.writeFileSync(
    date,
    moment()
      .subtract(1, 'day')
      .format('YYYY-MM-DD')
  );
}
app.listen(website.port, () => console.log(`bXSS listening on port ${website.port}`));

let publicKey = website.tls.publicKey
let privateKey = website.tls.privateKey
let ca = website.tls.ca
if (
  fs.existsSync(publicKey) &&
  fs.existsSync(privateKey) &&
  fs.readFileSync(ca)
) {
  const options = {
    cert: fs.readFileSync(publicKey),
    key: fs.readFileSync(privateKey),
    ca: fs.readFileSync(ca)
  };
  https.createServer(options, app).listen(website.tls.port);
}

