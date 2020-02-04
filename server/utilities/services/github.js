const github = require('octonode');
const template = require('../templates/reporting');

exports.send = (guid, domain, config) => {
  if (!config.isValid(['github.accessToken', 'github.repo'])) {
    console.log('You need to configure your github account');
    return;
  }

  const client = github.client(config.github.accessToken);

  const text = template.createMarkdownTemplate(domain, config);

  const ghrepo = client.repo(config.github.repo);

  // TODO: Read the github issue list to prevent 'spam'.
  // Read if domain.url is in the title of returned results
  // If its in returned results then don't send
  ghrepo.issue(
    {
      title: `New bXSS For ${domain.url}`,
      body: text
    },
    error => console.log(error || `Github issue created for ${config.github.repo}`)
  );
};
