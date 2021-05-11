const { init, exec, sql, transaction } = require('../../config/mysqlConfig')
const md5 = require('md5-node')
async function login(req) {
  let userData = {
    acgnUserName: req.body.acgnUserName,
    acgnUserEmail: req.body.acgnUserName,
    _type: 'or'
  }
  const result = await exec(
    sql
      .table('user')
      .field('acgnUid,acgnUserName,acgnUserEmail,acgnConfig,acgnUserStatus')
      .where([
        userData,
        {
          acgnUserPassword: req.body.acgnUserPassword
        }
      ])
      .select()
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
    await exec(
      sql
        .table('user')
        .where([
          userData,
          {
            acgnUserPassword: req.body.acgnUserPassword
          }
        ])
        .data({ token: token })
        .update()
    )
    result[0].token = token
    return result[0]
  } else {
    return result
  }
}
async function register(user) {
  user.acgnUserStatus = 1
  const result = await exec(sql.table('user').field('*').where({ acgnUserName: user.acgnUserName }).select())
  if (result.length > 0) {
    return { msg: '该用户名已存在' }
  } else {
    const result2 = await exec(sql.table('user').data(user).insert())
    return result2
  }
}
async function modifyPassword(req) {
  let detectionData = {
    acgnUid: req.acgnUid,
    acgnUserPassword: req.body.password
  }
  const result = await exec(sql.table('user').field('*').where(detectionData).select())
  if (result.length > 0) {
    const result2 = await exec(
      sql.table('user').where({ acgnUid: req.acgnUid }).data({ acgnUserPassword: req.body.newPassword }).update()
    )
    return result2
  } else {
    return result
  }
}
async function searchUser(req) {
  let searchData = {
    acgnUserEmail: req.body.acgnUserEmail
  }
  const result = await exec(sql.table('user').field('acgnUserName').where(searchData).select())
  return result
}
async function forgetPassword(req) {
  let detectionData = {
    acgnUserEmail: req.body.acgnUserEmail
  }
  const result = await exec(
    sql.table('user').where(detectionData).data({ acgnUserPassword: req.body.newPassword }).update()
  )
  return result
}
module.exports = { login, register, modifyPassword, forgetPassword, searchUser }
