// Copyright 2019 Lewis Ardern. All rights reserved.

const validator = require('validator');
const Domain = require('./domain');

// Takes in an XHR response captured from the client-side
// It will check to see if a value includes Contact: (which is used in the spec e.g https://www.google.com/.well-known/security.txt
// Strip away Contact: and mailto: and remove any whitespace
// Once we have something like an email, we call validator which will check to see if its a email
// If emails exist, it will append to the array, which will be used to send automated email
exports.processSecurityText = domain => {
  let securityTxtEmail = [];
  if (domain.hasSecurityTxt) {
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
  }
  if (securityTxtEmail[0] === undefined) {
    securityTxtEmail = null;
  }
  return securityTxtEmail;
};

exports.processInnerHTML = (domain, config) => {
  let configureInnerHtml = null;
  if (domain.innerHTML) {
    configureInnerHtml = domain.innerHTML;
  }
  if (domain.openerInnerHTML) {
    configureInnerHtml = domain.openerInnerHTML;
  }
  if (config.intrusiveLevel !== 1 && domain.innerHTML) {
    const nodes = configureInnerHtml.split(',');
    configureInnerHtml = '';
    nodes.forEach(node => {
      const strippedNode = node.replace('--', '');
      configureInnerHtml += `${strippedNode}<br/>`;
    });
  }
  return configureInnerHtml;
};

exports.processDomain = (data, config) => {
  const domain = Domain.fromPayload(unescape(data), config);
  domain.hasSecurityTxt = this.processSecurityText(domain);
  domain.innerHTML = this.processInnerHTML(domain, config);
  return domain;
};
