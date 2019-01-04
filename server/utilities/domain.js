// Copyright 2019 Lewis Ardern. All rights reserved.

/* eslint-disable no-unused-vars */
class Domain {
  constructor({
    cookie,
    innerHTML,
    url,
    openerLocation,
    openerInnerHTML,
    openerCookie,
    hasSecurityTxt,
    victimIP,
    userAgent
  }) {
    const data = new Map();
    if (arguments.length > 0) {
      Domain.FIELDS.forEach(key => {
        // eslint-disable-next-line prefer-rest-params
        let value = arguments[0][key];
        if (value === 'null' || value === undefined) value = null;
        data.set(key, value);
      });
    }
    this._data = data;
  }
  [Symbol.iterator]() {
    return this._data.iterator();
  }
  get cookie() {
    return this._data.get('cookie');
  }
  get innerHTML() {
    return this._data.get('innerHTML');
  }
  set innerHTML(newInnerHTML) {
    this._data.set('innerHTML', newInnerHTML);
  }
  get url() {
    return this._data.get('url');
  }
  set url(newURL) {
    this._data.set('url', newURL);
  }
  get openerLocation() {
    return this._data.get('openerLocation');
  }
  get openerInnerHTML() {
    return this._data.get('openerInnerHTML');
  }
  get openerCookie() {
    return this._data.get('openerCookie');
  }
  get hasSecurityTxt() {
    return this._data.get('hasSecurityTxt');
  }
  set hasSecurityTxt(newEmail) {
    this._data.set('hasSecurityTxt', newEmail);
  }
  get victimIP() {
    return this._data.get('victimIP');
  }
  set victimIP(newIP) {
    this._data.set('victimIP', newIP);
  }
  get userAgent() {
    return this._data.get('userAgent');
  }
  set userAgent(newUserAgent) {
    this._data.set('userAgent', newUserAgent);
  }
  static fromArray(arr) {
    const domain = {};
    // eslint-disable-next-line no-return-assign
    Domain.FIELDS.forEach((key, idx) => (domain[key] = arr[idx]));
    return new Domain(domain);
  }
  static fromPayload(payload, config) {
    return Domain.fromArray(payload.split(`\r\n\r\n${config.boundary}`), config);
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
