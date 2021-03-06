const { init, exec, sql, transaction } = require('../../config/mysqlConfig')
const User = require('../../object/user')
async function getAcgnFileData(req) {
  let searchData = {}
  req.body.acgnUserName
    ? Object.assign(searchData, { acgnUserName: { like: '%' + req.body.acgnUserName + '%', _type: 'and' } })
    : null
  req.body.acgnFileName
    ? Object.assign(searchData, { acgnFileName: { like: '%' + req.body.acgnFileName + '%', _type: 'and' } })
    : null
  req.body.acgnFileType
    ? Object.assign(searchData, { acgnFileType: { like: '%' + req.body.acgnFileType + '%', _type: 'and' } })
    : null
  req.body.acgnFileStatus ? Object.assign(searchData, { acgnFileStatus: req.body.acgnFileStatus }) : null
  console.log(searchData)
  const result = await exec(
    sql
      .table('acgn_file')
      .field('*')
      .page(req.body.page, req.body.pageSize)
      .where(searchData)
      .order('createDate desc')
      .select()
  )
  const result2 = await exec(sql.table('acgn_file').field('*').where(searchData).order('createDate desc').select())
  console.log(parseInt(result2.length / req.body.pageSize), result2.length % req.body.pageSize === 0 ? 0 : 1)
  let pageOne = result2.length % req.body.pageSize === 0 ? 0 : 1
  let pageTotal = parseInt(result2.length / req.body.pageSize) + pageOne
  let data = {
    tableData: result,
    pageTotal: parseInt(pageTotal)
  }
  return data
}
async function changeAcgnFileStatus(req) {
  let acgnFileId = req.body.acgnFileId.toString()
  const result = await exec(
    sql
      .table('acgn_file')
      .where('acgnFileId in (' + acgnFileId + ') ')
      .data({ acgnFileStatus: req.body.acgnFileStatus })
      .update()
  )
  return result
}
async function getAcgnUserData(req) {
  let searchData = {
    acgnUserStatus: { in: '1,2', _type: 'and' }
  }
  req.body.acgnUserName
    ? Object.assign(searchData, { acgnUserName: { like: '%' + req.body.acgnUserName + '%', _type: 'and' } })
    : null
  req.body.acgnUserEmail
    ? Object.assign(searchData, { acgnUserEmail: { like: '%' + req.body.acgnUserEmail + '%' } })
    : null
  req.body.acgnUserStatus ? Object.assign(searchData, { acgnUserStatus: req.body.acgnUserStatus }) : null
  console.log(
    sql
      .table('user')
      .field('*')
      .page(req.body.page, req.body.pageSize)
      .where(searchData)
      .order('createDate desc')
      .select()
  )
  const result = await exec(
    sql
      .table('user')
      .field('*')
      .page(req.body.page, req.body.pageSize)
      .where(searchData)
      .order('createDate desc')
      .select()
  )
  const result2 = await exec(sql.table('user').field('*').where(searchData).order('createDate desc').select())
  console.log(parseInt(result2.length / req.body.pageSize), result2.length % req.body.pageSize === 0 ? 0 : 1)
  let pageOne = result2.length % req.body.pageSize === 0 ? 0 : 1
  let pageTotal = parseInt(result2.length / req.body.pageSize) + pageOne
  let data = {
    tableData: result,
    pageTotal: parseInt(pageTotal)
  }
  return data
}
async function changeAcgnUserStatus(req) {
  let acgnUid = req.body.acgnUid.toString()
  const result = await exec(
    sql
      .table('user')
      .where('acgnUid in (' + acgnUid + ') ')
      .data({ acgnUserStatus: req.body.acgnUserStatus })
      .update()
  )
  return result
}

async function getAcgnContentData(req) {
  let searchData = {
    deleteDate: ''
  }
  req.body.acgnUserName
    ? Object.assign(searchData, { acgnUserName: { like: '%' + req.body.acgnUserName + '%', _type: 'and' } })
    : null
  req.body.acgnTitle
    ? Object.assign(searchData, { acgnTitle: { like: '%' + req.body.acgnTitle + '%', _type: 'and' } })
    : null
  req.body.acgnStatus ? Object.assign(searchData, { acgnStatus: req.body.acgnStatus }) : null
  req.body.acgnType ? Object.assign(searchData, { acgnType: req.body.acgnType }) : null
  console.log(
    sql
      .table('acgn_content')
      .field('*')
      .page(req.body.page, req.body.pageSize)
      .where(searchData)
      .order('createDate desc')
      .select()
  )
  const result = await exec(
    sql
      .table('acgn_content')
      .field('*')
      .page(req.body.page, req.body.pageSize)
      .where(searchData)
      .order('createDate desc')
      .select()
  )
  const result2 = await exec(sql.table('acgn_content').field('*').where(searchData).order('createDate desc').select())
  console.log(parseInt(result2.length / req.body.pageSize), result2.length % req.body.pageSize === 0 ? 0 : 1)
  let pageOne = result2.length % req.body.pageSize === 0 ? 0 : 1
  let pageTotal = parseInt(result2.length / req.body.pageSize) + pageOne
  let data = {
    tableData: result,
    pageTotal: parseInt(pageTotal)
  }
  return data
}
async function changeAcgnContentStatus(req) {
  let acgnId = req.body.acgnId.toString()
  const result = await exec(
    sql
      .table('acgn_content')
      .where('acgnId in (' + acgnId + ') ')
      .data({ acgnStatus: req.body.acgnStatus, banReason: req.body.banReason })
      .update()
  )
  return result
}
async function masterRegister(req) {
  let masterData = new User({
    acgnUserPassword: req.body.acgnUserPassword,
    acgnUserName: req.body.acgnUserName,
    acgnUserStatus: 3
  })
  const result = await exec(sql.table('user').field('*').where({ acgnUserName: req.body.acgnUserName }).select())
  if (result.length > 0) {
    return { msg: '已存在该用户名' }
  } else {
    const result2 = await exec(sql.table('user').data(masterData).insert())
    return result2
  }
}
function registerFirstMaster() {
  let masterData = new User({
    acgnUserPassword: 'yamikageMaster',
    acgnUserName: 'master000',
    acgnUserStatus: 3
  })
  exec(sql.table('user').field('*').where({ acgnUserName: 'master000' }).select()).then((res) => {
    const result = res
    if (result.length > 0) {
      console.log('已存在首个管理员')
    } else {
      exec(sql.table('user').data(masterData).insert()).then((res2) => {
        if (res2.insertId > 0) {
          console.log('创建首个管理员成功')
        }
      })
    }
  })
}
module.exports = {
  masterRegister,
  getAcgnFileData,
  changeAcgnFileStatus,
  getAcgnUserData,
  changeAcgnUserStatus,
  getAcgnContentData,
  changeAcgnContentStatus,
  registerFirstMaster
}
