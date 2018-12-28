/* eslint-disable no-restricted-syntax */
/* eslint-disable guard-for-in */
// Copyright 2018 Lewis Ardern. All rights reserved.

const check = require('./check');
const validator = require('validator');

function processSecurityText(domain) {
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
  if (securityTxtEmail === []) {
    securityTxtEmail = 'null';
  }
  return securityTxtEmail;
}

function processInnerHTML(domain) {
  let configureInnerHtml = '';
  if (check.valueExists(domain.innerHTML)) {
    configureInnerHtml = domain.innerHTML.replace('--', '');
  }
  if (check.valueExists(domain.openerInnerHTML)) {
    configureInnerHtml = domain.openerInnerHTML.replace('--', '');
  }
  const nodes = configureInnerHtml.split(',');
  let computedNodes = '';
  nodes.forEach(node => {
    const strippedNode = node.replace('--', '');
    computedNodes += `${strippedNode}\r\n`;
  });
  return computedNodes.replace('--', '');
}

exports.processDomain = (data, config) => {
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
  const fields = data.split(`\r\n\r\n${config.boundary}`);
  let i = 0;
  for (const key in domain) {
    // eslint-disable-next-line no-plusplus
    domain[key] = fields[i++];
  }
  console.log(check.valueExists(domain.hasSecurityTxt));
  if (check.valueExists(domain.hasSecurityTxt)) {
    domain.hasSecurityTxt = processSecurityText(domain);
  }

  if (config.intrusiveLevel !== 1) {
    domain.innerHTML = processInnerHTML(domain);
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
