const save = require('../../../server/utilities/save');
const fs = require('fs');
const today = require('moment')().format('YYYY-MM-DD');

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
    writeFileMock.mockImplementation((url, data, err) =>
      console.log(err || 'Domain Saved To Disk')
    );
    save.saveDomain(domain);
    expect(writeFileMock).toHaveBeenCalled();
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
    writeFileMock.mockImplementation((url, data, err) =>
      console.log(err || 'Domain Saved To Disk')
    );
    save.saveDomain(domain);
    expect(writeFileMock).not.toHaveBeenCalled();

    readFilemock.mockRestore();
    writeFileMock.mockRestore();
  });
});

describe('saveTodaysDate', () => {
  const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync');
  writeFileSyncMock.mockImplementation((date, data, err) =>
    console.log(err || 'Todays date was saved in date.txt')
  );

  save.saveTodaysDate();
  expect(writeFileSyncMock.mock.calls[0][1]).toBe(today);
  expect(writeFileSyncMock).toHaveBeenCalled();
});
