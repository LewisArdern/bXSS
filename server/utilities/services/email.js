const nodemailer = require('nodemailer');
const nodemailerMarkdown = require('nodemailer-markdown').markdown;
const template = require('../templates/reporting');

function mailOptions(config, mail, guid, domain, message) {
  return {
    from: config.smtp.user,
    to: mail,
    subject: `${message} ${domain.url} ${guid}`,
    markdown: template.createMarkdownTemplate(domain, config)
  };
}

exports.send = (guid, domain, config) => {
  if (
    !config.isValid(['smtp.user', 'smtp.pass', 'smtp.to', 'smtp.host', 'smtp.port', 'smtp.tls'])
  ) {
    console.log('You need to configure smtp');
    return;
  }

  const smtpTransport = nodemailer.createTransport({
    host: config.smtp.host,
    port: config.smtp.port,
    secure: config.smtp.tls,
    auth: {
      user: config.smtp.user,
      pass: config.smtp.pass
    }
  });

  smtpTransport.verify(verifyError => {
    if (verifyError) {
      console.log(`Error with your SMTP config: ${verifyError}`);
    } else {
      smtpTransport.use('compile', nodemailerMarkdown());
      config.smtp.to.forEach(email => {
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
    }
  });
};
