var express = require('express')
var fs = require('fs')
var path = require('path')
const { init, exec, sql, transaction } = require('../config/mysqlConfig')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router()
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart({ maxFieldsSize: '10MB' })
function fileRenameAndTurnUrl(req, res, dataType) {
  let file = req.files.file
  let characterIndex = req.body.characterIndex || null
  var extname = req.acgnUid + '_' + file.name
  var fileName = 'upload_uid' + extname
  console.log(file)
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
      }
    }
  )
}
router.post('/acgnrecord/picUpload', multipartMiddleware, function (req, res) {
  // console.log(req)
  fileRenameAndTurnUrl(req, res, 'image')
})
router.post('/acgnrecord/configPicUpload', multipartMiddleware, function (req, res, next) {
  console.log(req)
  fileRenameAndTurnUrl(req, res, 'image')
})
router.post('/acgnrecord/configMusicUpload', multipartMiddleware, function (req, res) {
  // console.log(req)
  fileRenameAndTurnUrl(req, res, 'music')
})
router.post('/acgnrecord/musicUpload', multipartMiddleware, function (req, res) {
  // console.log(req)
  fileRenameAndTurnUrl(req, res, 'music')
})
module.exports = router
