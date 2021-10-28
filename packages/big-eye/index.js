'use strict'

if (process.env.NODE_ENV === 'production') {
    module.exports = require('./dist/big-eye.cjs.prod.js')
} else {
    module.exports = require('./dist/big-eye.cjs.js')
}
