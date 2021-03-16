const User = require('../object/user')
var express = require('express')
const { init, exec, sql, transaction } = require('../config/mysqlConfig')
const { login, register } = require('../functionPackage/database/user')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router()

const email = require('../functionPackage/sendEmail') //引入封装好的函数
const check = {} //声明一个对象缓存邮箱和验证码，留着

//发送邮件接口
router.post('/acgnrecord/sendEmail', function (req, res, next) {
  const mail = req.body.email
  if (!mail) {
    return res.send('参数错误')
  } //email出错时或者为空时
  const code = parseInt(Math.random(0, 1) * 10000) //生成随机验证码
  check[mail] = code
  //发送邮件
  email.sendMail(mail, code, (state) => {
    if (state) {
      return res.send({
        status: 'success',
        code: 200,
        msg: '发送成功'
      })
    } else {
      return res.send({
        status: 'warning',
        code: 400,
        msg: '发送失败'
      })
    }
  })
})

//登录接口
router.post('/acgnrecord/login', urlencodedParser, (req, res) => {
  let user = {
    name: req.body.name,
    password: req.body.password
  }
  login(user)
    .then((result) => {
      if (result.length > 0) {
        console.log(result[0])
        result[0].acgnConfig = JSON.parse(result[0].acgnConfig)
        res.send({
          status: 'success',
          code: 200,
          msg: '登录成功',
          data: result[0]
        })
      } else {
        res.send({
          status: 'warning',
          code: 400,
          msg: '用户名或密码错误',
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
//注册接口
router.post('/acgnrecord/register', urlencodedParser, (req, res) => {
  console.log(check)
  let user = new User(req.body)
  if (req.body.code == check[user.email]) {
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
          status: 'warning',
          code: 400,
          msg: '注册失败',
          data: err
        })
      })
  } else {
    res.send({
      status: 'warning',
      code: 400,
      msg: '验证码错误',
      data: req.body
    })
  }
})

module.exports = router
