var app = require('../config/expressConfig')
const users = require('./users')
const upload = require('./upload')
const systemResource = require('./systemResource')
const acgnConfig = require('./acgnConfig')
app.use(systemResource)
app.use(users)
app.use(upload)
app.use(acgnConfig)

module.exports = app
