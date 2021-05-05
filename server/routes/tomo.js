var express = require('express')
const {
  searchTomo,
  addTomo,
  getTomoList,
  requestHandle,
  getTomoRequestList,
  getTomoAcgnContentList,
  getTomoAcgnCharacters
} = require('../functionPackage/database/tomo')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router()

//添加查找好友名字
router.post('/acgnrecord/searchTomo', urlencodedParser, (req, res) => {
  searchTomo(req)
    .then((result) => {
      if (result.length > 0) {
        res.send({
          status: 'success',
          code: 200,
          msg: '查询成功',
          data: {
            tomoUid: result[0].acgnUid
          }
        })
      } else {
        res.send({
          status: 'warning',
          code: 400,
          msg: '不存在该用户',
          data: result
        })
      }
    })
    .catch((err) => {
      res.send({
        status: 'error',
        code: 404,
        msg: '出bug啦',
        data: err
      })
    })
})
//添加好友，查询记录的作品
router.post('/acgnrecord/addTomo', urlencodedParser, (req, res) => {
  addTomo(req)
    .then((result) => {
      console.log(result)
      if (result.insertId) {
        res.send({
          status: 'success',
          code: 200,
          msg: '添加成功，请等待回复'
        })
      } else if (result.length > 0 && result[0].msg) {
        res.send({
          status: 'warning',
          code: 400,
          msg: result[0].msg
        })
      } else {
        res.send({
          status: 'warning',
          code: 400,
          msg: '该用户未记录此作品'
        })
      }
    })
    .catch((err) => {
      res.send({
        status: 'error',
        code: 404,
        msg: '出bug啦',
        data: err
      })
    })
})

//好友请求处理
router.post('/acgnrecord/requestHandle', urlencodedParser, (req, res) => {
  requestHandle(req)
    .then((result) => {
      if (result.changedRows) {
        res.send({
          status: 'success',
          code: 200,
          msg: '操作成功'
        })
      } else {
        res.send({
          status: 'warning',
          code: 400,
          msg: '操作失败',
          data: result
        })
      }
    })
    .catch((err) => {
      console.log(err)
      res.send({
        status: 'error',
        code: 404,
        msg: '出bug啦',
        data: err
      })
    })
})
//好友请求列表
router.post('/acgnrecord/getTomoRequestList', urlencodedParser, (req, res) => {
  getTomoRequestList(req)
    .then((result) => {
      if (result.length > 0) {
        res.send({
          status: 'success',
          code: 200,
          msg: '查询成功',
          data: {
            tomoList: result
          }
        })
      } else {
        res.send({
          status: 'warning',
          code: 400,
          msg: '不存在好友请求',
          data: result
        })
      }
    })
    .catch((err) => {
      res.send({
        status: 'error',
        code: 404,
        msg: '出bug啦',
        data: err
      })
    })
})
//好友列表
router.post('/acgnrecord/getTomoList', urlencodedParser, (req, res) => {
  getTomoList(req)
    .then((result) => {
      if (result.length > 0) {
        res.send({
          status: 'success',
          code: 200,
          msg: '查询成功',
          data: {
            acgnTomo: JSON.parse(result[0].acgnTomo || [])
          }
        })
      } else {
        res.send({
          status: 'warning',
          code: 400,
          msg: '不存在该用户',
          data: result
        })
      }
    })
    .catch((err) => {
      res.send({
        status: 'error',
        code: 404,
        msg: '出bug啦',
        data: err
      })
    })
})

router.post('/acgnrecord/getTomoAcgnContentList', urlencodedParser, (req, res) => {
  getTomoAcgnContentList(req)
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

router.post('/acgnrecord/getTomoAcgnCharacters', urlencodedParser, (req, res) => {
  getTomoAcgnCharacters(req)
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
