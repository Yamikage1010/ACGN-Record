var fs = require('fs')
var path = require('path')
var express = require('express');
const { init, exec, sql, transaction } = require('../config/mysqlConfig')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router();
var imageInfo = require('imageinfo')
var sakura,noa
try{
  sakura = fs.readFileSync('./public/img/sakura.txt', 'utf8')
}catch(err){
    console.error('读取文件出错: ' + err.message)
}
//樱花花瓣接口
router.post('/acgnrecord/getSakura', urlencodedParser, (req, res) => {
  res.send({
    status: "success",
    code: 200,
    msg: '',
    data: sakura,
  });
})
router.get('/acgnrecord/image/*', function (req, res) {
  res.sendFile( 'C://Users/Administrator/Documents/ACGNrecord/systemDefaultResource/image/'+path.basename(req.url) );
})
module.exports = router