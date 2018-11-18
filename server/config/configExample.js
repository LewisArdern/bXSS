const config = {};

config.twilio = {};
config.gmail = {};
config.slack = {};
config.discord = {};
config.letsEncrypt = {};

config.port = process.env.PORT || 3030;
config.url = process.env.url || 'example.com';
// used to split the results (dont remove)
config.boundary = process.env.boundary || '#!!!!#';

// Set to false by default (would recommend reverse proxy instead)
config.letsEncrypt.TLS = false;
config.letsEncrypt.publicKey = process.env.publicKey || `/etc/letsencrypt/live/${config.url}/fullchain.pem`;
config.letsEncrypt.privateKey = process.env.privateKey || `/etc/letsencrypt/live/${config.url}/privkey.pem`;
config.letsEncrypt.ca = process.env.ca || `/etc/letsencrypt/live/${config.url}/chain.pem`;

// Remove if you dont' want Twilio
config.twilio.accountSid = process.env.accountSid || '';
config.twilio.authToken = process.env.authToken || '';
config.twilio.to = process.env.twilioTo || ['']; // add additonal numbers with comma seperation e.g '+447000000', ''
config.twilio.from = process.env.twilioFrom || '';

// Remove if you dont want Discord
config.discord.token = process.env.discordToken || '';
config.discord.channel = process.env.discordChannel || '';

// Remove if you dont want Slack
config.slack.token = process.env.token || '';
config.slack.channel = process.env.slackChannel || '';

// Remove if you dont want Cisco Webex Teams
config.ciscoSpark.token = process.env.sparkToken || '';
config.ciscoSpark.sparkRoom = process.env.sparkRoom || ['']; // add additonal emails with comma seperation e.g 'youremail@gmail.com', ''

// Remove if you dont want Gmail
config.gmail.user = process.env.gmailUser || 'example@gmail.com';
config.gmail.pass = process.env.gmailPass || '';
config.gmail.to = process.env.gmailTo || ['youremail@domain.com']; // add additonal emails with comma seperation '', ''
config.gmail.from = process.env.gmailFrom || 'example@gmail.com';

// 1 Everything
// 0 Just DOM Nodes
config.intrusiveLevel = 0;

module.exports = config;
