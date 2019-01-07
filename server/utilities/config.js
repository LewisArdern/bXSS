/* eslint valid-typeof: "off" */
const assert = require('assert');

let config = {};
try {
  config = require('server/config/config');
} catch (e) {
  console.log(`Error loading config: ${e}`);
}

/**
 * Converts a string specification of types into predicate functions.
 * @example resolveTestTypes('number|string|null')
 * @param {string} types A bar-delimited string of JS types
 * @return {Array<function>}
 */
function resolveTypePredicates(types) {
  assert(typeof types === 'string', `Expected string, got ${typeof types}`);
  return types.split('|').map(type => {
    if (type === 'any') {
      return val => !(val === undefined || val === null);
    }
    switch (type) {
      case 'null':
        return val => [null, undefined].indexOf(val) !== -1;
      case 'array':
        return val => val instanceof Array;
      case 'object':
        return val => !(val instanceof Array) && typeof val === 'object';
      default:
        return val => typeof val === type;
    }
  });
}

/**
 * Returns a node specified by a string path in dot notation.
 * @param {string} path A path to a nested property in dot notation
 * @param {object} obj The object to traverse
 * @return {any} The value of the nested property
 */
config.get = path =>
  path.split('.').reduce((obj, key) => (typeof obj === 'object' ? obj[key] : undefined), config);

/**
 * Check supplied config values against a type specification.
 * @example isValid(['port.http', 'url']) checks only if the keys are defined
 * @example isValid({'port.http': 'number', 'url': 'string|null'}) type checks
 * @param {object|Array<string>} spec A keys->type specification object, or list of keys
 * @return {bool} Whether the specified keys meet the criteria.
 */
config.isValid = spec =>
  !(spec instanceof Array ? spec : Object.keys(spec)).some(key => {
    assert(typeof key === 'string', `Expected string, got ${typeof key}`);
    const predicates = resolveTypePredicates(spec[key] || 'any');
    const value = config.get(key);
    return !predicates.some(pred => pred(value));
  });

//
module.exports = config;
