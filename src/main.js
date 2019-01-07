import Vue from 'vue'
import App from './App'
import store from './store'
import vuescroll from 'vuescroll'
import 'vuescroll/dist/vuescroll.css'
import './assets/styles/icon.css'
import './assets/styles/global.scss'

Vue.config.productionTip = false
Vue.use(vuescroll)
Vue.prototype.$vuescrollConfig = {
  bar: {
    background: '#ccc'
  }
}

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
