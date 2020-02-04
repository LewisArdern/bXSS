const Slack = require('slack');
const template = require('../templates/reporting');

exports.send = (guid, domain, config) => {
  if (!config.isValid(['slack.token', 'slack.channel'])) {
    console.log('You need to configure your slack account');
    return;
  }

  const token = config.slack.token || '';
  const text = template.createSimplifiedMarkdownTemplate(domain, config);

  const bot = new Slack({ token });
  bot.channels.list({ token }, (err, json) => {
    if (err) {
      console.log(err);
    } else {
      const channel = json.channels.filter(c => c.name === config.slack.channel)[0].id;
      const params = { token, text, channel };
      //  post a message there
      bot.chat.postMessage(params, err1 => {
        if (err1) {
          console.error(err1);
        } else {
          console.log(`Sent Slack Message to channel ${channel} for URL ${domain.url}`);
        }
      });
    }
  });
};
