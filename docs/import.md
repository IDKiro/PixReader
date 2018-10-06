# 导入项目使用的库、组件和全局样式

为了在项目中启用之前准备的库、组件和全局样式，需要编辑 `main.js` ，也就是项目入口文件。

```javascript
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

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>',
  render: h => h(App)
})
```

- `import`: 导入库和样式表
- `Vue.use()`: 从库中注册组件供项目使用
- `new Vue()`: 使用包含的组件创建实例

`/* eslint-disable no-new */` 可以让直接使用 new 创建实例绕过规则检测。