exports.exists = (config) => {
  return Object.values(config).every(x => (x !== undefined));
};
