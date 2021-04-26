import Vue from 'vue'
import App from './App.vue'
import router from './router'
import localStorageStore from 'store'
import store from '@/store'
//加载全局函数
import { loadAcgnImage } from './util/onLoadSystemResource'
import './util/sakuraDrop'
import './util/moveWindow'
import './util/moveMenu'
import './util/moveMessage'
import './util/componentsImport'
//加载全局样式
import './main.scss'
//加载插件
import 'animate.css'
Vue.config.productionTip = false
Vue.prototype.$localStorage = localStorageStore
Vue.prototype.loadAcgnImage = loadAcgnImage
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
