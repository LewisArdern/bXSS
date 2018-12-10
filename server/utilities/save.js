const path = require('path');

const dir = path.normalize(`${__dirname}/../../server/found/`);
const urls = path.normalize(`${dir}urls.txt`);
const date = path.normalize(`${dir}date.txt`);
const fs = require('fs');
const moment = require('moment');
const template = require('./templates/markdown');


exports.saveFile = (guid, domain, config) => {
  const file = `${dir}${guid}.md`;

  // save domain
  fs.appendFile(urls, `${domain.URL}\n`, err => (err ? console.log(err) : ''));

  // save to disk

  fs.appendFileSync(file, template.createMarkdownTemplate(domain, config), err => console.log(err || 'The file was saved!'));
};

exports.saveTodaysDate = () => {
  // This is only used as it's unlikely there will be more than one ping a day from bug bounties
  // will change to a shorter time if that changes.
  fs.writeFileSync(date, moment().format('YYYY:MM:DD'), err => console.log(err || 'The file was saved!'));
};
