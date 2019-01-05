const save = require('../../../server/utilities/save');
const fs = require('fs');

describe('saveDomain', () => {
  const readFilemock = jest.spyOn(fs, 'readFile');
  const writeFileMock = jest.spyOn(fs, 'appendFile');

  test('Should save domain to file as it does not currently exist inside urls.txt', () => {
    const domain = {
      url: 'https://example.com/vulnerable.txt'
    };
    readFilemock.mockImplementation((file, option, cb) =>
      cb(null, 'https://example.com:1000/test.html\r\nhttp://vulnerable.com/xss')
    );
    writeFileMock.mockImplementation((url, data, cb) => (cb ? console.log(cb) : ''));
    save.saveDomain(domain);
    expect(writeFileMock).toBeCalled();
    writeFileMock.mockRestore();
    readFilemock.mockRestore();
  });

  test('Should not save domain to file as it currently exist inside urls.txt', () => {
    const domain = {
      url: 'https://example.com/vulnerable.txt'
    };
    readFilemock.mockImplementation((file, option, cb) =>
      cb(null, 'https://example.com/vulnerable.txt')
    );
    writeFileMock.mockImplementation((url, data, cb) => (cb ? console.log(cb) : ''));
    save.saveDomain(domain);
    expect(writeFileMock).not.toBeCalled();

    readFilemock.mockRestore();
    writeFileMock.mockRestore();
  });
});
