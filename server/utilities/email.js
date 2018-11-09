const nodemailer = require('nodemailer');
const validator = require('validator');

const securityTxtEmail = [];

function valueExists(value) {
  if (value == 'null') {
    return false;
  } return true;
}
function isIntrusive(value) {
  if (value === 1) {
    return true;
  } return false;
}
function structureDomNodes(f) {
  let structured = '';
  const b = f.split('\r\n');
  b.forEach((value) => {
    structured += `${value}<br/>`;
  });
  return structured;
}

const createTemplate = (domain, config) => `
<!DOCTYPE HTML>
<HTML style="font-family: sans-serif; margin: 0; padding-left: 1em;">
    <body>

            <h1 style="color: #3E5C9F; height: 1em">New XSS Detected for ${domain.URL}</h1>
            ${valueExists(domain.hasSecurityTxt) ? `<div class="panel panel-default" style="height: 4em">
                <div class="panel-heading"><h3 style="color: #EE9C4F">Automated Message</h3></div>
                <div class="panel-body" style="padding-left: 1em">This is an automated security report, the following domain has a /.well-known/.security.txt contact defined.<br/> Please respond to this email to discuss further.</a></div>
            </div>` : ''}
            <div class="panel panel-default" style="height: 4em">
                <div class="panel-heading"><h3 style="color: #EE9C4F">URL</h3></div>
                <div class="panel-body" style="padding-left: 1em"><a href="${domain.URL}" style="text-decoration: none; color: #9EDB46">${domain.URL}</a></div>
            </div>
            <div class="panel panel-default" style="height: 4em">
                <div class="panel-heading"><h3 style="color: #EE9C4F">Affected IP</h3></div>
                <div class="panel-body" style="padding-left: 1em"><a href="https://www.whois.com/whois/${domain.victimIP}" style="text-decoration: none; color: #9EDB46">${domain.victimIP}</a></div>
            </div>
            ${valueExists(domain.Cookie) ? `<div class="panel panel-default" style="height: 4em">
            <div class="panel-heading"><h3 style="color: #EE9C4F">Cookies</h3>${domain.Cookie}</div>
            <div class="panel-body" style="padding-left: 1em; color: #696969"></div>
        </div>` : ''}
              
          ${valueExists(domain.openerLocation) ? `<div class="panel panel-default" style="height: 4em">
                    <div class="panel-heading"><h3 style="color: #EE9C4F">openerLocation</h3></div>
                    <div class="panel-body" style="padding-left: 1em; color: #696969">${domain.openerLocation}</div>
            </div>` : ''}
            ${valueExists(domain.openerCookie) ? `<div class="panel panel-default" style="height: 4em">
                    <div class="panel-heading"><h3 style="color: #EE9C4F">openerCookie</h3></div>
                    <div class="panel-body" style="padding-left: 1em; color: #696969">${domain.openerCookie}</div>
            </div>` : ''}
            ${isIntrusive(config.intrusiveLevel) ? `<div class="panel panel-default" style="height: 4em">
                <div class="panel-heading"><h3 style="color: #EE9C4F">innerHTML</h3></div>
                <div class="panel-body" style="padding: 1em; width: 50%; font-family: courier, Inconsolata; background-color: #DCDCDC; color: black">
                    <pre><code>${domain.innerHTML}</code></pre>
                </div>
            </div>` : `<div class="panel panel-default" style="height: 9em;padding-bottom: 5px">
            <div class="panel-heading"><h3 style="color: #EE9C4F">DOM Structure</h3></div>
            <div class="panel-body style="padding-bottom: 10px" ">
                This payload is non-intrusve, it will only capture HTML elements, not the entire body.<br/>
                ${structureDomNodes(domain.innerHTML)}
            </div>
        </div>`}
    </body>
</HTML>`;

function mailOptions(config, mail, guid, domain, message) {
  return {
    from: config.gmail.from,
    to: mail,
    subject: `${message} ${domain.URL} ${guid}`,
    html: createTemplate(domain, config),
  };
}

exports.sendMail = (guid, domain, config) => {
  if (!!config.gmail.user && !!config.gmail.pass && !!config.gmail.to && !!config.gmail.from) {
    if (domain.hasSecurityTxt !== 'null') {
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
    }

    // TODO: Add more email support options, add tokens rather than creds.
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.gmail.user,
        pass: config.gmail.pass,
      },
    });
    config.gmail.to.forEach((email) => {
      const options = mailOptions(config, email, guid, domain, 'New Blind XSS |');
      smtpTransport.sendMail(options, (error, response) => console.log(error || `Mail sent to ${email} for URL ${domain.URL}!`));
    });

    if (securityTxtEmail.length > 0) {
      securityTxtEmail.forEach((email) => {
        const options = mailOptions(config, email, guid, domain, 'Auto-Report - Blind XSS - For');
        smtpTransport.sendMail(options, (error, response) => console.log(error || `Auto Report mail sent to ${email} for URL ${domain.URL}!`));
      });
    }
  } else {
    console.log('You need to configure your gmail account');
  }
};

