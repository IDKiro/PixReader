# 状态管理

Vuex 是一个专为 Vue.js 应用程序开发的状态管理模式。

`store` 文件夹下的 `index.js` 文件为状态管理组件的入口文件：

```javascript
import Vue from 'vue'
import Vuex from 'vuex'
import state from './state'
import getters from './getters'
import mutations from './mutations'

Vue.use(Vuex)

export default new Vuex.Store({
  state,
  getters,
  mutations
})
```

状态管理组件中需要导入并组装 `state`、`getters` 和`mutations` 三个模块：

- `state` 记录了应用大部分的状态，一些严格属于单个组件的状态不需要放入 Vuex
- `getters` 获取 state 的派生状态，包含派生状态的方法或属性
- `mutations` 更改 store 中的状态，包含改变状态的方法

除此之外常用的还有 `actions` 和 `modules`：

- `actions` 提交 mutation，不直接变更状态，处理异步操作
- `modules` store 分割成模块，存放在文件夹 `modules` 中

## State

`state.js` 中包含了供多个组件使用的状态：

```javascript
const state = {
  bookList: [],
  bookAvailable: false,
  ifTitleAndMenuShow: false,
  ifBookMarked: false,
  navigation: {},
  bookCurrentLocation: 0,
  bookmarks: undefined,
  defaultFontSize: 16,
  defaultTheme: 0
}

export default state
```

组件可以通过 `this.$store` 访问到 `store` 实例，使用 `this.$store.state` 获取Vuex中的状态。组件获取 `store` 实例中的状态时，一般使用计算属性，`TitleBar.vue` 就存在以下计算属性：

```javascript
computed: {
  ifTitleAndMenuShow () {
    return this.$store.state.ifTitleAndMenuShow
  }
}
```

计算属性会基于依赖进行缓存，只在相关依赖发生改变时它们才会重新求值，可以防止每次渲染都进行调用，减小开销。通过计算属性，获取标题栏显示状态就不需要获取 `$store.state.ifTitleAndMenuShow`，获取计算属性 `ifTitleAndMenuShow` 即可。

## Getter

为了使得一些 `state` 中的状态的派生状态可以复用，便在 `store` 中定义 `getter`。`getter` 的返回值和计算属性一样，会根据它的依赖被缓存起来，且只有当它的依赖值发生了改变才会被重新计算。比如本项目从 `state` 中的 `bookList` 派生出去除重复书签的 `bookList`，`getter` 接受 state 作为其第一个参数：

```javascript
const getters = {
  bookList: state => {
    return Array.from(new Set(state.bookList))
  }
}

export default getters
```

`Guide.vue` 中便使用 `this.$store.getters.bookList` 获取了派生出的去重 `bookList`：

computed: {
  bookList () {
    return this.$store.getters.bookList
  }
}

## Mutation

Vue 不推荐直接改变 `store` 中的状态，需要改变 `store` 中的状态只能显式地提交 `mutation`：

```javascript
store.commit('handler')
```

其中 `handler` 表示 `mutation` 的回调函数，比如本项目中用于改变电子书加载状态的 回调函数：

```javascript
const mutations = {
  setBookAvailable (state, val) {
    state.bookAvailable = val
  }
}

export default mutations
```

`Ebook.vue` 中提交 `mutation`：

```javascript
this.$store.commit('setBookAvailable', false)
```

提交 mutation 时会接受 `state` 作为第一个参数，向 `store.commit` 传入额外的参数称为载荷，其一般为对象，`setBookAvailable (state, val)` 中的 `val` 即是该 `mutation` 的载荷。
