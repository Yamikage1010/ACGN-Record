var express = require('express')
var fs = require('fs')
var path = require('path')
const { init, exec, sql, transaction } = require('../config/mysqlConfig')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router()
var multipart = require('connect-multiparty')
var multipartMiddleware = multipart({ maxFieldsSize: '10MB' })
router.post('/acgnrecord/picUpload', multipartMiddleware, function (req, res, next) {
  console.log(req)
  let file = req.files.file
  console.log(file)
  var extname = file.name
  fs.rename(
    file.path,
    'C://Users/Administrator/Documents/ACGNrecord/userUpData/image/' + 'upload_' + extname,
    function (err) {
      if (err) {
        res.status(500).json({
          msg: err
        })
      } else {
        res.send({
          status: 'success',
          code: 200,
          msg: '上传成功',
          data: {
            uid: req.uid,
            file: file
          }
        })
      }
    }
  )
})
module.exports = router
