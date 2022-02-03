import github = require('octonode');
import template = require('../templates/markdown');

import config from '../../config';

const { services } = config;

exports.send = async (domain) => {
  if (services.github.accessToken && services.github.repo) {

  const client = github.client(services.github.accessToken);

  const text = template.createMarkdownTemplate(domain);

  const ghrepo = client.repo(services.github.repo);

  ghrepo.issue(
    {
      title: `New bXSS For ${domain.url}`,
      body: text
    },
    error => console.log(error || `Github issue created for ${services.github.repo}`)
  );
}
};
