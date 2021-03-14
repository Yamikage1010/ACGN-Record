import Vue from 'vue'
import { Upload, Dialog, Message, Radio, RadioGroup } from 'element-ui'
import acgnButton from '@/components/acgnButton'
import 'element-ui/lib/theme-chalk/upload.css'
import 'element-ui/lib/theme-chalk/dialog.css'
import 'element-ui/lib/theme-chalk/message.css'
import 'element-ui/lib/theme-chalk/radio.css'
Vue.prototype.$message = Message
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.component('acgn-button', acgnButton)
