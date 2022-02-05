import path = require('path');
import * as fs from 'fs';
import moment = require('moment');

const dir = path.normalize(`${__dirname}/../../build/found/`);
const urls = path.normalize(`${dir}urls.txt`);
const date = path.normalize(`${dir}date.txt`);
import template = require('./templates/markdown');
import save = require('./save');
/**
 * TODO
 */
exports.send = (domain) => {
  const file = `${dir}${domain.identifier}.md`;
  save.saveDomain(domain.url);
  fs.appendFileSync(file, template.createMarkdownTemplate(domain));
};


/**
 * TODO
 */
export function saveTodaysDate() {
  fs.writeFileSync(date, moment().format('YYYY-MM-DD'));
};

export function saveDomain(url: string) {
  fs.readFile(urls, 'utf8', (readFileError, data) => {
    if (data.indexOf(url) !== -1) {
      console.log('Domain already exists, no need to write again');
      return;
    }
    if (readFileError) {
      console.log(`Read error: ${readFileError}`);
      return;
    }
    fs.appendFile(urls, `${url}\n`, saveFileError =>
      saveFileError ? console.log(`Save error: ${saveFileError}`) : ''
    );
  });
}
