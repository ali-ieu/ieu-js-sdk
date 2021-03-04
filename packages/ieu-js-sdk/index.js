'use strict'

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/ieu-js-sdk.cjs.prod.js')
} else {
    module.exports = require('./dist/ieu-js-sdk.cjs.js')
}
