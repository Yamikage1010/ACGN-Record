class User {
  constructor(user) {
    this.name = user.name
    this.password = user.password
    this.email = user.email
    this.acgnConfig = this.getInitConfig()
    this.createDate = new Date().getTime()
  }
  getInitConfig() {
    let config = {
      sakuraShow: 1001,
      autoplay: 1001,
      slidesOrOnly: 1001,
      acgnTheme: 1001
    }
    return JSON.stringify(config)
  }
}

module.exports = User
