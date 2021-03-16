var fs = require('fs')
var path = require('path')
var express = require('express')
const { init, exec, sql, transaction } = require('../config/mysqlConfig')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({
  extended: false
})
var router = express.Router()
var sakura, noa
try {
  sakura = fs.readFileSync('./public/img/sakura.txt', 'utf8')
} catch (err) {
  console.error('读取文件出错: ' + err.message)
}
//樱花花瓣接口
router.post('/acgnrecord/getSakura', urlencodedParser, (req, res) => {
  res.send({
    status: 'success',
    code: 200,
    msg: '',
    data: sakura
  })
})
router.get('/acgnrecord/image/*', function (req, res) {
  let imageName = decodeURIComponent(path.basename(req.url))
  res.sendFile('C://Users/Administrator/Documents/ACGNrecord/userUpData/image/upload_uid' + imageName)
  // res.sendFile( '/public/images/'+path.basename(req.url) );
})
router.get('/acgnrecord/defaultImage/*', function (req, res) {
  let imageName = decodeURIComponent(path.basename(req.url))
  res.sendFile('C://Users/Administrator/Documents/ACGNrecord/systemDefaultResource/image/' + imageName)
  // res.sendFile( '/public/images/'+path.basename(req.url) );
})
// const option = {}
router.get('/acgnrecord/music/*', function (req, res) {
  let musicName = decodeURIComponent(path.basename(req.url))
  res.sendFile('C://Users/Administrator/Documents/ACGNrecord/systemDefaultResource/music/' + musicName)
  // res.sendFile( '/public/images/'+path.basename(req.url) );
})
router.get('/acgnrecord/defaultMusic/*', function (req, res) {
  let musicName = decodeURIComponent(path.basename(req.url))
  res.sendFile('C://Users/Administrator/Documents/ACGNrecord/systemDefaultResource/music/' + musicName)
  // res.sendFile( '/public/images/'+path.basename(req.url) );
})
// router.get('/acgnrecord/music/*',(req,res)=>{

//   let mp3 = path.basename(req.url);
//   let stat = fs.statSync(mp3);

//   res.writeHead(200,{    'Content-Type':'audio/mpeg',    'Content-Length':stat.size
//   });

//   fs.createReadStream(mp3).pipe(res);
//   })
module.exports = router
