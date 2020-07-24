module.exports = {
  extends: [
    '@loopback/eslint-config',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
  ],
  rules: {
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/unbound-method': 'off',
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/restrict-template-expressions': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    quotes: ['error', 'single', {avoidEscape: true}],
    semi: ['error', 'always'],
    'prefer-template': 'error',
  },
};
