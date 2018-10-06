import Vue from 'vue'
import Router from 'vue-router'
import Guide from '@/components/Guide'
import Ebook from '@/components/Ebook'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',          //路由指向路径
      name: 'Guide',      //路由名称，可以不命名
      component: Guide    //路由指向组件
    },
    {
      path: '/ebook',
      name: 'Ebook',
      component: Ebook
    }
  ]
})
