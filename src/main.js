import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import vuescroll from 'vuescroll'
import ElementUI from 'element-ui'
import 'vuescroll/dist/vuescroll.css'
import 'element-ui/lib/theme-chalk/index.css'
// 导入全局样式
import '@/assets/styles/icon.css'
import '@/assets/styles/global.scss'
import '@/assets/styles/theme/index.css'

Vue.config.productionTip = false
Vue.use(vuescroll)
Vue.use(ElementUI)

// 设置滚动条的默认颜色
Vue.prototype.$vuescrollConfig = {
  bar: {
    background: '#ccc'
  }
}

new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
