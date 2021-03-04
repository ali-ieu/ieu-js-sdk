// @ts-check
/* eslint-env node */

/**
 * An object with Prettier.js options.
 * @type {import('prettier').Options}
 */
const options = {
    jsxBracketSameLine: true,
    quoteProps: 'consistent',
    singleQuote: true,
    trailingComma: 'all',
    printWidth: 140,
    tabWidth: 4,
    semi: false,
}

module.exports = options
