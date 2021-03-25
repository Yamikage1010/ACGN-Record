var app = require('../config/expressConfig')
const users = require('./users')
const upload = require('./upload')
const systemResource = require('./systemResource')
const acgnConfig = require('./acgnConfig')
const acgnContent = require('./acgnContent')
app.use(systemResource)
app.use(users)
app.use(upload)
app.use(acgnConfig)
app.use(acgnContent)

module.exports = app
