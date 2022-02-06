const Twilio = require('twilio');
const moment = require('moment');
const fs = require('fs');
import save = require('../save');
import sms = require('./sms');
const path = require('path');

const datePath = path.normalize(`${__dirname}/../../../build/found/date.txt`);

import config from '../../config';

const { services } = config;

exports.send = (domain) => {
  if (services.twilio.accountSid && services.twilio.authToken && services.twilio.from && services.twilio.to) { 
  
  if (!sms.lastSms()) {
    const client = new Twilio(services.twilio.accountSid, services.twilio.authToken);
    services.twilio.to.split(',').forEach(element => {
      client.messages
        .create({
          from: services.twilio.from,
          to: element,
          body: `You have a new potential Blind XSS for domain ${domain.url} for ${domain.identifier}`
        })
        .then(message =>
          console.log(`SMS send to ${element} from ${services.twilio.from} MSG ID ${message.sid}`)
        );
      save.saveTodaysDate();
    });
  } else {
    console.log(`Already Sent SMS Today`);
  }
}
};

export function lastSms() {

  const lastDate = fs.readFileSync(datePath, 'utf8').trim();
  const currentTime = moment().format('YYYY-MM-DD');
  return currentTime === lastDate;
};
