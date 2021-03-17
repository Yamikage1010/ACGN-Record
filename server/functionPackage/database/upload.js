const { init, exec, sql, transaction } = require('../../config/mysqlConfig')
async function configPicUpload(uid) {
  const result = await exec(sql.table('user').where({ uid: uid }).data({ token: token }).update())
  return result
}
async function register(user) {
  const result = await exec(sql.table('user').data(user).insert())
  return result
}
module.exports = configPicUpload
