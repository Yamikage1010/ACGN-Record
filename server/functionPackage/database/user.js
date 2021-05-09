const { init, exec, sql, transaction } = require('../../config/mysqlConfig')
const md5 = require('md5-node')
async function login(user) {
  const result = await exec(
    sql.table('user').field('acgnUid,acgnUserName,acgnUserEmail,acgnConfig,acgnUserStatus').where(user).select()
  )
  if (result.length > 0) {
    // 生成token
    if (result[0].acgnUserStatus === 2) {
      return {
        code: 505,
        msg: '该账号已被封禁'
      }
    }
    const token = md5(result[0].id + result[0].acgnUserName + new Date().getTime())
    await exec(sql.table('user').where(user).data({ token: token }).update())
    result[0].token = token
    return result[0]
  } else {
    return result
  }
}
async function register(user) {
  user.acgnUserStatus = 1
  const result = await exec(sql.table('user').data(user).insert())
  return result
}
module.exports = { login, register }
