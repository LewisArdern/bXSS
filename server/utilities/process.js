/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
// Copyright 2018 Lewis Ardern. All rights reserved.

const check = require('./check');
const validator = require('validator');

// Takes in an XHR response captured from the client-side
// It will check to see if a value includes Contact: (which is used in the spec e.g https://www.google.com/.well-known/security.txt
// Strip away Contact: and mailto: and remove any whitespace
// Once we have something like an email, we call validator which will check to see if its a email
// If emails exist, it will append to the array, which will be used to send automated email
exports.processSecurityText = domain => {
  let securityTxtEmail = [];
  domain.hasSecurityTxt.split('\r\n').forEach(item => {
    if (item.includes('Contact:')) {
      const email = item
        .replace('Contact:', '')
        .replace('mailto:', '')
        .trim();
      if (validator.isEmail(email)) {
        if (!securityTxtEmail.includes(email)) {
          securityTxtEmail.push(email);
        }
      }
    }
  });

  if (securityTxtEmail[0] === undefined) {
    securityTxtEmail = 'null';
  }
  return securityTxtEmail;
};

// Once we know the payload was set to be non-intrusive, we want to structure DOM nodes to send
exports.processInnerHTML = domain => {
  let configureInnerHtml = '';
  if (check.valueExists(domain.innerHTML)) {
    configureInnerHtml = domain.innerHTML;
  }
  if (check.valueExists(domain.openerInnerHTML)) {
    configureInnerHtml = domain.openerInnerHTML;
  }
  const nodes = configureInnerHtml.split(',');
  let computedNodes = '';
  nodes.forEach(node => {
    const strippedNode = node.replace('--', '');
    computedNodes += `${strippedNode}\r\n`;
  });

  return computedNodes;
};

exports.processDomain = (data, config) => {
  const dataToProcess = unescape(data);
  const domain = {
    Cookie: '',
    innerHTML: '',
    URL: '',
    openerLocation: '',
    openerInnerHTML: '',
    openerCookie: '',
    hasSecurityTxt: '',
    victimIP: ''
  };
  const fields = dataToProcess.split(`\r\n\r\n${config.boundary}`);
  let i = 0;
  for (const key in domain) {
    // eslint-disable-next-line no-plusplus
    domain[key] = fields[i++];
  }

  if (check.valueExists(domain.hasSecurityTxt)) {
    domain.hasSecurityTxt = this.processSecurityText(domain);
  }
  if (!check.isIntrusive(config.intrusiveLevel)) {
    domain.innerHTML = this.processInnerHTML(domain);
  } else if (check.valueExists(domain.openerInnerHTML)) {
    domain.innerHTML = domain.openerInnerHTML;
  }
  return domain;
};

exports.structureDomNodes = f => {
  let structured = '';
  const b = f.split('\r\n');
  b.forEach(value => {
    structured += `${value}<br/>`;
  });
  return structured;
};
