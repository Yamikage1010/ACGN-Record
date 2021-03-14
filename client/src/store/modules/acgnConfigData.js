const acgnConfigData = {
  state: {
    sakuraShow: 1001,
    autoplay: 1001,
    changeBackground: 1001
  },
  getters: {
    GET_SAKURASHOW: state => {
      return state.sakuraShow
    },
    GET_AUTOPLAY: state => {
      return state.autoplay
    },
    GET_CHANGEBACKGROUND: state => {
      return state.changeBackground
    }
  },
  mutations: {
    SET_SAKURASHOW: (state, sakuraShow) => {
      state.sakuraShow = sakuraShow
    },
    SET_AUTOPLAY: (state, autoplay) => {
      state.autoplay = autoplay
    },
    SET_CHANGEBACKGROUND: (state, changeBackground) => {
      state.changeBackground = changeBackground
    }
  }
}

export default acgnConfigData
