// Copyright 2019 Lewis Ardern. All rights reserved.

const Twilio = require('twilio');
const check = require('../check');
const moment = require('moment');
const fs = require('fs');
const path = require('path');

const datePath = path.normalize(`${__dirname}/../../../server/found/date.txt`);

exports.sendSMS = (guid, domain, config, save) => {
  if (check.configurationValueExists([config.twilio])) {
    if (check.configurationValueExists([config.twilio.accountSid, config.twilio.authToken])) {
      const client = new Twilio(config.twilio.accountSid, config.twilio.authToken);
      config.twilio.to.forEach(element => {
        const payload = {
          body: `You have a new potential Blind XSS for domain ${domain.url} for ${guid}`,
          to: element,
          from: config.twilio.from
        };
        client.messages
          .create(payload)
          .then(message =>
            console.log(`SMS send to ${element} from ${config.twilio.from} MSG ID ${message.sid}`)
          );
        save.saveTodaysDate();
      });
    } else {
      console.log('You need to configure your twilio account');
      save.saveTodaysDate();
    }
  } else {
    console.log('You need to configure your twilio account');
    save.saveTodaysDate();
  }
};

// Check to see if we sent an SMS in the last day
exports.lastSms = () => {
  const lastDate = fs.readFileSync(datePath, 'utf8').trim();
  const currentTime = moment().format('YYYY-MM-DD');
  return currentTime === lastDate;
};
