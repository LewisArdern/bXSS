// Copyright 2018 Lewis Ardern. All rights reserved.

const nodemailer = require('nodemailer');
const nodemailerMarkdown = require('nodemailer-markdown').markdown;
const template = require('../templates/markdown');
const check = require('../check');

function mailOptions(config, mail, guid, domain, message) {
  return {
    from: config.gmail.from,
    to: mail,
    subject: `${message} ${domain.URL} ${guid}`,
    markdown: template.createMarkdownTemplate(domain, config),
  };
}

exports.sendMail = (guid, domain, config) => {
  if (check.configurationValueExists([config.gmail])) {
    if (check.configurationValueExists([config.gmail.user, config.gmail.pass,
      config.gmail.to, config.gmail.from])) {
      // TODO: Add more email support options, add tokens rather than creds.
      const smtpTransport = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: config.gmail.user,
          pass: config.gmail.pass,
        },
      });
      smtpTransport.use('compile', nodemailerMarkdown());
      config.gmail.to.forEach((email) => {
        const options = mailOptions(config, email, guid, domain, 'New Blind XSS |');
        smtpTransport.sendMail(options, (error, response) => console.log(error || `Mail sent to ${email} for URL ${domain.URL}!`));
      });

      if (check.valueExists(domain.hasSecurityTxt)) {
        domain.hasSecurityTxt.forEach((email) => {
          const options = mailOptions(config, email, guid, domain, 'Auto-Report - Blind XSS - For');
          smtpTransport.sendMail(options, (error, response) => console.log(error || `Auto Report mail sent to ${email} for URL ${domain.URL}!`));
        });
      }
    } else {
      console.log('You need to configure your gmail account');
    }
  } else {
    console.log('You need to configure your gmail account');
  }
};

