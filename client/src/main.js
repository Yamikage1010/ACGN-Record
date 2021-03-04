import Vue from 'vue';
import App from './App.vue';

import './util/sakuraDrop';
import './util/moveWindow';
import './util/moveMenu';
import router from './router';
import './main.scss';
import './util/componentsImport';
import 'animate.css';
Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app');
