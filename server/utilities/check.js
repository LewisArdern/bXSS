// Copyright 2019 Lewis Ardern. All rights reserved.

// Checks if configuration values are defined or not
exports.configurationValueExists = config => Object.values(config).every(x => x !== undefined);

// Checks if config.intrusiveLevel is set to 1 or not, if its set to 1 then the payload is intructed to capture everything
exports.isIntrusive = value => {
  if (value === 1) {
    return true;
  }
  return false;
};
