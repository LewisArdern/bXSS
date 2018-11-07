const fs = require('fs');
const path = require('path');
const moment = require('moment');

const dir = path.normalize(`${__dirname}/../../server/found`);
const urls = path.normalize(`${__dirname}/../../server/found/urls.txt`);
const date = path.normalize(`${__dirname}/../../server/found/date.txt`);

exports.processDomain = (data, config) => {
  const domain = {
    Cookie: '', innerHTML: '', URL: '', openerLocation: '', openerInnerHTML: '', openerCookie: '', hasSecurityTxt: '', victimIP: '',
  };
  const fields = data.split(`\r\n\r\n${config.boundary}`);
  let i = 0;
  for (const key in domain) {
    domain[key] = fields[i++];
  }
  return domain;
};

// Checks if folders exist, creates otherwise
exports.checkExists = (domain) => {
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
    fs.writeFileSync(date, moment('2017:12:09').format('YYYY:MM:DD'), (err) => {
      if (err) throw err;
      console.log(`Created ${date}`);
    });
  }

  // Checks if URL already exists, if exists, wont save to disk or send via SMS
  const lines = fs.readFileSync(urls, 'utf8')
    .toLowerCase().split('\n')
    .map(Function.prototype.call, String.prototype.trim);
  return lines.indexOf(domain.URL.toLowerCase().trim()) !== -1;
};

// Check if SMS was sent in the last day
exports.lastSave = () => {
  const lastDate = fs.readFileSync(date, 'utf8').trim();
  const currentTime = moment().format('YYYY:MM:DD');
  return moment(currentTime).isSame(lastDate);
};
