const Discord = require('discord.js');
const markdown = require('../templates/markdown');

function sendMessage(guid, domain, config, bot) {
  const channelName = config.discord.channel || '';
  const text = markdown.createBasicMarkdown(domain, config, guid);

  bot.channels.find(channel => channel.name === channelName).send(text);
}

exports.send = (guid, domain, config) => {
  if (!config.isValid({ 'discord.token': 'string', 'discord.channel': 'string' })) {
    console.log('You need to configure your discord account');
    return;
  }

  const client = new Discord.Client();
  client
    .login(config.discord.token)
    .then(() => {
      sendMessage(guid, domain, config, client);
      console.log(`Discord Message Sent To ${config.discord.channel} Channel`);
    })
    .catch(err => console.error('Error with Discord:', err));
};
