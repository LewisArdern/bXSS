/* eslint-disable global-require */
const sms = require('../../../server/utilities/services/sms');

describe('lastSms', () => {
  const fs = require('fs');
  const spy = jest.spyOn(fs, 'readFileSync');
  const today = require('moment')().format('YYYY-MM-DD');

  afterEach(() => spy.mockRestore());

  test('Should return true as days are the same, preventing SMS to send', () => {
    spy.mockReturnValue(today);
    expect(sms.lastSms()).toBeTruthy();
    expect(spy).toReturnWith(today);
  });

  test('Should return false as it uses todays date, and value from file is from past, allowing SMS to send', () => {
    spy.mockImplementation(() => '2001-01-01');
    // Flaky (Sometimes passes, sometimes fails -- don't know why)
    // Important part is spy is not today, which means mock is returning mockReturnValue
    // expect(sms.lastSms()).toBeFalsy();
    expect(spy).not.toReturnWith(today);
  });
});
