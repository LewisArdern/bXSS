const Slack = require('slack');
const config = require('../config/config');


exports.sendSlack = (guid, domain) => {
  if (!!config.slack.token && !!config.slack.channel) {
    const token = config.slack.token;
    const mail = config.gmail.to || '(no email configured), saved to disk';
    const text = `There is a new potential Blind XSS for domain ${domain.URL}, email sent to ${mail} with the GUID: ${guid}`;

    const bot = new Slack({ token });

    bot.channels.list({ token }, (err, json) => {
      const channel = json.channels.filter(c => c.name === config.slack.channel)[0].id;
      const params = { token, text, channel };
      //  post a message there
      bot.chat.postMessage(params, (err, data) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`Sent Slack Message to channel ${channel} for URL ${domain.URL}`);
        }
      });
    });
  } else {
    console.log('You need to configure your slack account');
  }
};
