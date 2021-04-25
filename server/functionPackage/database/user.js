const { init, exec, sql, transaction } = require('../../config/mysqlConfig')
const md5 = require('md5-node')
async function login(user) {
  const result = await exec(
    sql.table('user').field('acgnUid,acgnUserName,acgnUserEmail,acgnConfig').where(user).select()
  )
  if (result.length > 0) {
    // 生成token
    const token = md5(result[0].id + result[0].acgnUserName + new Date().getTime())
    await exec(sql.table('user').where(user).data({ token: token }).update())
    result[0].token = token
    return result
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
