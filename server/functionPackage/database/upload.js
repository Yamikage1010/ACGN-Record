const { init, exec, sql, transaction } = require('../../config/mysqlConfig')
async function configPicUpload(acgnUid) {
  const result = await exec(sql.table('user').where({ acgnUid: acgnUid }).data({ token: token }).update())
  return result
}
async function register(user) {
  const result = await exec(sql.table('user').data(user).insert())
  return result
}
module.exports = configPicUpload
