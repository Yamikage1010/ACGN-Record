var express = require('express')
const { init, exec, sql, transaction } = require('../config/mysqlConfig')
const { saveAcgnConfig } = require('../functionPackage/database/acgnConfig.js')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router()

//保存系统设置
router.post('/acgnrecord/saveAcgnConfig', function (req, res, next) {
  console.log(req.acgnUid, req.body.acgnConfig)
  saveAcgnConfig(req.acgnUid, req.body.acgnConfig)
    .then((results) => {
      console.log(results)
      if (results.affectedRows > 0) {
        res.send({
          status: 'success',
          code: 200,
          msg: '保存成功,请刷新浏览器获取资源',
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
