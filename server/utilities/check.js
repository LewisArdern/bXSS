exports.exists = (config) => {
  return Object.values(config).every(x => (x !== undefined));
};

exports.valueExists = (value) => {
  if (value == 'null') {
    return false;
  } return true;
};
