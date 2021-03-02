var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var detectToken = require('../middleWare/detectToken');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//新增下面三行代码 注意 app.user 的顺序不能乱
var history = require('connect-history-api-fallback');
app.use(history());
app.use(express.static(path.join(__dirname, 'dist')));
//配置跨域
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With,token");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  if(req.method=="OPTIONS") {
    res.send(200);/*让options请求快速返回*/
  } else{
    next();
  }
});
// 全局验证token
app.use(detectToken); 

module.exports = app