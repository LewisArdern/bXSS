// Copyright 2019 Lewis Ardern. All rights reserved.

const ciscospark = require('ciscospark');
const check = require('../check');
const template = require('../templates/markdown');

exports.sendCiso = (guid, domain, config) => {
  if (check.configurationValueExists([config.ciscoSpark])) {
    if (check.configurationValueExists([config.ciscoSpark.token, config.ciscoSpark.sparkRoom])) {
      const teams = ciscospark.init({
        credentials: {
          access_token: config.ciscoSpark.token
        }
      });
      const text = template.createMarkdownTemplate(domain, config);

      teams.rooms.create({ title: `New Blind XSS - ${domain.url}` }).then(room =>
        Promise.all([
          config.ciscoSpark.sparkRoom.forEach(email => {
            teams.memberships.create({
              roomId: room.id,
              personEmail: email
            });
          })
        ]).then(
          () => console.log('Sending Webex Teams Message'),
          teams.messages.create({
            markdown: text,
            roomId: room.id
          })
        )
      );
    } else {
      console.log('You need to configure your Webex Teams account');
    }
  } else {
    console.log('You need to configure your Webex Teams account');
  }
};
