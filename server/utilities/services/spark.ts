const ciscospark = require('ciscospark');
const template = require('../templates/markdown');
import config from '../../config';

const { services } = config;

exports.send = (domain) => {
  if (services.cisco.sparkRoom && services.cisco.token) {

  const text = template.createMarkdownTemplate(domain, config);
  const teams = ciscospark.init({
    credentials: {
      access_token: services.cisco.token
    }
  });
  teams.rooms.create({ title: `New Blind XSS - ${domain.url}` }).then(room =>
    Promise.all([
      services.cisco.sparkRoom.forEach(email => {
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
}
};
