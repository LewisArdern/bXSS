// Copyright 2018 Lewis Ardern. All rights reserved.

// Checks if configuration values are defined or not
exports.configurationValueExists = config => Object.values(config).every(x => x !== undefined);

// Checks if values sent from client-side payload has a value or did not capture anything (defaults to 'null' if nothing was captured)
exports.valueExists = value => {
  if (value === 'null') {
    return false;
  }
  return true;
};

// Checks if config.intrusiveLevel is set to 1 or not, if its set to 1 then the payload is intructed to capture everything
exports.isIntrusive = value => {
  if (value === 1) {
    return true;
  }
  return false;
};
