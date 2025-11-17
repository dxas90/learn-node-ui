import js from '@eslint/js';
import globals from 'globals';

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        fetchEndpoint: 'writable',
        fetchAllEndpoints: 'writable',
        apiExplorer: 'writable'
      }
    },
    rules: {
      indent: ['error', 4],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single', { avoidEscape: true }],
      semi: ['error', 'always'],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'prefer-const': 'error',
      'no-var': 'error',
      eqeqeq: ['error', 'always'],
      curly: 'error',
      'brace-style': ['error', '1tbs'],
      'space-before-function-paren': ['error', {
        anonymous: 'always',
        named: 'never',
        asyncArrow: 'always'
      }],
      'arrow-spacing': 'error',
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'comma-dangle': ['error', 'never'],
      'object-curly-spacing': ['error', 'always']
    }
  }
];
