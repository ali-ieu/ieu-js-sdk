'use strict'

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/ejoysdk.cjs.prod.js')
} else {
    module.exports = require('./dist/ejoysdk.cjs.js')
}
