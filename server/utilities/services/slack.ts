import { WebClient } from "@slack/web-api";
import template = require('../templates/markdown');
import config from '../../config';

const { services } = config;

exports.send = async (domain,cnfg) => {
  if (services.slack.token && services.slack.channel) {

  const text = template.createSimplifiedMarkdownTemplate(domain, cnfg);
  const client = new WebClient(services.slack.token);
  try {
    await client.chat.postMessage({
      channel: services.slack.channel,
      text: text
    });
    console.log(`Message sent to ${services.slack.channel} channel`);
  }
  catch (error) {
    console.error(error);
  }

}
};