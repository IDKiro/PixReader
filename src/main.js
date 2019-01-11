import Vue from 'vue'
import VueI18n from 'vue-i18n'
import vuescroll from 'vuescroll'
import App from './App'
import store from './store'
import english from './common/lang/en'
import chinese from './common/lang/zh'
import 'vuescroll/dist/vuescroll.css'
import './assets/styles/icon.css'
import './assets/styles/global.scss'

Vue.use(VueI18n)
Vue.use(vuescroll)
Vue.config.productionTip = false
Vue.prototype.$vuescrollConfig = {
  bar: {
    background: '#ccc'
  }
}

const i18n = new VueI18n({
  locale: (navigator.language || navigator.browserLanguage).toLowerCase() === 'en' ? 'en' : 'zh',
  messages: {
      'zh': chinese,
      'en': english
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  i18n,
  store,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
