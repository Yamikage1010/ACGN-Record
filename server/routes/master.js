var express = require('express')
const {
  registerFirstMaster,
  masterRegister,
  getAcgnFileData,
  changeAcgnFileStatus,
  getAcgnUserData,
  changeAcgnUserStatus,
  getAcgnContentData,
  changeAcgnContentStatus
} = require('../functionPackage/database/master')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router()
//注册首个管理员
registerFirstMaster()
//注册接口
router.post('/acgnrecord/masterRegister', urlencodedParser, (req, res) => {
  masterRegister(req)
    .then((result) => {
      if (result.insertId) {
        res.send({
          status: 'success',
          code: 200,
          msg: '注册成功',
          data: result
        })
      } else if (result.msg) {
        res.send({
          status: 'warning',
          code: 400,
          msg: result.msg
        })
      } else {
        res.send({
          status: 'warning',
          code: 400,
          msg: '数据出错，注册失败',
          data: result
        })
      }
    })
    .catch((err) => {
      console.log(err)
      res.send({
        status: 'warning',
        code: 400,
        msg: '注册失败',
        data: err
      })
    })
})
//获取文件数据
router.post('/acgnrecord/getAcgnFileData', function (req, res) {
  getAcgnFileData(req)
    .then((results) => {
      console.log(results)
      if (results.tableData.length > 0) {
        res.send({
          status: 'success',
          code: 200,
          msg: '查询成功',
          data: results
        })
      } else {
        res.send({
          status: 'error',
          code: 400,
          msg: '没有数据',
          data: results
        })
      }
    })
    .catch((err) => {
      res.send({
        status: 'error',
        code: 500,
        msg: '出bug啦',
        data: err
      })
    })
})
//切换状态
router.post('/acgnrecord/changeAcgnFileStatus', function (req, res) {
  changeAcgnFileStatus(req)
    .then((results) => {
      console.log(results)
      if (results.changedRows) {
        res.send({
          status: 'success',
          code: 200,
          msg: '状态更改成功',
          data: results
        })
      } else {
        res.send({
          status: 'error',
          code: 400,
          msg: '状态更改失败',
          data: results
        })
      }
    })
    .catch((err) => {
      res.send({
        status: 'error',
        code: 500,
        msg: '出bug啦',
        data: err
      })
    })
})

//获取文件数据
router.post('/acgnrecord/getAcgnUserData', function (req, res) {
  getAcgnUserData(req)
    .then((results) => {
      console.log(results)
      if (results.tableData.length > 0) {
        res.send({
          status: 'success',
          code: 200,
          msg: '查询成功',
          data: results
        })
      } else {
        res.send({
          status: 'error',
          code: 400,
          msg: '没有数据',
          data: results
        })
      }
    })
    .catch((err) => {
      res.send({
        status: 'error',
        code: 500,
        msg: '出bug啦',
        data: err
      })
    })
})
//切换状态
router.post('/acgnrecord/changeAcgnUserStatus', function (req, res) {
  changeAcgnUserStatus(req)
    .then((results) => {
      console.log(results)
      if (results.changedRows) {
        res.send({
          status: 'success',
          code: 200,
          msg: '状态更改成功',
          data: results
        })
      } else {
        res.send({
          status: 'error',
          code: 400,
          msg: '状态更改失败',
          data: results
        })
      }
    })
    .catch((err) => {
      res.send({
        status: 'error',
        code: 500,
        msg: '出bug啦',
        data: err
      })
    })
})

//获取文件数据
router.post('/acgnrecord/getAcgnContentData', function (req, res) {
  getAcgnContentData(req)
    .then((results) => {
      console.log(results)
      if (results.tableData.length > 0) {
        res.send({
          status: 'success',
          code: 200,
          msg: '查询成功',
          data: results
        })
      } else {
        res.send({
          status: 'error',
          code: 400,
          msg: '没有数据',
          data: results
        })
      }
    })
    .catch((err) => {
      res.send({
        status: 'error',
        code: 500,
        msg: '出bug啦',
        data: err
      })
    })
})
//切换状态
router.post('/acgnrecord/changeAcgnContentStatus', function (req, res) {
  changeAcgnContentStatus(req)
    .then((results) => {
      console.log(results)
      if (results.changedRows) {
        res.send({
          status: 'success',
          code: 200,
          msg: '状态更改成功',
          data: results
        })
      } else {
        res.send({
          status: 'error',
          code: 400,
          msg: '状态更改失败',
          data: results
        })
      }
    })
    .catch((err) => {
      res.send({
        status: 'error',
        code: 500,
        msg: '出bug啦',
        data: err
      })
    })
})
module.exports = router
