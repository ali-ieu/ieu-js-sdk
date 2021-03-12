// @ts-check
/* eslint-env node */

const configuration = {
    preset: 'ts-jest',
    // temp ignore example
    testPathIgnorePatterns: process.env.SKIP_E2E ? ['/node_modules/', 'example.spec.ts'] : ['/node_modules/'],
    globals: {
        __DEV__: true,
    },
    moduleNameMapper: {
        '^@ali-ieu/(.*?)$': '<rootDir>/packages/$1/src',
    },
}

module.exports = configuration
