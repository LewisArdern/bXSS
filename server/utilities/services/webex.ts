const Webex = require('webex');
const template = require('../templates/markdown');
import config from '../../config';

const { services } = config;

exports.send = (domain) => {
  if (services.cisco.person && services.cisco.token) {

  const text = template.createMarkdownTemplate(domain, config);

  const webex = Webex.init({
    credentials: {
      access_token: services.cisco.token
    }
  });
  webex.rooms.create({ title: `New Blind XSS - ${domain.url}` }).then(room => {
    return Promise.all([
      webex.memberships.create({
        roomId: room.id,
        personEmail: `${services.cisco.person}`
      }),
    ]).then(() =>
      webex.messages.create({
        markdown: text,
        roomId: room.id
      })
      .catch((error) => {
        console.error(error);
      })
    );
  });
}
};
