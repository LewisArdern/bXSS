process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";
require('dotenv').config({ override: true, path: __dirname + '/config/.env' })
import userConfig from 'config';

interface Config {
  /** url e.g. example.com. */
  url: string;
  /** The boundary to split the payload. */
  boundary: string;

  bodyLimit: string;

  website: {
    port: number, 
    tls: {
      port:number,
      publicKey: string,
      privateKey: string,
      ca: string
    },
  },
  services: {
    twilio?: {
      accountSid: string,
      authToken: string,
      to: Array<string>,
      from: Array<string>,
    },
    slack?: {
      token: string,
      channel: string,
    },
    twitter?: {
      consumer_key: string,
      consumer_secret: string,
      access_token_key: string,
      access_token_secret: string,
      recipient_id: Array<string>,
    },
    github?: {
      accessToken: string,
      repo: string,
    },
    discord?: {
      token: string,
      channel: string,
    },
    cisco?: {
      token: string,
      sparkRoom: Array<string>,
    },
    smtp?: {
      password: string,
      username: string,
      port: number,
      host: string,
      tls: boolean,
      to: Array<string>,
    },
  },

}

const config: Config = {
  url: userConfig.get<string>('url'),
  bodyLimit: userConfig.get<string>('bodyLimit'),
  boundary: userConfig.get<string>('boundary'),
  website: {
    port: userConfig.get<number>('website.port'), 
    tls: {
        port: userConfig.get<number>('website.tls.port'),
        publicKey: userConfig.get<string>('website.tls.publicKey'),
        privateKey: userConfig.get<string>('website.tls.privateKey'),
        ca: userConfig.get<string>('website.tls.ca')
    },
  },
  services: {
    // twilio: {
    //   accountSid: userConfig.get<string>('services.twilio.accountSid'),
    //   authToken: userConfig.get<string>('services.twilio.authToken'),
    //   to: userConfig.get<Array<string>>('services.twilio.to'),
    //   from: userConfig.get<Array<string>>('services.twilio.from'),
    // },
    slack: {
      token: userConfig.get<string>('services.slack.token'),
      channel: userConfig.get<string>('services.slack.channel'),
    },
    // twitter: {
    //   consumer_key: userConfig.get<string>('services.twitter.consumer_key'),
    //   consumer_secret: userConfig.get<string>('services.twitter.consumer_secret'),
    //   access_token_key: userConfig.get<string>('services.twitter.access_token_key'),
    //   access_token_secret: userConfig.get<string>('services.twitter.access_token_secret'),
    //   recipient_id: userConfig.get<Array<string>>('services.twitter.recipient_id'),
    // },
    // github: {
    //   accessToken: userConfig.get<string>('services.github.accessToken'),
    //   repo: userConfig.get<string>('services.github.repo'),
    // },
    // discord: {
    //   token: userConfig.get<string>('services.discord.token'),
    //   channel: userConfig.get<string>('services.discord.channel'),
    // },
    // cisco: {
    //   token: userConfig.get<string>('services.cisco.token'),
    //   sparkRoom: userConfig.get<Array<string>>('services.cisco.sparkRoom'),
    // },
    // smtp: {
    //   password: userConfig.get<string>('services.smtp.password'),
    //   username: userConfig.get<string>('services.smtp.username'),
    //   port: userConfig.get<number>('services.smtp.port'),
    //   host: userConfig.get<string>('services.smtp.host'),
    //   tls: userConfig.get<boolean>('services.smtp.tls'),
    //   to: userConfig.get<Array<string>>('services.smtp.to'),
    // }
   }
};

export default config;