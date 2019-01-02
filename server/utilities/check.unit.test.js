const check = require('./check');

describe('configurationValueExists', () => {
  test('Should return true for both values', () => {
    const config = {
      twilio: { value: 'foo' }
    };
    const twilio = check.configurationValueExists([config.twilio]);
    expect(twilio).toBeTruthy();
    const twilioValue = check.configurationValueExists([config.twilio.value]);
    expect(twilioValue).toBeTruthy();
  });

  test('Should return false for both values', () => {
    const config = {
      twitter: { value: 'foo' }
    };
    const twilio = check.configurationValueExists([config.twilio]);
    expect(twilio).toBeFalsy();
    const twitter = check.configurationValueExists([config.twitter.test]);
    expect(twitter).toBeFalsy();
  });
});

describe('valueExists', () => {
  test('Should return false for null value', () => {
    const result = check.valueExists('null');
    expect(result).toBeFalsy();
  });
  test('Should return true for any value other than null', () => {
    const result = check.valueExists('hello');
    expect(result).toBeTruthy();
    const result1 = check.valueExists('http://example.com:100/hi');
    expect(result1).toBeTruthy();
  });
});

describe('isIntrusive', () => {
  test('Should return true for 1', () => {
    const result = check.isIntrusive(1);
    expect(result).toBeTruthy();
  });
  test('Should return false for 0 for any other value', () => {
    const result = check.isIntrusive(0);
    expect(result).toBeFalsy();
    const result1 = check.isIntrusive(2);
    expect(result1).toBeFalsy();
  });
});

describe('lastSms', () => {
  test('Should return true for 1', () => {
    const result = check.isIntrusive(1);
    expect(result).toBeTruthy();
  });
  test('Should return false for 0 for any other value', () => {
    const result = check.isIntrusive(0);
    expect(result).toBeFalsy();
    const result1 = check.isIntrusive(2);
    expect(result1).toBeFalsy();
  });
});
