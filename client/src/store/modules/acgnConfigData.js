const acgnConfigData = {
  state: {
    sakuraShow: true,
    autoplay: true,
    slidesOrOnly: true,
    acgnTheme: 1001
  },
  getters: {
    GET_SAKURASHOW: state => {
      return state.sakuraShow
    },
    GET_AUTOPLAY: state => {
      return state.autoplay
    },
    GET_SLIDESORONLY: state => {
      return state.slidesOrOnly
    },
    GET_ACGNTHEME: state => {
      return state.acgnTheme
    }
  },
  mutations: {
    SET_SAKURASHOW: (state, sakuraShow) => {
      state.sakuraShow = sakuraShow
    },
    SET_AUTOPLAY: (state, autoplay) => {
      state.autoplay = autoplay
    },
    SET_SLIDESORONLY: (state, slidesOrOnly) => {
      state.slidesOrOnly = slidesOrOnly
    },
    SET_ACGNTHEME: (state, acgnTheme) => {
      state.acgnTheme = acgnTheme
    },
    SET_ACGNCONFIG: (state, acgnConfig) => {
      state.slidesOrOnly = acgnConfig.slidesOrOnly
      state.autoplay = acgnConfig.autoplay
      state.sakuraShow = acgnConfig.sakuraShow
      state.acgnTheme = acgnConfig.acgnTheme
    }
  },
  actions: {}
}

export default acgnConfigData
