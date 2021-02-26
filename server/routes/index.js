
var app = require('../config/expressConfig')
const users = require('./users')
const upload = require('./upload')
const systemResource = require('./systemResource')
app.use(systemResource)
app.use(users)
app.use(upload)

module.exports = app
