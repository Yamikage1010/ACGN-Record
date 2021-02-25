import Vue from 'vue'
import App from './App.vue'

import './util/sakuraDrop'
import './util/drog'
import router from './router'
import './main.scss'
import './util/componentsImport'
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
