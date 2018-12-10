const check = require('../check');
const path = require('path');

const dir = path.normalize(`${__dirname}/../../found/`);

// Full Markdown For Email Reporting
exports.createMarkdownTemplate = (domain, config) => `
# bXSS Report

${check.valueExists(domain.hasSecurityTxt) ? `## Security Contact
The affected URL has a /.well-known/.security.txt contact ${domain.hasSecurityTxt}
${check.configurationValueExists([config.gmail]) ? `${check.configurationValueExists([config.gmail.user, config.gmail.pass, config.gmail.to, config.gmail.from]) ? 'who has been automatically notified.' : 'who you can contact.'}` : 'who you can contact.' }` : ''}

## Details

The following URL ${domain.URL} is succeptible to [Cross-Site-Scripting (XSS)](https://www.owasp.org/index.php/Cross-site_Scripting_(XSS)). XSS attacks occur when an attacker uses a web application to send malicious code, to a different end user. Flaws that allow these attacks to succeed are quite widespread and occur anywhere a web application uses input from a user within the output it generates without validating or encoding it.

An attacker can use XSS to send a malicious script to an unsuspecting user. The end user’s browser has no way to know that the script should not be trusted, and will execute the script. Because it thinks the script came from a trusted source, the malicious script can access any cookies, session tokens, or other sensitive information retained by the browser and used with that site. These scripts can even rewrite the content of the HTML page.

For more details on the different types of XSS flaws, see: [Types Of XSS](https://www.owasp.org/index.php/Types_of_Cross-Site_Scripting)


### Domain
${domain.URL}

### Affected IP
[${domain.victimIP}](https://www.whois.com/whois/${domain.victimIP})

### User Agent
${domain.userAgent}

${check.valueExists(domain.Cookie) ? `### Cookies
${domain.Cookie}` : ''}
              
${check.valueExists(domain.openerLocation) ? `### openerLocation
${domain.openerLocation}` : ''}

${check.valueExists(domain.openerCookie) ? `### openerCookie
${domain.openerCookie}` : ''}


### Document Object Model (DOM) Structure
${check.isIntrusive(config.intrusiveLevel) ? `\`\`\`html
${domain.innerHTML}
\`\`\`
` : `The payload utilized was non-intrusve, it only captures HTML elements (nodeName, className, and id) not the entire innerHTML.

${process.structureDomNodes(domain.innerHTML)}`}

### Remediation

The general remediation to prevent Cross-Site Scripting is to either output encode, or contextually sanitize user-input before its interpreted by the browser.

For more information, see:

* [OWASP Testing Guide 4.0: Input Validation Testing](https://www.owasp.org/index.php/Testing_for_Input_Validation)
* [OWASP Cheat Sheet: Input Validation](https://www.owasp.org/index.php/Input_Validation_Cheat_Sheet)
* [OWASP Testing Guide 4.0: Client Side Testing ](https://www.owasp.org/index.php/Client_Side_Testing)
* [OWASP Cross Site Scripting Prevention Cheat Sheet ](https://www.owasp.org/index.php/XSS_%28Cross_Site_Scripting%29_Prevention_Cheat_Sheet)
* [OWASP DOM Based Cross Site Scripting Prevention Cheat Sheet ](https://www.owasp.org/index.php/DOM_based_XSS_Prevention_Cheat_Sheet)
* [OWASP Java Encoding Project](https://www.owasp.org/index.php/OWASP_Java_Encoder_Project)
* [Reducing XSS by way of Automatic Context-Aware Escaping in Template Systems](http://googleonlinesecurity.blogspot.com/2009/03/reducing-xss-by-way-of-automatic.html)
* [AngularJS Strict Contextual Escaping](https://docs.angularjs.org/api/ng/service/$sce)
* [AngularJS ngBind](https://docs.angularjs.org/api/ng/directive/ngBind)
* [Angular  Sanitzation](https://angular.io/guide/security#sanitization-and-security-contexts)
* [Angular Template Security](https://angular.io/guide/template-syntax#content-security)
* [ReactJS Escaping](https://reactjs.org/docs/introducing-jsx.html#jsx-prevents-injection-attacks)
`;

// Slack Template, ### etc does not work within slack.
exports.createSimplifiedMarkdownTemplate = (domain, config) => `
*bXSS Report*

${check.valueExists(domain.hasSecurityTxt) ? `## Security Contact
The affected URL has a /.well-known/.security.txt contact ${domain.hasSecurityTxt}
${check.configurationValueExists([config.gmail]) ? `${check.configurationValueExists([config.gmail.user, config.gmail.pass, config.gmail.to, config.gmail.from]) ? 'who has been automatically notified.' : 'who you can contact.'}` : 'who you can contact.' }` : ''}

*Domain*
${domain.URL}

*Affected IP*
[${domain.victimIP}](https://www.whois.com/whois/${domain.victimIP})

*User Agent*
${domain.userAgent}

${check.valueExists(domain.Cookie) ? `*Cookies*
${domain.Cookie}` : ''}
              
${check.valueExists(domain.openerLocation) ? `*openerLocation*
${domain.openerLocation}` : ''}

${check.valueExists(domain.openerCookie) ? `*openerCookie*
${domain.openerCookie}` : ''}


*Document Object Model (DOM) Structure*
${check.isIntrusive(config.intrusiveLevel) ? `\`\`\`html
${domain.innerHTML}
\`\`\`
` : `The payload utilized was non-intrusve, it only captures HTML elements (nodeName, className, and id) not the entire innerHTML.

${process.structureDomNodes(domain.innerHTML)}`}
`;

// Discord only allows upto 2000 characters!!!!
// so sadly if we are verbose the API will kill our message, so shorented on purpose
exports.createDiscordSimplifiedMarkdownTemplate = (domain, config, guid) => `
*bXSS Report - ${guid}*

${check.valueExists(domain.hasSecurityTxt) ? `*Security Contact*
The affected URL has a /.well-known/.security.txt contact ${domain.hasSecurityTxt}
${check.configurationValueExists([config.gmail]) ? `${check.configurationValueExists([config.gmail.user, config.gmail.pass, config.gmail.to, config.gmail.from]) ? 'who has been automatically notified.' : 'who you can contact.'}` : 'who you can contact.' }` : ''}

*Domain*
${domain.URL}

*Affected IP*
${domain.victimIP}
https://www.whois.com/whois/${domain.victimIP}

*User Agent*
${domain.userAgent}

${check.valueExists(domain.Cookie) ? `*Cookies*
${domain.Cookie}` : ''}
              
${check.valueExists(domain.openerLocation) ? `*openerLocation*
${domain.openerLocation}` : ''}

${check.valueExists(domain.openerCookie) ? `*openerCookie* 
${domain.openerCookie}` : ''}

See ${dir}${guid}.md for a full breakdown
`;
