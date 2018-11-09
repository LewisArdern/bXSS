const Slack = require('slack');

exports.sendSlack = (guid, domain, config) => {
  if (config.slack !== undefined &&
    config.slack.token !== undefined
    && config.slack.channel !== undefined) {

    const token = config.slack.token || '(no token)';
    const mail = config.gmail.to || '(no email configured), saved to disk';
    const text = `There is a new potential Blind XSS for domain ${domain.URL}, email sent to ${mail} with the GUID: ${guid}`;

    const bot = new Slack({ token });

    bot.channels.list({ token }, (err, json) => {
      const channel = json.channels.filter(c => c.name === config.slack.channel)[0].id;
      const params = { token, text, channel };
      //  post a message there
      bot.chat.postMessage(params, (err1, data) => {
        if (err1) {
          console.error(err1);
        } else {
          console.log(`Sent Slack Message to channel ${channel} for URL ${domain.URL}`);
        }
      });
    });
  } else {
    console.log('You need to configure your slack account');
  }
};
