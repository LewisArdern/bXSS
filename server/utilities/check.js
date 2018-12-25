// Copyright 2018 Lewis Ardern. All rights reserved.

const fs = require('fs');
const path = require('path');
const moment = require('moment');

const dir = path.normalize(`${__dirname}/../../server/found`);
const urls = path.normalize(`${__dirname}/../../server/found/urls.txt`);
const date = path.normalize(`${__dirname}/../../server/found/date.txt`);

// Checks if configuration values are defined or not
exports.configurationValueExists = config => Object.values(config).every(x => (x !== undefined));

// Checks if values sent from client-side payload has a value or did not capture anything
exports.valueExists = (value) => {
  if (value == 'null') {
    return false;
  } return true;
};

// Checks if config.intrusiveLevel is set to 1 or not, if its set to 1 then we capture everything
exports.isIntrusive = (value) => {
  if (value === 1) {
    return true;
  } return false;
};

// Checks if folders exist, creates otherwise
exports.folderOrFileExists = () => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  if (!fs.existsSync(urls)) {
    fs.writeFileSync(urls, 'http://example.com:3000/index.html\r\n', (err) => {
      if (err) throw err;
      console.log(`Created ${urls}`);
    });
  }
  if (!fs.existsSync(date)) {
    fs.writeFileSync(date, moment().subtract(1, 'day').format('YYYY-MM-DD'), (err) => {
      if (err) throw err;
      console.log(`Created ${date}`);
    });
  }
};

// Checks if URL already exists, if exists, wont save to disk or send via SMS
exports.domainExists = (domain) => {
  const lines = fs.readFileSync(urls, 'utf8')
    .toLowerCase().split('\n')
    .map(Function.prototype.call, String.prototype.trim);
  return lines.indexOf(domain.URL.toLowerCase().trim()) !== -1;
};

// Check to see if we sent an SMS in the last day
exports.lastSms = () => {
  const lastDate = fs.readFileSync(date, 'utf8').trim();
  const currentTime = moment().format('YYYY-MM-DD');
  return moment(currentTime).isSame(lastDate);
};
