const Discord = require('discord.js');
const markdown = require('../templates/markdown');

import config from '../../config';

const { services } = config;


function sendMessage(domain, bot) {
  const channelName = services.discord.channel || '';
  const text = markdown.createBasicMarkdown(domain);

  bot.channels.find(channel => channel.name === channelName).send(text);
}

exports.send = (domain) => {
  if (services.discord.channel && services.discord.token) {

  const client = new Discord.Client();
  client
    .login(services.discord.token)
    .then(() => {
      sendMessage(domain, client);
      console.log(`Discord Message Sent To ${services.discord.channel} Channel`);
    })
    .catch(err => console.error('Error with Discord:', err));
  }
};
