var app = require('../config/expressConfig');
const users = require('./users')
const upload = require('./upload')

app.use(users)
app.use(upload)

module.exports = app;
