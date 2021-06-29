const path = require('path');
const fs = require('fs');
const moment = require('moment');

const dir = path.normalize(`${__dirname}/../../server/found/`);
const urls = path.normalize(`${dir}urls.txt`);
const date = path.normalize(`${dir}date.txt`);
const template = require('./templates/markdown');

/**
 * TODO
 */
exports.send = (guid, domain, config) => {
  const file = `${dir}${guid}.md`;
  this.saveDomain(domain);
  fs.appendFileSync(file, template.createMarkdownTemplate(domain, config), err =>
    console.log(err || 'The file was saved!')
  );
};

/**
 * Save domain if it does not exist in urls.txt.
 * @param {Domain} domain
 */
exports.saveDomain = domain => {
  fs.readFile(urls, 'utf8', (readFileError, data) => {
    console.log(`1 ${data} + 2 ${domain.url} + 3 ${data.indexOf(domain.url)}`);
    if (data.indexOf(domain.url) !== -1) {
      console.log('Domain already exists, no need to write again');
      return;
    }
    if (readFileError) {
      console.log(`Read error: ${readFileError}`);
      return;
    }
    fs.appendFile(urls, `${domain.url}\n`, saveFileError =>
      saveFileError ? console.log(`Save error: ${saveFileError}`) : ''
    );
  });
};

/**
 * TODO
 */
exports.saveTodaysDate = () => {
  // This is only used as it's unlikely there will be more than one ping a day
  // from bug bounties change to a shorter time if that changes.
  fs.writeFileSync(date, moment().format('YYYY-MM-DD'), err =>
    console.log(err || 'Todays date was saved in date.txt')
  );
};
