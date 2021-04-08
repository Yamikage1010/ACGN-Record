import Vue from 'vue'
import { Upload, Dialog, Message, Radio, RadioGroup, Rate, Progress } from 'element-ui'
import acgnButton from '@/components/acgnButton'
import cP from '@/components/cP'
import 'element-ui/lib/theme-chalk/upload.css'
import 'element-ui/lib/theme-chalk/dialog.css'
import 'element-ui/lib/theme-chalk/message.css'
import 'element-ui/lib/theme-chalk/radio.css'
import 'element-ui/lib/theme-chalk/rate.css'
import 'element-ui/lib/theme-chalk/progress.css'
Vue.prototype.$message = Message
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Rate)
Vue.use(Progress)
Vue.component('acgn-button', acgnButton)
Vue.component('c-p', cP)
