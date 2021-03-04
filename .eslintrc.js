// @ts-check
/* eslint-env node */

'use strict'

/**
 * An object with ESLint options.
 * @type {import('eslint').Linter.Config}
 */
const options = {
    root: true,
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
    },
    env: {
        node: true,
        browser: true,
    },
    plugins: ['@typescript-eslint'],
    extends: [
        'eslint:recommended',
        'plugin:prettier/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
    ],
    rules: {
        '@typescript-eslint/no-explicit-any': 'off',
        'no-restricted-globals': 'off',
    },
}

module.exports = options
