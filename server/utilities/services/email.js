// Copyright 2019 Lewis Ardern. All rights reserved.

const nodemailer = require('nodemailer');
const nodemailerMarkdown = require('nodemailer-markdown').markdown;
const template = require('../templates/markdown');

function mailOptions(config, mail, guid, domain, message) {
  return {
    from: config.gmail.from,
    to: mail,
    subject: `${message} ${domain.url} ${guid}`,
    markdown: template.createMarkdownTemplate(domain, config)
  };
}

exports.send = (guid, domain, config) => {
  const conf = config.gmail || {};
  if (!(conf.user && conf.pass && conf.to && conf.from)) {
    console.log('You need to configure your gmail account');
    return;
  }
  // TODO: Add more email support options, add tokens rather than creds.
  const smtpTransport = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: conf.user,
      pass: conf.pass
    }
  });

  smtpTransport.use('compile', nodemailerMarkdown());
  config.gmail.to.forEach(email => {
    const options = mailOptions(config, email, guid, domain, 'New Blind XSS |');
    smtpTransport.sendMail(options, error => {
      console.log(error || `Mail sent to ${email} for URL ${domain.url}!`);
    });
  });
  if (domain.hasSecurityTxt) {
    domain.hasSecurityTxt.forEach(email => {
      const options = mailOptions(config, email, guid, domain, 'Auto-Report - Blind XSS - For');
      smtpTransport.sendMail(options, error => {
        console.log(error || `Auto Report mail sent to ${email} for URL ${domain.url}!`);
      });
    });
  }
};
