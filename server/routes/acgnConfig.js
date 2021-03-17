var express = require('express')
const { init, exec, sql, transaction } = require('../config/mysqlConfig')
const { saveAcgnConfig } = require('../functionPackage/database/acgnConfig.js')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router()

//保存系统设置
router.post('/acgnrecord/saveAcgnConfig', function (req, res, next) {
  console.log(req.uid, req.body.acgnConfig)
  saveAcgnConfig(req.uid, req.body.acgnConfig)
    .then((results) => {
      if (results.changedRows > 0) {
        res.send({
          status: 'success',
          code: 200,
          msg: '保存成功',
          data: results
        })
      } else {
        res.send({
          status: 'error',
          code: 400,
          msg: '出bug啦',
          data: results
        })
      }
    })
    .catch((err) => {
      res.status(403)
    })
})
module.exports = router
