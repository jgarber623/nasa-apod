const config = require('@jgarber/eslint-config');

module.exports = [
  ...config,
  {
    files: ['**/*.js'],
    rules: {
      'unicorn/better-regex': 'off',
      'unicorn/filename-case': 'off'
    }
  }
];
