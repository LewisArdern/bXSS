const Twilio = require('twilio');

exports.sendSMS = (guid, domain, config, save) => {
  if (config.twilio !== undefined && config.twilio.accountSid !== undefined
    && config.twilio.authToken !== undefined) {
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
