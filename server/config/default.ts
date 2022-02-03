export default {
  url: 'localhost',
  boundary: '#!!!!#',
  bodyLimit: '50mb',
  // 1 to capture everything, 0 for non-intrusive
  intrusiveLevel: 0,
  website: {
    port: 80, 
    tls: {
      port:443,
      publicKey: `./fullchain.pem`,
      privateKey: `./privkey.pem`,
      ca: `./chain.pem`
    },
  },
  services: {
    slack: {
      token: process.env.SLACK_TOKEN,
      channel: 'begbounty',
    },
    twilio: {
      accountSid: '',
      authToken: process.env.TWILIO_TOKEN,
      to: ['+1'],
      from: ['']
    },
    twitter: {
      consumer_key: process.env.TWITTER_KEY,
      consumer_secret: process.env.TWITTER_SECRET,
      access_token_key: process.env.TWITTER_TOKEN,
      access_token_secret: process.env.TWITTER_TOKEN_SECRET,
      recipient_id: ['']
    },
    github: {
      accessToken: process.env.GITHUB_TOKEN,
      repo: process.env.GITHUB_REPO,
    },
    discord: {
      token: process.env.DISCORD_TOKEN,
      channel: '',
    },
    cisco: {
      token: process.env.SPARK_TOKEN,
      sparkRoom: [''],
    },
    smtp: {
      password: process.env.SMTP_PASSWORD,
      username: '',
      port: 469,
      host: '',
      tls: true,
      to: [''],
    },
  },
};