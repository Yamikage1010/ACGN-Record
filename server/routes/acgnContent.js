const User = require('../object/user')
var express = require('express')
const { init, exec, sql, transaction } = require('../config/mysqlConfig')
const { addAcgnContent } = require('../functionPackage/database/acgnContent')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router()

router.post('/acgnrecord/addAcgnContent', urlencodedParser, (req, res) => {
  addAcgnContent(req)
    .then((result) => {
      console.log(result)
      res.send({
        status: 'success',
        code: 200,
        msg: '新增成功',
        data: result
      })
    })
    .catch((err) => {
      console.log(err)
      res.send({
        status: 'warning',
        code: 400,
        msg: '新增失败',
        data: err
      })
    })
})
module.exports = router
