import Vue from 'vue'
import Router from 'vue-router'
import Guide from '@/components/Guide'
import Ebook from '@/components/Ebook'

Vue.use(Router)

export default new Router({
  routes: [
    {
      // 路由指向路径
      path: '/',
      // 路由名称，可以不命名
      name: 'Guide',
      // 路由指向组件
      component: Guide
    },
    {
      path: '/ebook',
      name: 'Ebook',
      component: Ebook
    }
  ]
})
