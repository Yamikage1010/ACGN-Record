class User {
  constructor(user) {
    this.acgnUserName = user.acgnUserName
    this.acgnUserPassword = user.acgnUserPassword
    this.acgnUserEmail = user.acgnUserEmail
    this.acgnConfig = this.getInitConfig()
    this.createDate = new Date().getTime()
  }
  getInitConfig() {
    let config = {
      sakuraShow: true,
      autoplay: true,
      slidesOrOnly: true,
      acgnTheme: 1001
    }
    return JSON.stringify(config)
  }
}

module.exports = User
