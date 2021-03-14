const { init, exec, sql, transaction } = require('../../config/mysqlConfig')
const md5 = require('md5-node')
async function login(user) {
  const result = await exec(sql.table('user').field('uid,name').where(user).select())
  if (result.length > 0) {
    // 生成token
    const token = md5(result[0].id + result[0].name + new Date().getTime())
    await exec(sql.table('user').field('uid,name').where(user).data({ token: token }).update())
    result.token = token
    return result
  } else {
    return result
  }
}
async function register(user) {
  const result = await exec(sql.table('user').data(user).insert())
  return result
}
module.exports = { login, register }
