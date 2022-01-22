const { WebClient, LogLevel } = require("@slack/web-api");
const template = require('../templates/markdown');
import config from "config";


exports.send = async (domain) => {
  if (config.has('services.slack.channel') && config.has('services.slack.token')) {
  let channel = config.get<string>('services.slack.channel')
  let token = config.get<string>('services.slack.token')
  const text = template.createSimplifiedMarkdownTemplate(domain, config);
  const client = new WebClient(token);

  try {
    await client.chat.postMessage({
      channel: channel,
      text: text
    });

    console.log(`Message sent to ${channel} channel`);
  }
  catch (error) {
    console.error(error);
  }

}
};
