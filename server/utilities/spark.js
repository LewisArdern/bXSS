const ciscospark = require('ciscospark');

exports.sendCiso = (guid, domain, config) => {
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
  ]).then(() =>
    teams.messages.create({
      markdown: text,
      roomId: room.id,
    })));
};

