const Twitter = require('twitter-lite');
import config from '../../config';

const { services } = config;

exports.send = (domain) => {
  if (services.twitter.access_token_key && services.twitter.access_token_secret 
    && services.twitter.consumer_key && services.twitter.consumer_secret
    && services.twitter.recipient_id) {

  const client = new Twitter({
    consumer_key: services.twitter.consumer_key,
    consumer_secret: services.twitter.consumer_secret,
    access_token_key: services.twitter.access_token_key,
    access_token_secret: services.twitter.access_token_secret
  });
  services.twitter.recipient_id.split(',').map(async recipientId => {
    await client.post('direct_messages/events/new', {
      event: {
        type: 'message_create',
        message_create: {
          target: {
            recipient_id: recipientId
          },
          message_data: {
            text: `You have a new potential Blind XSS for domain ${domain.url} for ${domain.identifier}`
          }
        }
      }
    });
  });
}
};
