const Twilio = require('twilio');
const check = require('./check');

exports.sendSMS = (guid, domain, config, save) => {
  if (check.exists([config.twilio, config.twilio.accountSid, config.twilio.authToken])) {
    const client = new Twilio(config.twilio.accountSid, config.twilio.authToken);
    config.twilio.to.forEach((element) => {
      const payload = {
        body: `You have a new potential Blind XSS for domain ${domain.URL} check the logs ${guid}`,
        to: element,
        from: config.twilio.from,
      };
      client.messages.create(payload).then(message => console.log(`SMS send to ${element} from ${config.twilio.from} MSG ID ${message.sid}`));
      save.saveTodaysDate();
    });
  } else {
    console.log('You need to configure your twilio account');
    save.saveTodaysDate();
  }
};
