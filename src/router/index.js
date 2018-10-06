import Vue from 'vue'
import Router from 'vue-router'
import Guide from '@/components/Guide'
import Ebook from '@/components/Ebook'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Guide',
      component: Guide
    },
    {
      path: '/ebook',
      name: 'Ebook',
      component: Ebook
    }
  ]
})
