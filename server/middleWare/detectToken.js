const { init, exec, sql, transaction } = require('../config/mysqlConfig')
module.exports = ((req, res, next) => {
  // 获取当前访问的api地址
  const url = req.originalUrl
  // 不需要进行验证的api
  var urlArr = ['/acgnrecord/login', '/acgnrecord/register','/acgnrecord/getSakura']
  // 验证当前的api是否存在不需要验证的api的列表里面
  var is_next = urlArr.find(item => item === url)
  if (is_next) {
    next()
    return false
  }
  // 获取api传递过来的token
  const token = req.headers.token || ''
  // 基本检测，token和id都不允许为空
  switch (true) {
    case token === '':
      return res.status(401).json({
        msg: 'wdnmd token 呢'
      })
    default:
  }
  exec(sql.table('user')
    .field('id,name')
    .where({ token: token })
    .select())
    .then(result => {
      if (results[0]) {
        next()
      } else {
        return res.status(401).json({
          msg: 'wdnmd先登录啊闸总'
        })
      }
      console.log(result);
    })
    .catch(err => {
      console.log(err);
    })
})