const User = require('../object/user')
var express = require('express')
const { init, exec, sql, transaction } = require('../config/mysqlConfig')
const { login, register, modifyPassword, forgetPassword } = require('../functionPackage/database/user')
var bodyParser = require('body-parser')
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var router = express.Router()

const { sendMail, sendMail2 } = require('../functionPackage/sendEmail') //引入封装好的函数
let check = {} //声明一个对象缓存邮箱和验证码，留着

//发送邮件接口
router.post('/acgnrecord/sendEmail', function (req, res, next) {
  const mail = req.body.acgnUserEmail
  if (!mail) {
    return res.send('参数错误')
  } //email出错时或者为空时
  const code = parseInt(Math.random(0, 1) * 10000) //生成随机验证码
  check[mail] = code
  //发送邮件
  sendMail(mail, code, (state) => {
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
//发送邮件接口
router.post('/acgnrecord/sendEmail2', function (req, res, next) {
  const mail = req.body.acgnUserEmail
  if (!mail) {
    return res.send('参数错误')
  } //email出错时或者为空时
  const code = parseInt(Math.random(0, 1) * 10000) //生成随机验证码
  check[mail] = code
  //发送邮件
  sendMail2(mail, code, (state) => {
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
    acgnUserName: req.body.acgnUserName,
    acgnUserPassword: req.body.acgnUserPassword
  }
  login(user)
    .then((result) => {
      if (result.acgnUid) {
        console.log(result)
        result.acgnConfig = JSON.parse(result.acgnConfig)
        res.send({
          status: 'success',
          code: 200,
          msg: '登录成功',
          data: result
        })
      } else if (result.code === 505) {
        res.send(result)
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
  if (req.body.code == check[user.acgnUserEmail]) {
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
//修改密码接口
router.post('/acgnrecord/modifyPassword', urlencodedParser, (req, res) => {
  modifyPassword(req)
    .then((result) => {
      console.log(result)
      if (result.changedRows === 1) {
        res.send({
          status: 'success',
          code: 200,
          msg: '修改成功',
          data: result
        })
      } else {
        res.send({
          status: 'warning',
          code: 400,
          msg: '密码错误，修改失败',
          data: result
        })
      }
    })
    .catch((err) => {
      console.log(err)
      res.send({
        status: 'warning',
        code: 400,
        msg: '修改失败',
        data: err
      })
    })
})

//修改密码接口
router.post('/acgnrecord/forgetPassword', urlencodedParser, (req, res) => {
  console.log(check)
  if (req.body.code == check[req.body.acgnUserEmail]) {
    forgetPassword(req)
      .then((result) => {
        console.log(result)
        if (result.changedRows === 1) {
          res.send({
            status: 'success',
            code: 200,
            msg: '修改成功',
            data: result
          })
        } else {
          res.send({
            status: 'warning',
            code: 400,
            msg: '系统出错，修改失败',
            data: result
          })
        }
      })
      .catch((err) => {
        console.log(err)
        res.send({
          status: 'warning',
          code: 400,
          msg: '系统出错，修改失败',
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
