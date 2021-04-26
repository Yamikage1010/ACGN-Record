const { init, exec, sql, transaction } = require('../config/mysqlConfig')
module.exports = (req, res, next) => {
  // 获取当前访问的api地址
  const url = req.originalUrl
  // 不需要进行验证的api
  var urlArr = [
    '/favicon.ico',
    '/static',
    '/public',
    '/acgnrecord/login',
    '/acgnrecord/register',
    '/acgnrecord/getSakura',
    '/acgnrecord/image',
    '/acgnrecord/masterImage/',
    '/acgnrecord/defaultImage/',
    '/acgnrecord/fsReaderImage/',
    '/acgnrecord/music',
    '/acgnrecord/defaultMusic',
    '/acgnrecord/sendEmail'
  ]
  // 验证当前的api是否存在不需要验证的api的列表里面
  console.log(url)
  var is_next = urlArr.find((item) => url === '/' || url.indexOf(item) > -1)
  if (is_next) {
    next()
    return false
  }
  // 获取api传递过来的token
  const token = req.headers.token || ''
  // 基本检测，token和id都不允许为空
  switch (true) {
    case token === '':
      return res.status(402).json({
        msg: '不是你 token 呢'
      })
    default:
  }
  exec(sql.table('user').field('acgnUid,acgnUserName').where({ token: token }).select())
    .then((result) => {
      if (result[0]) {
        req.acgnUid = result[0].acgnUid
        req.acgnUserName = result[0].acgnUserName
        next()
      } else {
        return res.status(401).json({
          msg: 'wdnmd先登录啊'
        })
      }
      console.log(result)
    })
    .catch((err) => {
      console.log(err)
    })
}
