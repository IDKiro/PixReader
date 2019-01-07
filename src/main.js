import Vue from 'vue'
import VueI18n from 'vue-i18n'
import App from './App'
import store from './store'
import Vuetify from 'vuetify'
import vuescroll from 'vuescroll'
import 'vuetify/dist/vuetify.min.css'
import 'vuescroll/dist/vuescroll.css'
import './assets/styles/icon.css'
import './assets/styles/global.scss'

Vue.use(VueI18n)
Vue.use(Vuetify)
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
      'zh': require('./common/lang/zh'),
      'en': require('./common/lang/en')
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
