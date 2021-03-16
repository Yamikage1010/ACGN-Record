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
      sakuraShow: true,
      autoplay: true,
      slidesOrOnly: true,
      acgnTheme: 1001
    }
    return JSON.stringify(config)
  }
}

module.exports = User
