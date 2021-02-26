var express = require('express');
const { init, exec, sql, transaction } = require('../config/mysqlConfig')
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var md5 = require('md5-node');
var router = express.Router();

//登录接口
router.post('/acgnrecord/login', urlencodedParser, (req, res) => {
  let user = {
    name: req.body.name,
    password: req.body.password
  }
  exec(sql.table('user')
    .field('id,name')
    .where(user)
    .select())
    .then(result => {
      if (result.length > 0) {
        // 生成token
        const token = md5(result[0].id+result[0].name+new Date().getTime())
        res.send({
          status: "success",
          code: 200,
          msg: "登录成功",
          data: {
            name: result[0].name,
            token:token
          }
        });
      } else {
        res.send({
          status: "success",
          code: 400,
          msg: "用户名或密码错误",
          data: result
        });
      }
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    })
})
//注册接口
router.post('/acgnrecord/register', urlencodedParser, (req, res) => {
  let user = {
    name: req.body.name,
    password: req.body.password
  }
  exec(sql
    .table('user')
    .data(user)
    .insert())
    .then(result => {
      console.log(result);
      res.send({
        status: "success",
        code: 200,
        msg: "注册成功",
        data: result
      });
    })
    .catch(err => {
      console.log(err);
      res.send({
        status: "success",
        code: 400,
        msg: "注册失败",
        data: err
      });
    })
})

module.exports = router;
