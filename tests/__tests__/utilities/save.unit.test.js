const fs = require('fs');

const Domain = require('server/utilities/domain');
const save = require('server/utilities/save');
const today = require('moment')().format('YYYY-MM-DD');

describe('utilities.save', () => {
  describe('saveDomain', () => {
    const readFileMock = jest.spyOn(fs, 'readFile');
    const appendFileMock = jest.spyOn(fs, 'appendFile');
    const domain = Domain.from({ url: 'https://example.com/vulnerable.txt' });

    beforeEach(() => {
      readFileMock.mockImplementation(
        (_file, ...args) => args[args.length - 1](null, 'https://example.com/vulnerable.txt')
      );
      appendFileMock.mockImplementation((file, data, ...args) => {
        args[args.length - 1](null, data.byteLength, data)
      });
    });
    afterEach(() => {
      readFileMock.mockRestore();
      appendFileMock.mockRestore();
    });

    it('should save domain to file as it does not currently exist inside urls.txt', () => {
      save.saveDomain(domain);
      expect(appendFileMock).toHaveBeenCalled();
    });

    it('should not save domain to file as it currently exist inside urls.txt', () => {
      save.saveDomain(domain);
      expect(appendFileMock).not.toHaveBeenCalled();
    });
  });

  describe('saveTodaysDate', () => {
    it("should save today's date in a text file", () => {
      const writeFileSyncMock = jest.spyOn(fs, 'writeFileSync');
      writeFileSyncMock.mockImplementation(() => {});
      save.saveTodaysDate();
      expect(writeFileSyncMock.mock.calls[0][1]).toBe(today);
      expect(writeFileSyncMock).toHaveBeenCalled();
      writeFileSyncMock.mockRestore();
    });
  });
})
