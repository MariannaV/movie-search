const path = require('path'),
  root = path.resolve(__dirname, '../..');

module.exports = {
  env: {
    browser: true,
    es2020: true,
  },
  parser: 'babel-eslint',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  plugins: ['import', 'prettier'],
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:import/errors', 'plugin:import/warnings', 'prettier'],
  rules: {
    'no-use-before-define': 1,
    'no-restricted-globals': 0,
    'no-plusplus': 0,
    'no-unused-expressions': 1,
    'no-restricted-syntax': 0,
    radix: ['error', 'as-needed'],
    'spaced-comment': 0,
    'import/no-extraneous-dependencies': 0, //because of Yarn Workspaces
    'import/prefer-default-export': 0,
    'import/no-cycle': 0,

    //for Gulp
    'import/no-unresolved': 0,
    'import/extensions': 0,
    'import/no-absolute-path': 0,
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [`${root}/src`],
        extensions: ['.js', '.json'],
      },
    },
  },
};
