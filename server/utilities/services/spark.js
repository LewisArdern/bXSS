const ciscospark = require('ciscospark');
const template = require('../templates/reporting');

exports.send = (guid, domain, config) => {
  if (!config.isValid(['ciscoSpark.token', 'ciscoSpark.sparkRoom'])) {
    console.log('You need to configure your Webex Teams account');
    return;
  }

  const text = template.createMarkdownTemplate(domain, config);
  const teams = ciscospark.init({
    credentials: {
      access_token: config.ciscoSpark.token
    }
  });
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
};
