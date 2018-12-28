module.exports = {
  parserOptions: {
    ecmaVersion: '2018'
  },
  extends: ['airbnb', 'prettier', 'plugin:jest/recommended'],
  plugins: ['jest'],
  env: {
    node: true,
    'jest/globals': true
  },
  rules: {
    'no-console': 'off'
  }
};
