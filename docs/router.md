# 路由管理器简述

Vue Router 是 Vue.js 官方的路由管理器。

`router` 文件夹下的 `index.js` 文件为路由管理器组件的入口文件：

```javascript
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
```

创建路由组件实例时，需要给每个路由对象指定相对于主页的路径和加载的页面组件。本项目的根路径为书架，加载Guide组件，`ebook` 路径为阅读页面，加载 `Ebook` 组件，由路由管理器控制加载的页面组件也需要先使用 `import` 进行导入。

## 项目中的路由使用

本项目涉及到路由的部分较少，分别为选择书籍后转到阅读页面(Ebook组件)，在标题栏中点击返回按钮返回书架页面(Guide组件).

`TitleBar.vue` 中：

```javascript
back () {
    this.$store.commit('setTitleAndMenuShow', false)
    this.$router.push('/')
}
```

在返回书架页面前，这里将标题栏和菜单栏的状态设置为不显示，防止下次进入阅读页面时菜单栏默认显示。

`Guide.vue` 中：

```javascript
openBook (index) {
    localStorage.setItem('defaultBook', '/static/library/' + this.bookList[index] + '.epub')
    this.$router.push('/ebook')
}
```

`router.push()` 属于编程式的导航：

```javascript
router.push(location, onComplete?, onAbort?)
```

`location` 参数可以是直接是一个字符串路径，也可以是一个对象，对象中指定 `path` 即可进行链接(params 会被忽略)，如果在路由实例中进行了路由的命名，可以指定 `name` 属性进行该名称绑定链接的访问：

```javascript
// 字符串
router.push('home')

// 对象
router.push({ path: 'home' })

// 命名的路由
router.push({ name: 'user' }})
```

`router.go()` 很常用的编程式的导航方法：

```
router.go(n)
```

n 是一个整数，意思是在 history 记录中向前或者后退多少步。

相对应的，使用 `<router-link>` 创建 a 标签(href="#")来定义导航链接的方法就是声明式:

```html
<router-link to="/bar">Go to Bar</router-link>
```