const check = require('./check');
const validator = require('validator');

exports.processDomain = (data, config) => {
  const domain = {
    Cookie: '', innerHTML: '', URL: '', openerLocation: '', openerInnerHTML: '', openerCookie: '', hasSecurityTxt: '', victimIP: '',
  };
  const fields = data.split(`\r\n\r\n${config.boundary}`);
  let i = 0;
  for (const key in domain) {
    domain[key] = fields[i++];
  }

  if (check.valueExists(domain.hasSecurityTxt)) {
    const securityTxtEmail = [];
    domain.hasSecurityTxt.split('\r\n').forEach((item) => {
      if (item.includes('Contact:')) {
        const email = item.replace('Contact:', '').replace('mailto:', '').trim();
        if ((validator.isEmail(email))) {
          if (!securityTxtEmail.includes(email)) {
            securityTxtEmail.push(email);
          }
        }
      }
    });
    if (securityTxtEmail !== []) {
      domain.hasSecurityTxt = securityTxtEmail;
    } else {
      domain.hasSecurityTxt = 'null';
    }
  }

  if (config.intrusiveLevel !== 1) {
    let configureInnerHtml = '';
    if (check.valueExists(domain.innerHTML)) {
      configureInnerHtml = domain.innerHTML.replace('--', '');
    }
    if (check.valueExists(domain.openerInnerHTML)) {
      configureInnerHtml = domain.openerInnerHTML.replace('--', '');
    }
    const nodes = configureInnerHtml.split(',');
    let computedNodes = '';
    nodes.forEach((node) => {
      const strippedNode = node.replace('--', '');
      computedNodes += `${strippedNode}\r\n`;
    });
    domain.innerHTML = computedNodes.replace('--', '');
  } else if (check.valueExists(domain.openerInnerHTML)) {
    domain.innerHTML = domain.openerInnerHTML;
  }
  return domain;
};
