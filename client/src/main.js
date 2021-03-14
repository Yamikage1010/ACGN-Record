import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from 'store'
//加载全局函数
import './util/onLoadSystemResource'
import './util/sakuraDrop'
import './util/moveWindow'
import './util/moveMenu'
import './util/componentsImport'
//加载对象
import './object/acgn'
//加载全局样式
import './main.scss'
//加载插件
import 'animate.css'
Vue.config.productionTip = false
Vue.prototype.$store = store
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
