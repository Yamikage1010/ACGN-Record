const { init, exec, sql, transaction } = require('../../config/mysqlConfig')
async function getAcgnFileData(req) {
  let searchData = {}
  req.body.acgnUserName
    ? Object.assign(searchData, { acgnUserName: { like: '%' + req.body.acgnUserName + '%', _type: 'and' } })
    : null
  req.body.acgnFileName
    ? Object.assign(searchData, { acgnFileName: { like: '%' + req.body.acgnFileName + '%' } })
    : null
  console.log(
    sql
      .table('acgn_file')
      .field('*')
      .page(req.body.page, req.body.pageSize)
      .where(searchData)
      .order('createDate desc')
      .select()
  )
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
  let searchData = {}
  req.body.acgnUserName
    ? Object.assign(searchData, { acgnUserName: { like: '%' + req.body.acgnUserName + '%', _type: 'and' } })
    : null
  req.body.acgnUserEmail
    ? Object.assign(searchData, { acgnUserEmail: { like: '%' + req.body.acgnUserEmail + '%' } })
    : null
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
module.exports = { getAcgnFileData, changeAcgnFileStatus, getAcgnUserData, changeAcgnUserStatus }
