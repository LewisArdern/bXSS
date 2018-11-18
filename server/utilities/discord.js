const Discord = require('discord.js');
const check = require('./check');

function sendMessage(guid, domain, config, bot) {
  const channelName = config.discord.channel || '';
  const mail = config.gmail.to || '(no email configured), saved to disk';
  const text = `There is a new potential Blind XSS for domain ${domain.URL}, email sent to ${mail} with the GUID: ${guid}`;

  bot.channels.find(channel => channel.name === channelName).send(text);
}

exports.sendDiscord = (guid, domain, config) => {
  if (check.exists([config.discord, config.discord.token, config.discord.channel])) {
    const client = new Discord.Client();
    client.login(config.discord.token).then(() => {
      sendMessage(guid, domain, config, client);
    }).catch((err) => {
      console.error('Error with Discord:', err);
    });
  } else {
    console.log('You need to configure your discord account');
  }
};
