process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";
require('dotenv').config({ override: true, path: __dirname + '/config/.env' })
import userConfig from 'config';

interface Config {
  /** url e.g. example.com. */
  url: string;
  /** The boundary to split the payload. */
  boundary: string;

  bodyLimit: string;

  intrusiveLevel: number;

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
    twilio: {
      accountSid?: string,
      authToken?: string,
      to?: Array<string>,
      from?: Array<string>,
    },
    slack: {
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

function set_service(configProperty){
  if(userConfig.has(configProperty)) {
    return userConfig.get(configProperty)
  }  else {
    return undefined
  }
}

let config: Config = {
  url: userConfig.get<string>('url'),
  bodyLimit: userConfig.get<string>('bodyLimit'),
  boundary: userConfig.get<string>('boundary'),
  intrusiveLevel: userConfig.get<number>('intrusiveLevel'),
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
    twilio: {
      accountSid: set_service('services.twilio.accountSid'),
      authToken: set_service('services.twilio.authToken'),
      to: set_service('services.twilio.to'),
      from: set_service('services.twilio.from'),
    },
    slack: {
      token: set_service('services.slack.token'),
      channel: set_service('services.slack.channel'),
    },
    // twitter: {
    //   consumer_key: userConfig.get<string>('services.twitter.consumer_key'),
    //   consumer_secret: userConfig.get<string>('services.twitter.consumer_secret'),
    //   access_token_key: userConfig.get<string>('services.twitter.access_token_key'),
    //   access_token_secret: userConfig.get<string>('services.twitter.access_token_secret'),
    //   recipient_id: userConfig.get<Array<string>>('services.twitter.recipient_id'),
    // },
    github: {
      accessToken: set_service('services.github.accessToken'),
      repo: set_service('services.github.repo'),
    },
    discord: {
      token: set_service('services.discord.token'),
      channel: set_service('services.discord.channel'),
    },
    // cisco: {
    //   token: userConfig.get<string>('services.cisco.token'),
    //   sparkRoom: userConfig.get<Array<string>>('services.cisco.sparkRoom'),
    // },
    smtp: {
      password: set_service('services.smtp.password'),
      username: set_service('services.smtp.username'),
      port: set_service('services.smtp.port'),
      host: set_service('services.smtp.host'),
      tls: set_service('services.smtp.tls'),
      to: set_service('services.smtp.to'),
    }
   }
};

export default config;