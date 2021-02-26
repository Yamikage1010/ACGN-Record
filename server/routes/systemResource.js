var fs = require('fs')
var express = require('express');
const { init, exec, sql, transaction } = require('../config/mysqlConfig')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router();
var data
try{
    data = fs.readFileSync('./public/img/sakura.txt', 'utf8')
}catch(err){
    console.error('读取文件出错: ' + err.message)
}
//注册接口
router.post('/acgnrecord/getSakura', urlencodedParser, (req, res) => {
  res.send({
    status: "success",
    code: 200,
    msg: '',
    data: data
  });
})
module.exports = router