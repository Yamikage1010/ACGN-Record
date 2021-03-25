const { init, exec, sql, transaction } = require('../../config/mysqlConfig')
async function addAcgnContent(req) {
  let acgnContent = JSON.parse(req.body.acgnContent)
  acgnContent.uid = req.uid
  acgnContent.acgnMemoryImage = JSON.stringify(acgnContent.acgnMemoryImage)
  acgnContent.acgnAttribute = JSON.stringify(acgnContent.acgnAttribute)
  acgnContent.acgnMusic = JSON.stringify(acgnContent.acgnMusic)
  const result = await exec(sql.table('acgn_content').data(acgnContent).insert())
  if (result.insertId || result.insertId === 0) {
    let acgnCharacters = JSON.parse(req.body.acgnCharacters)
    for (let i = 0; i < acgnCharacters.length; i++) {
      let acgnCharacter = { ...acgnCharacters[i] }
      acgnCharacter.uid = req.uid
      acgnCharacter.acgnId = result.insertId
      acgnCharacter.characterImage = JSON.stringify(acgnCharacter.characterImage)
      acgnCharacter.characterAttribute = JSON.stringify(acgnCharacter.characterAttribute)
      acgnCharacter.characterVoice = JSON.stringify(acgnCharacter.characterVoice)
      console.log(sql.table('acgn_characters').data(acgnCharacter).insert())
      console.log(acgnCharacter)
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
async function register(user) {
  const result = await exec(sql.table('user').data(user).insert())
  return result
}
module.exports = { addAcgnContent }
