// Copyright 2018 Lewis Ardern. All rights reserved.

const Slack = require('slack');
const check = require('../check');
const template = require('../templates/markdown');

exports.sendSlack = (guid, domain, config) => {
  if (check.configurationValueExists([config.slack])) {
    if (check.configurationValueExists([config.slack.token, config.slack.channel])) {
      const token = config.slack.token || '(no token)';
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
              console.log(`Sent Slack Message to channel ${channel} for URL ${domain.URL}`);
            }
          });
        }
      });
    } else {
      console.log('You need to configure your slack account');
    }
  } else {
    console.log('You need to configure your slack account');
  }
};
