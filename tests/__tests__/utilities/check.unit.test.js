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
