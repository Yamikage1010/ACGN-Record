const { init, exec, sql, transaction } = require('../../config/mysqlConfig')
async function saveAcgnConfig(uid, acgnConfig) {
  const result = await exec(sql.table('user').where({ uid: uid }).data({ acgnConfig: acgnConfig }).update())
  console.log(result)
  return result
}
async function register(user) {
  const result = await exec(sql.table('user').data(user).insert())
  return result
}
module.exports = { saveAcgnConfig }
