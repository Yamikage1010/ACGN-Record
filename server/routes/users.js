var express = require('express')
const { init, exec, sql, transaction } = require('../config/mysqlConfig')
const { login, register } = require('../functionPackage/database/user')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router()

//登录接口
router.post('/acgnrecord/login', urlencodedParser, (req, res) => {
  let user = {
    name: req.body.name,
    password: req.body.password
  }
  login(user).then((result) => {
    if (result.length > 0) {
      res.send({
        status: 'success',
        code: 200,
        msg: '登录成功',
        data: {
          name: result[0].name,
          token: result[0].token
        }
      })
    } else {
      res.send({
        status: 'waring',
        code: 400,
        msg: '用户名或密码错误',
        data: result
      })
    }
  })
})
//注册接口
router.post('/acgnrecord/register', urlencodedParser, (req, res) => {
  let user = {
    name: req.body.name,
    password: req.body.password
  }
  register(user)
    .then((result) => {
      console.log(result)
      res.send({
        status: 'success',
        code: 200,
        msg: '注册成功',
        data: user
      })
    })
    .catch((err) => {
      console.log(err)
      res.send({
        status: 'waring',
        code: 400,
        msg: '注册失败',
        data: err
      })
    })
})

module.exports = router
