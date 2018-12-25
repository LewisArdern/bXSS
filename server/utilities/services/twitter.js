// Copyright 2018 Lewis Ardern. All rights reserved.

const Twitter = require('twitter-lite');
const check = require('../check');

exports.sendTwitter = (guid, domain, config) => {
  if (check.configurationValueExists([config.twitter])) {
    if (check.configurationValueExists([config.twitter.consumer_key, config.twitter.consumer_secret,
      config.twitter.access_token_key, config.twitter.access_token_secret])) {
      const client = new Twitter({
        consumer_key: config.twitter.consumer_key,
        consumer_secret: config.twitter.consumer_secret,
        access_token_key: config.twitter.access_token_key,
        access_token_secret: config.twitter.access_token_secret,
      });
      config.twitter.recipient_id.map(async (recipientId) => {
        await client.post('direct_messages/events/new', {
          event: {
            type: 'message_create',
            message_create: {
              target: {
                recipient_id: recipientId,
              },
              message_data: {
                text: `You have a new potential Blind XSS for domain ${domain.URL} for ${guid}`,
              },
            },
          },
        });
      });
    } else {
      console.log('You need to configure Twitter');
    }
  } else {
    console.log('You need to configure Twitter');
  }
};

