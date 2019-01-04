// Copyright 2019 Lewis Ardern. All rights reserved.

const Discord = require('discord.js');
const check = require('../check');
const markdown = require('../templates/markdown');

function sendMessage(guid, domain, config, bot) {
  const channelName = config.discord.channel || '';
  const text = markdown.createDiscordSimplifiedMarkdownTemplate(domain, config, guid);

  bot.channels.find(channel => channel.name === channelName).send(text);
}

exports.sendDiscord = (guid, domain, config) => {
  if (check.configurationValueExists([config.discord])) {
    if (check.configurationValueExists([config.discord.token, config.discord.channel])) {
      const client = new Discord.Client();
      client
        .login(config.discord.token)
        .then(() => {
          sendMessage(guid, domain, config, client);
          console.log(`Discord Message Sent To ${config.discord.channel} Channel`);
        })
        .catch(err => {
          console.error('Error with Discord:', err);
        });
    } else {
      console.log('You need to configure your discord account');
    }
  } else {
    console.log('You need to configure your discord account');
  }
};
