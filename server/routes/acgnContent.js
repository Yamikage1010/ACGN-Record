const User = require('../object/user')
var express = require('express')
const { init, exec, sql, transaction } = require('../config/mysqlConfig')
const {
  addAcgnContent,
  editAcgnContent,
  getAcgnContentList,
  getAcgnCharacters,
  delectAcgnContent
} = require('../functionPackage/database/acgnContent')
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
router.post('/acgnrecord/delectAcgnContent', urlencodedParser, (req, res) => {
  delectAcgnContent(req)
    .then((result) => {
      console.log(result)
      if (result.changedRows > 0) {
        res.send({
          status: 'success',
          code: 200,
          msg: '删除成功',
          data: result
        })
      } else {
        res.send({
          status: 'warning',
          code: 400,
          msg: '删除失败',
          data: result
        })
      }
    })
    .catch((err) => {
      console.log(err)
      res.send({
        status: 'warning',
        code: 400,
        msg: '系统出错',
        data: err
      })
    })
})
router.post('/acgnrecord/editAcgnContent', urlencodedParser, (req, res) => {
  editAcgnContent(req)
    .then((result) => {
      console.log(result)
      res.send({
        status: 'success',
        code: 200,
        msg: '修改成功',
        data: result
      })
    })
    .catch((err) => {
      console.log(err)
      res.send({
        status: 'warning',
        code: 400,
        msg: '出bug啦',
        data: err
      })
    })
})
router.post('/acgnrecord/getAcgnContentList', urlencodedParser, (req, res) => {
  getAcgnContentList(req)
    .then((data) => {
      console.log(data)
      res.send({
        status: 'success',
        code: 200,
        msg: '获取成功',
        data: data
      })
    })
    .catch((err) => {
      console.log(err)
      res.send({
        status: 'warning',
        code: 400,
        msg: '获取失败',
        data: err
      })
    })
})
router.post('/acgnrecord/getAcgnCharacters', urlencodedParser, (req, res) => {
  getAcgnCharacters(req)
    .then((result) => {
      console.log(result)
      res.send({
        status: 'success',
        code: 200,
        msg: '获取成功',
        data: {
          acgnCharacters: result
        }
      })
    })
    .catch((err) => {
      console.log(err)
      res.send({
        status: 'warning',
        code: 400,
        msg: '获取失败',
        data: err
      })
    })
})
module.exports = router
