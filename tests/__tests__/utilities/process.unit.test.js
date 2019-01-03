const process = require('../../../server/utilities/process');

describe('processDomain', () => {
  test('Should return processed values for domain with Cookie, innerHTML, and URL, other values null or undefined', () => {
    const domain = process.processDomain(
      'test%3Atest%0D%0A%0D%0A%23%21%21%21%21%23%3Chead%3E%3Cstyle%20type%3D%22text/css%22%3E@charset%20%22UTF-8%22%3B%5Bng%5C%3Acloak%5D%2C%5Bng-cloak%5D%2C%5Bdata-ng-cloak%5D%2C%5Bx-ng-cloak%5D%2C.ng-cloak%2C.x-ng-cloak%2C.ng-hide%3Anot%28.ng-hide-animate%29%7Bdisplay%3Anone%20%21important%3B%7Dng%5C%3Aform%7Bdisplay%3Ablock%3B%7D.ng-animate-shim%7Bvisibility%3Ahidden%3B%7D.ng-anchor%7Bposition%3Aabsolute%3B%7D%3C/style%3E%3C/head%3E%3Cbody%3E%0A%3Ch1%3EThis%20is%20secret%20content%3C/h1%3E%0A%3Cdiv%3E%0A%3Cscript%20src%3D%22https%3A//cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.0/angular.js%22%3E%3C/script%3E%0A%3Cdiv%20id%3D%22test%22%20class%3D%22test123%22%3E%0A%3Cscript%3Edocument.cookie%3D%22test%3Atest%22%3C/script%3E%0A%3Cdiv%20ng-app%3D%22%22%3E%0A%0A%0A%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3Cscript%20src%3D%22//localhost/m%22%3E%3C/script%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/body%3E%0D%0A%0D%0A%23%21%21%21%21%23http%3A//localhost%3A1000/test.html%0D%0A%0D%0A%23%21%21%21%21%23null%0D%0A%0D%0A%23%21%21%21%21%23null%0D%0A%0D%0A%23%21%21%21%21%23null%0D%0A%0D%0A%23%21%21%21%21%23null',
      { boundary: '#!!!!#', intrusiveLevel: 1 }
    );

    expect(domain.Cookie).toBe('test:test');
    expect(domain.URL).toBe('http://localhost:1000/test.html');
    expect(domain.innerHTML).toContain(
      '<script src="https://cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.0/angular.js"></script>'
    );
    expect(domain.innerHTML).toContain('<script>document.cookie="test:test"</script>');
    expect(domain.innerHTML).toContain('<h1>This is secret content</h1>');
    expect(domain.innerHTML).toContain('<div ng-app="">');
    expect(domain.openerLocation).toBe('null');
    expect(domain.openerCookie).toBe('null');
    expect(domain.openerInnerHTML).toBe('null');
    expect(domain.hasSecurityTxt).toBe('null');
    expect(domain.victimIP).toBe(undefined);
  });

  test('Should return processed values for domain with Cookie, innerHTML, and URL, hasSecurityTxt, other values null or undefined', () => {
    const domain = process.processDomain(
      'test%3Atest%0D%0A%0D%0A%23%21%21%21%21%23%3Chead%3E%3Cstyle%20type%3D%22text/css%22%3E@charset%20%22UTF-8%22%3B%5Bng%5C%3Acloak%5D%2C%5Bng-cloak%5D%2C%5Bdata-ng-cloak%5D%2C%5Bx-ng-cloak%5D%2C.ng-cloak%2C.x-ng-cloak%2C.ng-hide%3Anot%28.ng-hide-animate%29%7Bdisplay%3Anone%20%21important%3B%7Dng%5C%3Aform%7Bdisplay%3Ablock%3B%7D.ng-animate-shim%7Bvisibility%3Ahidden%3B%7D.ng-anchor%7Bposition%3Aabsolute%3B%7D%3C/style%3E%3C/head%3E%3Cbody%3E%0A%3Ch1%3EThis%20is%20secret%20content%3C/h1%3E%0A%3Cdiv%3E%0A%3Cscript%20src%3D%22https%3A//cdnjs.cloudflare.com/ajax/libs/angular.js/1.6.0/angular.js%22%3E%3C/script%3E%0A%3Cdiv%20id%3D%22test%22%20class%3D%22test123%22%3E%0A%3Cscript%3Edocument.cookie%3D%22test%3Atest%22%3C/script%3E%0A%3Cdiv%20ng-app%3D%22%22%3E%0A%0A%0A%20%20%20%20%20%20%20%0A%20%20%20%20%20%20%20%20%3Cscript%20src%3D%22//localhost/m%22%3E%3C/script%3E%3C/div%3E%3C/div%3E%3C/div%3E%3C/body%3E%0D%0A%0D%0A%23%21%21%21%21%23http%3A//localhost%3A81/hi%0D%0A%0D%0A%23%21%21%21%21%23null%0D%0A%0D%0A%23%21%21%21%21%23null%0D%0A%0D%0A%23%21%21%21%21%23null%0D%0A%0D%0A%23%21%21%21%21%23Contact%3A%20https%3A//g.co/vulnz%0D%0AContact%3A%20mailto%3Alewisardern@live.co.uk%0D%0AEncryption%3A%20https%3A//services.google.com/corporate/publickey.txt%0D%0AAcknowledgements%3A%20https%3A//bughunter.withgoogle.com/%0D%0APolicy%3A%20https%3A//g.co/vrp%0D%0AHiring%3A%20https%3A//g.co/SecurityPrivacyEngJobs%0D%0A',
      { boundary: '#!!!!#', intrusiveLevel: 1 }
    );

    expect(domain.Cookie).toBe('test:test');
    expect(domain.innerHTML).toContain('<script>document.cookie="test:test"</script>');
    expect(domain.innerHTML).toContain('<h1>This is secret content</h1>');
    expect(domain.innerHTML).toContain('<div ng-app="">');
    expect(domain.URL).toBe('http://localhost:81/hi');
    expect(domain.openerLocation).toBe('null');
    expect(domain.openerCookie).toBe('null');
    expect(domain.openerInnerHTML).toBe('null');
    expect(domain.hasSecurityTxt).toMatchObject(['lewisardern@live.co.uk']);
    expect(domain.victimIP).toBe(undefined);
  });

  test('Should return processed values for domain with innerHTML (non-intrusive), and URL, other values null or undefined', () => {
    const domain = process.processDomain(
      'null%0D%0A%0D%0A%23%21%21%21%21%23SCRIPT%2CDIV--%2CDIV-test123-test%2CDIV--%2CBODY--%2CHTML--%0D%0A%0D%0A%23%21%21%21%21%23http%3A//localhost%3A1000/test.html%0D%0A%0D%0A%23%21%21%21%21%23null%0D%0A%0D%0A%23%21%21%21%21%23null%0D%0A%0D%0A%23%21%21%21%21%23null%0D%0A%0D%0A%23%21%21%21%21%23null',
      { boundary: '#!!!!#', intrusiveLevel: 0 }
    );

    expect(domain.Cookie).toBe('null');
    expect(domain.innerHTML).toBe('SCRIPT\r\nDIV\r\nDIV-test123-test\r\nDIV\r\nBODY\r\nHTML\r\n');
    expect(domain.URL).toBe('http://localhost:1000/test.html');
    expect(domain.openerLocation).toBe('null');
    expect(domain.openerCookie).toBe('null');
    expect(domain.openerInnerHTML).toBe('null');
    expect(domain.hasSecurityTxt).toBe('null');
    expect(domain.victimIP).toBe(undefined);
  });
});

describe('processInnerHTML', () => {
  test('Should return each captured node on a new line', () => {
    const domain = {
      innerHTML: 'SCRIPT,DIV--,DIV-test123-test,DIV--,BODY--,HTML--',
      openerInnerHTML: 'null'
    };
    const innerHTML = process.processInnerHTML(domain);

    expect(innerHTML).toBe('SCRIPT\r\nDIV\r\nDIV-test123-test\r\nDIV\r\nBODY\r\nHTML\r\n');
  });
});

describe('processSecurityText', () => {
  test('Should return valid email and remove mailto: when XHR returns /.well-known/secuirty.txt', () => {
    const domain = {
      hasSecurityTxt:
        'Contact: https://g.co/vulnz\r\nContact: mailto:lewisardern@live.co.uk\r\nEncryption: https://services.google.com/corporate/publickey.txt\r\nAcknowledgements: https://bughunter.withgoogle.com/\r\nPolicy: https://g.co/vrp\r\nHiring: https://g.co/SecurityPrivacyEngJobs'
    };
    const securityText = process.processSecurityText(domain);

    expect(securityText).toMatchObject(['lewisardern@live.co.uk']);
  });
  test('Should return valid email when XHR returns /.well-known/secuirty.txt', () => {
    const domain = {
      hasSecurityTxt:
        'Contact: https://g.co/vulnz\r\nContact: lewisardern@live.co.uk\r\nEncryption: https://services.google.com/corporate/publickey.txt\r\nAcknowledgements: https://bughunter.withgoogle.com/\r\nPolicy: https://g.co/vrp\r\nHiring: https://g.co/SecurityPrivacyEngJobs'
    };
    const securityText = process.processSecurityText(domain);

    expect(securityText).toMatchObject(['lewisardern@live.co.uk']);
  });
  test('Should not return a valid email, should return "null" because lewisardern is not a valid email when XHR returns /.well-known/secuirty.txt', () => {
    const domain = {
      hasSecurityTxt:
        'Contact: https://g.co/vulnz\r\nContact: lewisardern\r\nEncryption: https://services.google.com/corporate/publickey.txt\r\nAcknowledgements: https://bughunter.withgoogle.com/\r\nPolicy: https://g.co/vrp\r\nHiring: https://g.co/SecurityPrivacyEngJobs'
    };
    const securityText = process.processSecurityText(domain);

    expect(securityText).toBe('null');
  });
});

describe('structureDomNodes', () => {
  test('Should append <br/> to each DOM Node For HTML Markdown Display', () => {
    const structure = 'SCRIPT\r\nDIV\r\nDIV-test123-test\r\nDIV\r\nBODY\r\nHTML';
    const domNode = process.structureDomNodes(structure);

    expect(domNode).toBe('SCRIPT<br/>DIV<br/>DIV-test123-test<br/>DIV<br/>BODY<br/>HTML<br/>');
  });
});
