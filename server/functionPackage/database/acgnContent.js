const { init, exec, sql, transaction } = require('../../config/mysqlConfig')
async function addAcgnContent(req) {
  let acgnContent = JSON.parse(req.body.acgnContent)
  acgnContent.acgnUid = req.acgnUid
  acgnContent.acgnStatus = 'normal'
  acgnContent.acgnMemoryImage = JSON.stringify(acgnContent.acgnMemoryImage)
  acgnContent.acgnAttribute = JSON.stringify(acgnContent.acgnAttribute)
  acgnContent.acgnMusic = JSON.stringify(acgnContent.acgnMusic)
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
  acgnContent.acgnStatus = acgnContent.acgnStatus ? acgnContent.acgnStatus : 'normal'
  acgnContent.acgnMemoryImage = JSON.stringify(acgnContent.acgnMemoryImage)
  acgnContent.acgnAttribute = JSON.stringify(acgnContent.acgnAttribute)
  acgnContent.acgnMusic = JSON.stringify(acgnContent.acgnMusic)
  const result = await exec(sql.table('acgn_content').where({ acgnId: acgnContent.acgnId }).data(acgnContent).update())
  if (result.affectedRows || result.affectedRows > 0) {
    let acgnCharacters = JSON.parse(req.body.acgnCharacters)
    for (let i = 0; i < acgnCharacters.length; i++) {
      let acgnCharacter = { ...acgnCharacters[i] }
      acgnCharacter.characterImage = JSON.stringify(acgnCharacter.characterImage)
      acgnCharacter.characterAttribute = JSON.stringify(acgnCharacter.characterAttribute)
      acgnCharacter.characterVoice = JSON.stringify(acgnCharacter.characterVoice)
      let result2 = await exec(
        sql.table('acgn_characters').where({ characterId: acgnCharacter.characterId }).data(acgnCharacter).update()
      )
      console.log(2, result2)
      if (result2.affectedRows === 0) {
        acgnCharacter.acgnUid = req.acgnUid
        acgnCharacter.acgnId = acgnContent.acgnId
        let result3 = await exec(sql.table('acgn_characters').data(acgnCharacter).insert())
        console.log(3, result3)
      }
    }
    return result
  }
  console.log(1, result)
  return result
}
async function getAcgnContentList(req) {
  let selectData = {
    acgnUid: req.acgnUid,
    acgnType: req.body.acgnType
  }
  const result = await exec(sql.table('acgn_content').field('*').where(selectData).select())
  if (result.length > 0) {
    result.forEach((item) => {
      item.acgnMemoryImage = JSON.parse(item.acgnMemoryImage)
      item.acgnAttribute = JSON.parse(item.acgnAttribute)
      item.acgnMusic = JSON.parse(item.acgnMusic)
    })
  }
  return result
}
async function getAcgnCharacters(req) {
  let selectData = {
    acgnUid: req.acgnUid,
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
module.exports = { addAcgnContent, editAcgnContent, getAcgnContentList, getAcgnCharacters }
