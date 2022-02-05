import nodemailer = require('nodemailer');
const nodemailerMarkdown = require('nodemailer-markdown').markdown;
import template = require('../templates/markdown');

import config from '../../config';

const { services } = config;

function mailOptions(mail, domain, message) {
  return {
    from: services.smtp.username,
    to: mail,
    subject: `${message} ${domain.url} ${domain.identifier}`,
    markdown: template.createMarkdownTemplate(domain)
  };
}

exports.send = (domain) => {
  console.log('host'+services.smtp.host + services.smtp.password+ 'host'+ services.smtp.port+ 'host'+ services.smtp.to + services.smtp.username)
  if (services.smtp.host && services.smtp.password && services.smtp.port && services.smtp.to && services.smtp.username) {

    const smtpTransport = nodemailer.createTransport({
      host: services.smtp.host,
      port: services.smtp.port,
      secure: services.smtp.tls,
      auth: {
        user: services.smtp.username,
        pass: services.smtp.password
      }
    });

    smtpTransport.verify(verifyError => {
      if (verifyError) {
        console.log(`Error with your SMTP config: ${verifyError}`);
      } else {
        smtpTransport.use('compile', nodemailerMarkdown());
        services.smtp.to.forEach(email => {
          const options = mailOptions(email, domain, 'New Blind XSS |');
          smtpTransport.sendMail(options, error => {
            console.log(error || `Mail sent to ${email} for URL ${domain.url}!`);
          });
        });
        if (domain.hasSecurityTxt) {
          domain.hasSecurityTxt.forEach(email => {
            const options = mailOptions(email, domain, 'Auto-Report - Blind XSS - For');
            smtpTransport.sendMail(options, error => {
              console.log(error || `Auto Report mail sent to ${email} for URL ${domain.url}!`);
            });
          });
        }
      }
    });
}
};
