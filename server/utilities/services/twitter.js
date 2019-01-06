// Copyright 2019 Lewis Ardern. All rights reserved.

const Twitter = require('twitter-lite');

exports.send = (guid, domain, config) => {
  const conf = config.twitter || {};
  if (
    !(
      conf.consumer_key &&
      conf.consumer_secret &&
      conf.access_token_key &&
      conf.access_token_secret
    )
  ) {
    console.log('You need to configure Twitter');
    return;
  }

  const client = new Twitter({
    consumer_key: config.twitter.consumer_key,
    consumer_secret: config.twitter.consumer_secret,
    access_token_key: config.twitter.access_token_key,
    access_token_secret: config.twitter.access_token_secret
  });
  config.twitter.recipient_id.map(async recipientId => {
    await client.post('direct_messages/events/new', {
      event: {
        type: 'message_create',
        message_create: {
          target: {
            recipient_id: recipientId
          },
          message_data: {
            text: `You have a new potential Blind XSS for domain ${domain.url} for ${guid}`
          }
        }
      }
    });
  });
};
