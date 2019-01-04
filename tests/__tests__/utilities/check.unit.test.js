/* eslint-disable global-require */
const check = require('../../../server/utilities/check');

describe('configurationValueExists', () => {
  test('Should return true for both configuration values as they exist', () => {
    const config = {
      twilio: { value: 'foo' }
    };
    const twilio = check.configurationValueExists([config.twilio]);
    expect(twilio).toBeTruthy();
    const twilioValue = check.configurationValueExists([config.twilio.value]);
    expect(twilioValue).toBeTruthy();
  });

  test('Should return false for both configuration values as they do not exist', () => {
    const config = {
      twitter: { value: 'foo' }
    };
    const twilio = check.configurationValueExists([config.twilio]);
    expect(twilio).toBeFalsy();
    const twitter = check.configurationValueExists([config.twitter.test]);
    expect(twitter).toBeFalsy();
  });
});

describe('isIntrusive', () => {
  test('Should return true if isIntrusive is set to 1', () => {
    const result = check.isIntrusive(1);
    expect(result).toBeTruthy();
  });
  test('Should return false if isIntrusive is 0 for any other value', () => {
    const result = check.isIntrusive(0);
    expect(result).toBeFalsy();
    const result1 = check.isIntrusive(2);
    expect(result1).toBeFalsy();
  });
});
