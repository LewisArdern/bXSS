const fs = require('fs');

const Domain = require('../../../server/utilities/domain');
const save = require('../../../server/utilities/save');
const today = require('moment')().format('YYYY-MM-DD');

describe('saveDomain', () => {
  const readFilemock = jest.spyOn(fs, 'readFile');
  const writeFileMock = jest.spyOn(fs, 'appendFile');
  const domain = Domain.from({ url: 'https://example.com/vulnerable.txt' });

  beforeEach(() => {
    writeFileMock.mockImplementation((url, data, err) =>
      console.log(err || 'Domain Saved To Disk')
    );
  });

  afterEach(() => {
    writeFileMock.mockRestore();
    readFilemock.mockRestore();
  });

  it('Should save domain to file as it does not currently exist inside urls.txt', () => {
    readFilemock.mockImplementation((file, option, cb) =>
      cb(null, 'https://example.com:1000/test.html\r\nhttp://vulnerable.com/xss')
    );
    save.saveDomain(domain);
    expect(writeFileMock).toHaveBeenCalled();
  });

  it('Should not save domain to file as it currently exist inside urls.txt', () => {
    readFilemock.mockImplementation((file, option, cb) =>
      cb(null, 'https://example.com/vulnerable.txt')
    );
    save.saveDomain(domain);
    expect(writeFileMock).not.toHaveBeenCalled();
  });
});

describe('saveTodaysDate', () => {
  it("should save today's date in a text file", () => {
    const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync');
    writeFileSyncMock.mockImplementation((date, data, err) => {
      console.log(err || 'Todays date was saved in date.txt');
    });

    save.saveTodaysDate();
    expect(writeFileSyncMock.mock.calls[0][1]).toBe(today);
    expect(writeFileSyncMock).toHaveBeenCalled();
    writeFileSyncMock.mockRestore();
  });
});
