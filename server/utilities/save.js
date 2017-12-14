const path = require('path');

const dir = path.normalize(`${__dirname}/../../server/found/`);
const urls = path.normalize(`${dir}urls.txt`);
const date = path.normalize(`${dir}date.txt`);
const fs = require('fs');
const moment = require('moment');

exports.saveFile = (guid, domain) => {
  const file = `${dir}${guid}.txt`;

  // save domain
  fs.appendFile(urls, `${domain.URL}\n`, err => (err ? console.log(err) : ''));

  // save to disk
  for (const [key, value] of Object.entries(domain)) {
    fs.appendFileSync(file, `${key}: ${value}\r\n\r\n`, err => console.log(err || 'The file was saved!'));
  }
};

exports.saveTodaysDate = () => {
  // This is only used as it's unlikely I'll ever get more than one ping a day from bug bounties
  // will change to a shorter time if that changes.
  fs.writeFileSync(date, moment().format('YYYY:MM:DD'), err => console.log(err || 'The file was saved!'));
};
