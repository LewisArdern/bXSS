const ciscospark = require('ciscospark');
const check = require('./check');

exports.sendCiso = (guid, domain, config) => {
  if (check.exists([config.ciscoSpark, config.ciscoSpark.token, config.ciscoSpark.sparkRoom])) {
    const teams = ciscospark.init({
      credentials: {
        access_token: config.ciscoSpark.token,
      },
    });
    const text = `There is a new potential Blind XSS for domain ${domain.URL}, with the GUID: ${guid}`;

    teams.rooms.create({ title: `New Blind XSS - ${domain.URL}` }).then(room => Promise.all([
      config.ciscoSpark.sparkRoom.forEach((email) => {
        teams.memberships.create({
          roomId: room.id,
          personEmail: email,
        });
      }),
    ]).then(
      () =>
        console.log('Sending Webex Teams Message'),
      teams.messages.create({
        markdown: text,
        roomId: room.id,
      }),
    ));
  } else {
    console.log('You need to configure your Webex Teams account');
  }
};

