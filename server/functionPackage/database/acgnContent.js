const { init, exec, sql, transaction } = require('../../config/mysqlConfig')
async function addAcgnContent(req) {
  let acgnContent = JSON.parse(req.body.acgnContent)
  acgnContent.acgnUid = req.acgnUid
  acgnContent.acgnUserName = req.acgnUserName
  acgnContent.acgnStatus = 1
  acgnContent.acgnMemoryImage = JSON.stringify(acgnContent.acgnMemoryImage)
  acgnContent.acgnAttribute = JSON.stringify(acgnContent.acgnAttribute)
  acgnContent.acgnCharacteristic = JSON.stringify(acgnContent.acgnCharacteristic)
  acgnContent.createDate = new Date().getTime()
  acgnContent.deleteDate = ''
  const result = await exec(sql.table('acgn_content').data(acgnContent).insert())
  if (result.insertId || result.insertId === 0) {
    let acgnCharacters = JSON.parse(req.body.acgnCharacters)
    for (let i = 0; i < acgnCharacters.length; i++) {
      let acgnCharacter = { ...acgnCharacters[i] }
      acgnCharacter.acgnUid = req.acgnUid
      acgnCharacter.acgnId = result.insertId
      acgnCharacter.characterImage = JSON.stringify(acgnCharacter.characterImage)
      acgnCharacter.characterAttribute = JSON.stringify(acgnCharacter.characterAttribute)
      acgnCharacter.characterVoice = JSON.stringify(acgnCharacter.characterVoice)
      acgnCharacter.createDate = new Date().getTime()
      acgnCharacter.deleteDate = ''
      let result2 = await exec(sql.table('acgn_characters').data(acgnCharacter).insert())
      console.log(result2)
      if (!(result2.insertId || result2.insertId === 0)) {
        break
      }
    }
    return result
  }
  console.log(result)
  return result
}
async function editAcgnContent(req) {
  let acgnContent = JSON.parse(req.body.acgnContent)
  acgnContent.acgnMemoryImage = JSON.stringify(acgnContent.acgnMemoryImage)
  acgnContent.acgnAttribute = JSON.stringify(acgnContent.acgnAttribute)
  acgnContent.acgnCharacteristic = JSON.stringify(acgnContent.acgnCharacteristic)
  const result = await exec(sql.table('acgn_content').where({ acgnId: acgnContent.acgnId }).data(acgnContent).update())
  let acgnCharacters = JSON.parse(req.body.acgnCharacters)
  if (acgnCharacters.length > 0) {
    for (let i = 0; i < acgnCharacters.length; i++) {
      let acgnCharacter = { ...acgnCharacters[i] }
      acgnCharacter.characterImage = JSON.stringify(acgnCharacter.characterImage)
      acgnCharacter.characterAttribute = JSON.stringify(acgnCharacter.characterAttribute)
      acgnCharacter.characterVoice = JSON.stringify(acgnCharacter.characterVoice)
      let result2
      if (acgnCharacter.characterId) {
        result2 = await exec(
          sql.table('acgn_characters').where({ characterId: acgnCharacter.characterId }).data(acgnCharacter).update()
        )
      } else {
        acgnCharacter.acgnUid = req.acgnUid
        acgnCharacter.acgnId = acgnContent.acgnId
        result2 = await exec(sql.table('acgn_characters').data(acgnCharacter).insert())
      }
      console.log(2, result2)
    }
    return result
  }
  console.log(1, result)
  return result
}
async function getAcgnContentList(req) {
  let selectData = {
    acgnUid: req.acgnUid,
    acgnType: req.body.acgnType,
    deleteDate: ''
  }
  req.body.acgnTitle
    ? Object.assign(selectData, { acgnTitle: { like: '%' + req.body.acgnTitle + '%', _type: 'and' } })
    : null
  req.body.listType === 'handle' ? null : Object.assign(selectData, { acgnStatus: 1 })
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
async function getAcgnCharacters(req) {
  let selectData = {
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
async function delectAcgnContent(req) {
  let selectData = {
    acgnId: req.body.acgnId
  }
  const result = await exec(
    sql.table('acgn_content').where(selectData).data({ deleteDate: new Date().getTime() }).update()
  )
  return result
}
module.exports = { addAcgnContent, editAcgnContent, getAcgnContentList, getAcgnCharacters, delectAcgnContent }
