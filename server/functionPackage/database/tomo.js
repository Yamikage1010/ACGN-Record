const { init, exec, sql, transaction } = require('../../config/mysqlConfig')
async function searchTomo(req) {
  let tomoUserName = { acgnUserName: req.body.acgnUserName }
  const result = await exec(sql.table('user').field('acgnUid').where(tomoUserName).select())
  return result
}
async function addTomo(req) {
  let acgnData = { acgnUid: req.body.acgnUid, acgnTitle: req.body.acgnTitle }
  const result = await exec(sql.table('acgn_content').field('acgnId').where(acgnData).select())
  if (result.length > 0) {
    let result2 = await exec(
      sql
        .table('acgn_tomo_request')
        .field('requestId')
        .where({ acgnUid: req.acgnUid, requestUid: req.body.acgnUid, requestStatus: { in: '1,2' } })
        .select()
    )
    if (result2.length > 0) {
      result2[0].msg = '请勿重复发送请求'
      return result2
    } else {
      result2 = await exec(
        sql
          .table('acgn_tomo_request')
          .data({
            acgnUid: req.acgnUid,
            requestUid: req.body.acgnUid,
            requestName: req.body.acgnUserName,
            requestStatus: 1
          })
          .insert()
      )
      result2 = await exec(
        sql
          .table('acgn_tomo_request')
          .data({
            acgnUid: req.body.acgnUid,
            requestUid: req.acgnUid,
            requestName: req.acgnUserName,
            requestStatus: 2
          })
          .insert()
      )
      return result2
    }
  } else {
    return result
  }
}
async function requestHandle(req) {
  let result = await exec(
    sql
      .table('acgn_tomo_request')
      .where({ requestId: req.body.requestId })
      .data({ requestStatus: req.body.requestStatus })
      .update()
  )
  result = await exec(
    sql
      .table('acgn_tomo_request')
      .where({ requestUid: req.acgnUid, acgnUid: req.body.acgnUid })
      .data({ requestStatus: req.body.requestStatus })
      .update()
  )
  console.log(req.body.requestStatus)
  if (req.body.requestStatus == 4) {
    let result2 = await exec(sql.table('user').field('acgnTomo').where({ acgnUid: req.acgnUid }).select())
    let tomoData = []
    if (result2[0].acgnTomo) {
      tomoData = JSON.parse(result2[0].acgnTomo)
    }
    tomoData.push({
      acgnUid: req.body.acgnUid,
      acgnUserName: req.body.acgnUserName
    })
    result2 = await exec(
      sql
        .table('user')
        .data({ acgnTomo: JSON.stringify(tomoData) })
        .where({ acgnUid: req.acgnUid })
        .update()
    )
    result2 = await exec(sql.table('user').field('acgnTomo').where({ acgnUid: req.body.acgnUid }).select())
    let tomoData2 = []
    if (result2[0].acgnTomo) {
      tomoData2 = JSON.parse(result2[0].acgnTomo)
    }
    tomoData2.push({
      acgnUid: req.acgnUid,
      acgnUserName: req.acgnUserName
    })
    result2 = await exec(
      sql
        .table('user')
        .data({ acgnTomo: JSON.stringify(tomoData2) })
        .where({ acgnUid: req.body.acgnUid })
        .update()
    )
    console.log(result2)
  }
  return result
}
async function getTomoList(req) {
  const result = await exec(sql.table('user').field('acgnTomo').where({ acgnUid: req.acgnUid }).select())
  console.log(result)
  return result
}
async function getTomoRequestList(req) {
  const result = await exec(
    sql
      .table('acgn_tomo_request')
      .field('requestId,acgnUid,requestUid,requestName,requestStatus')
      .where({ acgnUid: req.acgnUid })
      .select()
  )
  return result
}

async function getTomoAcgnContentList(req) {
  let selectData = {
    acgnUid: req.body.acgnUid,
    acgnStatus: 1,
    deleteDate: '',
    acgnToTomo: 1
  }
  req.body.acgnTitle
    ? Object.assign(selectData, { acgnTitle: { like: '%' + req.body.acgnTitle + '%', _type: 'and' } })
    : null
  req.body.acgnType ? Object.assign(selectData, { acgnType: req.body.acgnType }) : null
  const result = await exec(
    sql
      .table('acgn_content')
      .field('*')
      .page(req.body.page, req.body.pageSize)
      .where(selectData)
      .order('createDate desc')
      .select()
  )
  const result2 = await exec(sql.table('acgn_content').field('*').where(selectData).order('createDate desc').select())
  console.log(parseInt(result2.length / req.body.pageSize), result2.length % req.body.pageSize === 0 ? 0 : 1)
  let pageOne = result2.length % req.body.pageSize === 0 ? 0 : 1
  let pageTotal = parseInt(result2.length / req.body.pageSize) + pageOne
  if (result.length > 0) {
    result.forEach((item) => {
      item.acgnMemoryImage = JSON.parse(item.acgnMemoryImage)
      item.acgnAttribute = JSON.parse(item.acgnAttribute)
      item.acgnCharacteristic = JSON.parse(item.acgnCharacteristic)
    })
  }
  let data = {
    acgnContentList: result,
    pageTotal: parseInt(pageTotal)
  }
  return data
}
async function getTomoAcgnCharacters(req) {
  let selectData = {
    acgnUid: req.body.acgnUid,
    acgnId: req.body.acgnId
  }
  const result = await exec(sql.table('acgn_characters').field('*').where(selectData).select())
  if (result.length > 0) {
    result.forEach((item) => {
      item.characterImage = JSON.parse(item.characterImage)
      item.characterAttribute = JSON.parse(item.characterAttribute)
      item.characterVoice = JSON.parse(item.characterVoice)
    })
  }
  return result
}
async function delectTomoList(req) {
  let result = await exec(
    sql.table('user').where({ acgnUid: req.acgnUid }).data({ acgnTomo: req.body.acgnTomo }).update()
  )
  if (result.changedRows !== 0) {
    result = await exec(sql.table('user').field('acgnTomo').where({ acgnUid: req.body.acgnTomoUid }).select())
    let tomoAcgnTomo = JSON.parse(result[0].acgnTomo)
    tomoAcgnTomo.splice(
      tomoAcgnTomo.findIndex((item) => item.acgnUid === req.acgnUid),
      1
    )
    result = await exec(
      sql
        .table('user')
        .where({ acgnUid: req.body.acgnTomoUid })
        .data({ acgnTomo: JSON.stringify(tomoAcgnTomo) })
        .update()
    )
  }
  return result
}
module.exports = {
  searchTomo,
  addTomo,
  getTomoList,
  requestHandle,
  getTomoRequestList,
  getTomoAcgnContentList,
  getTomoAcgnCharacters,
  delectTomoList
}
