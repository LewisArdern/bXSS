const validator = require('validator');
const payloads = require('./payloads');
import config from "config";

class Domain {
  data: Map<any, any>;
  config: any;
  static FIELDS: any;
  innerHTML: any;
  openerInnerHTML: any;

  constructor() {
    this.data = new Map();
    this.config = config;
  }

  static from(data) {
    const domain = new Domain();
    Domain.FIELDS.forEach(key => {
      let val = data[key];
      if (val === 'null' || val === undefined) val = null;
      domain[key] = val;
    });
    return domain;
  }

  static fromArray(arr = []) {
    const domain = {};
    Domain.FIELDS.forEach((key, idx) => {
      domain[key] = arr[idx];
    });
    return Domain.from(domain);
  }

  static fromPayload(payload) {
    return Domain.fromArray(unescape(payload).split(`\r\n\r\n${config.get<string>('boundary')}`));
  }

  html() {
    return this.innerHTML || this.openerInnerHTML;
  }
  processHTML(html) {
    if (config.get<number>('intrusiveLevel') !== 1 && html) {
      return html
        .split(',')
        .map(node => `${node}<br/>`)
        .join('');
    }
    return html;
  }
  setInnerHTML(html) {
    this.data.set('innerHTML', this.processHTML(html));
  }
  setOpenerInnerHTML(html) {
    this.data.set('openerInnerHTML', this.processHTML(html));
  }


  /**
   * Takes in an XHR response captured from the client-side
   *
   * It will check to see if a value includes Contact: (which is used in the
   * spec e.g https://www.google.com/.well-known/security.txt, Strip away Contact: and mailto: and remove any whitespace
   *
   * @param {string} securityTxt
   * @returns {array}
   */
  setHasSecurityTxt(securityTxt) {
    let securityTxtEmail = [];
    if (typeof securityTxt === 'string') {
      securityTxt.split('\r\n').forEach(item => {
        if (item.includes('Contact:')) {
          const email = item
            .replace('Contact:', '')
            .replace('mailto:', '')
            .trim();
          if (validator.isEmail(email) && !securityTxtEmail.includes(email))
            securityTxtEmail.push(email);
        }
      });
    }
    if (securityTxtEmail[0] === undefined) {
      securityTxtEmail = null;
    }
    this.data.set('hasSecurityTxt', securityTxtEmail);
  }
}

Domain.FIELDS = [
  'cookie',
  'innerHTML',
  'url',
  'openerLocation',
  'openerInnerHTML',
  'openerCookie',
  'hasSecurityTxt',
  'payload',
  'victimIP',
  'userAgent'
];

module.exports = Domain;