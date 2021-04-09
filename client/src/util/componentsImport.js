import Vue from 'vue'
import { Upload, Dialog, Message, Radio, RadioGroup, Rate, Progress, Carousel, CarouselItem } from 'element-ui'
import acgnButton from '@/components/acgnButton'
import cP from '@/components/cP'
import 'element-ui/lib/theme-chalk/upload.css'
import 'element-ui/lib/theme-chalk/dialog.css'
import 'element-ui/lib/theme-chalk/message.css'
import 'element-ui/lib/theme-chalk/radio.css'
import 'element-ui/lib/theme-chalk/rate.css'
import 'element-ui/lib/theme-chalk/progress.css'
import 'element-ui/lib/theme-chalk/carousel.css'
import 'element-ui/lib/theme-chalk/carousel-item.css'
Vue.prototype.$message = Message
Vue.use(Upload)
Vue.use(Dialog)
Vue.use(Radio)
Vue.use(RadioGroup)
Vue.use(Rate)
Vue.use(Progress)
Vue.use(Carousel)
Vue.use(CarouselItem)
Vue.component('acgn-button', acgnButton)
Vue.component('c-p', cP)
