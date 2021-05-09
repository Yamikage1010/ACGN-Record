var express = require('express')
var fs = require('fs')
var path = require('path')
const { init, exec, sql, transaction } = require('../config/mysqlConfig')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router()
var multipart = require('connect-multiparty')
var gm = require('gm')
var multipartMiddleware = multipart({ maxFieldsSize: '10MB' })

async function uploadData(req, extname, dataType) {
  let upload = {
    acgnUid: req.acgnUid,
    acgnUserName: req.acgnUserName,
    acgnFileName: extname,
    acgnFileStatus: 1,
    acgnFileType: dataType,
    createDate: new Date().getTime()
  }
  const result = await exec(sql.table('acgn_file').data(upload).insert())
  return result
}
function fileRenameAndTurnUrl(req, res, dataType) {
  let file = req.files.file
  let characterIndex = req.body.characterIndex || null
  let extname = req.acgnUid + '_' + file.name
  let fileName = 'upload_uid' + extname
  fs.rename(
    file.path,
    'C://Users/Administrator/Documents/ACGNrecord/userUpData/' + dataType + '/' + fileName,
    (err) => {
      if (err) {
        res.send({
          status: 'error',
          code: 404,
          msg: '上传失败，出bug啦',
          data: err
        })
      } else {
        if (dataType === 'image') {
          gm('C://Users/Administrator/Documents/ACGNrecord/userUpData/' + dataType + '/' + fileName)
            .setFormat('JPEG')
            .quality(5) //设置压缩质量: 0-100
            .strip()
            .autoOrient()
            .write('C://Users/Administrator/Documents/ACGNrecord/userUpData/GMImage/gm_' + fileName, function (err) {
              if (err) {
                console.log('图片压缩err: ' + err)
              } else {
                console.log('图片压缩成功')
              }
            })
        }
        uploadData(req, extname, dataType)
          .then((result) => {
            if (result.insertId) {
              res.send({
                status: 'success',
                code: 200,
                msg: '上传成功',
                data: {
                  acgnUid: req.acgnUid,
                  file: file,
                  index: characterIndex
                }
              })
            } else {
              res.send({
                status: 'error',
                code: 404,
                msg: '上传失败，出bug啦',
                data: err
              })
            }
          })
          .catch((err) => {
            console.log(err, '上传出bug了')
          })
      }
    }
  )
}
router.post('/acgnrecord/picUpload', multipartMiddleware, function (req, res) {
  // console.log(req)
  fileRenameAndTurnUrl(req, res, 'image')
})
router.post('/acgnrecord/configMusicUpload', multipartMiddleware, function (req, res) {
  // console.log(req)
  fileRenameAndTurnUrl(req, res, 'music')
})
router.post('/acgnrecord/musicUpload', multipartMiddleware, function (req, res) {
  console.log(req.acgnUid)
  fileRenameAndTurnUrl(req, res, 'music')
})
router.post('/acgnrecord/videoUpload', multipartMiddleware, function (req, res) {
  // console.log(req)
  fileRenameAndTurnUrl(req, res, 'video')
})
module.exports = router
