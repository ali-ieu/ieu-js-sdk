'use strict'

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/third-party.cjs.prod.js')
} else {
    module.exports = require('./dist/third-party.cjs.js')
}
