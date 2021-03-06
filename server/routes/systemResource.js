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
console.log(__dirname.split(':')[0])
//检查文件状态
async function detectionFile(req, fileName) {
  let fileData = {
    acgnUid: parseInt(fileName.split('_')[0]),
    acgnFileName: fileName
  }
  const result = await exec(sql.table('acgn_file').field('acgnFileStatus').where(fileData).select())
  console.log(fileData, result)
  return result
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
  console.log(imageName)
  detectionFile(req, imageName)
    .then((result) => {
      if (result[0].acgnFileStatus === 1) {
        res.sendFile('C://Users/Administrator/Documents/ACGNrecord/userUpData/image/upload_uid' + imageName)
      } else {
        res.sendFile('C://Users/Administrator/Documents/ACGNrecord/systemDefaultResource/image/' + 'nene_era.jpg')
      }
    })
    .catch((err) => {
      res.send(400)
      console.log(imageName + '图片状态查询出错\n')
      console.log(err)
    })
  // res.sendFile('C://Users/Administrator/Documents/ACGNrecord/userUpData/image/upload_uid' + imageName)
})

router.get('/acgnrecord/GMImage/*', function (req, res) {
  let imageName = decodeURIComponent(path.basename(req.url))
  console.log(imageName)
  res.sendFile('C://Users/Administrator/Documents/ACGNrecord/userUpData/GMImage/gm_upload_uid' + imageName)
  // res.sendFile( '/public/images/'+path.basename(req.url) );
})
router.get('/acgnrecord/defaultImage/*', function (req, res) {
  let imageName = decodeURIComponent(path.basename(req.url))
  res.sendFile('C://Users/Administrator/Documents/ACGNrecord/systemDefaultResource/image/' + imageName)
  // res.sendFile( '/public/images/'+path.basename(req.url) );
})
router.get('/acgnrecord/fsReaderImage/*', function (req, res) {
  let imageName = decodeURIComponent(path.basename(req.url))
  let fsPath = './public/images/' + imageName
  try {
    console.log(__dirname)
    res.sendFile(fsPath, { root: 'D://yamikage/salf/ACGN-Record/server' })
  } catch (err) {
    console.log('尝试fs获取图片出错', err)
  }
  // res.sendFile( '/public/images/'+path.basename(req.url) );
})

// const option = {}
router.get('/acgnrecord/music/*', function (req, res) {
  let musicName = decodeURIComponent(path.basename(req.url))
  detectionFile(req, musicName)
    .then((result) => {
      if (result[0].acgnFileStatus === 1) {
        res.sendFile('C://Users/Administrator/Documents/ACGNrecord/userUpData/music/upload_uid' + musicName)
      } else {
        res.sendFile('C://Users/Administrator/Documents/ACGNrecord/systemDefaultResource/music/' + 'nene_era.mp3')
      }
    })
    .catch((err) => {
      res.send(400)
      console.log(musicName + '音乐状态查询出错\n')
      console.log(err)
    })
})
router.get('/acgnrecord/defaultMusic/*', function (req, res) {
  let musicName = decodeURIComponent(path.basename(req.url))
  res.sendFile('C://Users/Administrator/Documents/ACGNrecord/systemDefaultResource/music/' + musicName)
})
router.get('/acgnrecord/video/*', function (req, res) {
  let videoName = decodeURIComponent(path.basename(req.url))
  detectionFile(req, videoName)
    .then((result) => {
      if (result[0].acgnFileStatus === 1) {
        res.sendFile('C://Users/Administrator/Documents/ACGNrecord/userUpData/video/upload_uid' + videoName)
      } else {
        res.sendFile('C://Users/Administrator/Documents/ACGNrecord/systemDefaultResource/video/' + 'nene_era.mp4')
      }
    })
    .catch((err) => {
      res.send(400)
      console.log(videoName + '视频状态查询出错\n')
      console.log(err)
    })
  // res.sendFile('C://Users/Administrator/Documents/ACGNrecord/userUpData/video/upload_uid' + videoName)
})

router.get('/acgnrecord/masterImage/*', function (req, res) {
  let imageName = decodeURIComponent(path.basename(req.url))
  res.sendFile('C://Users/Administrator/Documents/ACGNrecord/userUpData/image/upload_uid' + imageName)
})
router.get('/acgnrecord/masterMusic/*', function (req, res) {
  let musicName = decodeURIComponent(path.basename(req.url))
  res.sendFile('C://Users/Administrator/Documents/ACGNrecord/userUpData/music/upload_uid' + musicName)
})
router.get('/acgnrecord/masterVideo/*', function (req, res) {
  let videoName = decodeURIComponent(path.basename(req.url))
  res.sendFile('C://Users/Administrator/Documents/ACGNrecord/userUpData/video/upload_uid' + videoName)
})
module.exports = router
