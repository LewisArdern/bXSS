// Copyright 2019 Lewis Ardern. All rights reserved.

const validator = require('validator');

class Domain {
  constructor(config = {}) {
    this.data = new Map();
    this.config = config;
    return new Proxy(this, this);
  }

  static from(data, config = {}) {
    const domain = new Domain(config);
    Domain.FIELDS.forEach(key => {
      let val = data[key];
      if (val === 'null' || val === undefined) val = null;
      domain[key] = val;
    });
    return domain;
  }

  static fromArray(arr = [], config = {}) {
    const domain = {};
    Domain.FIELDS.forEach((key, idx) => {
      domain[key] = arr[idx];
    });
    return Domain.from(domain, config);
  }

  static fromPayload(payload, config = {}) {
    return Domain.fromArray(unescape(payload).split(`\r\n\r\n${config.boundary}`), config);
  }

  get(_, prop) {
    if (this[prop] !== undefined) {
      return this[prop];
    }
    const getter = `get${prop.charAt(0).toUpperCase()}${prop.slice(1)}`;
    if (typeof this[getter] === 'function') {
      return this[getter]();
    }
    return this.data.get(prop);
  }
  set(_, prop, value) {
    const setter = `set${prop.charAt(0).toUpperCase()}${prop.slice(1)}`;
    if (typeof this[setter] === 'function') {
      this[setter](value);
    } else {
      this.data.set(prop, value);
    }
    return true;
  }
  [Symbol.iterator]() {
    return this.data.iterator();
  }

  html() {
    return this.innerHTML || this.openerInnerHTML;
  }
  processHTML(html) {
    if (this.config.intrusiveLevel !== 1 && html) {
      return (html || '')
        .split(',')
        .map(node => `${node.replace('--', '')}<br/>`)
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

  /*
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
  'victimIP',
  'userAgent'
];

module.exports = Domain;
