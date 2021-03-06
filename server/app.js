var createError = require('http-errors')
var express = require('express')
var path = require('path')
var ejs = require('ejs')
var app = require('./routes/index')

// // view engine setup
// app.set('views', path.join(__dirname, 'dist'));
// //启动视图引擎，并指定模板文件文件类型：
// app.set('view engine','html')
app.use(express.static(path.join(__dirname, 'dist')))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  // render the error page
  res.status(err.status || 500)
  res.render('error')
})

module.exports = app
