const Twitter = require('twitter-lite');
const template = require('../templates/reporting');

exports.send = (guid, domain, config) => {
  if (
    !config.isValid([
      'twitter.consumer_key',
      'twitter.consumer_secret',
      'twitter.access_token_key',
      'twitter.access_token_secret'
    ])
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
            text: template.createPlainText(domain, guid)
          }
        }
      }
    });
  });
};
