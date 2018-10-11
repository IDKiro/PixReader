# Vue项目简述

首先了解下Vue项目的一些基本知识。

## 项目的结构

先看一下项目的文件目录，知道哪些文件和文件夹是供我们编辑的：

![](/docs/imgs/readme/1.png)

### 文件夹

- `src` 文件夹，包含了整个应用所有的代码源文件，是整个项目最重要的部分
- `config` 文件夹，项目参数
- `static` 静态资源文件夹

因为 `src` 是程序的本体，所以讲一下里面的文件结构：

![](/docs/imgs/readme/3.png)

`asset` 为资源文件夹，保存图片这类供程序调用的文件，也可以保存一些全局有效的样式。

`components` 为组件文件夹，Vue 有一个很重要的概念————组件，组件可以和其他语言的类或者函数做类比，它一方面可以方便代码的复用，另一方面可以减小单文件的长度，让代码更简洁。

`router` 为路由文件夹，对应 `vue-router` 库，`vue-router` 用于将各个页面（组件）连接起来，提供在不同的页面（组件）间切换的功能。

如果按照默认配置，那么文件夹里没有 `store` 这个文件夹，该文件夹需要安装 `Vuex` 后才能使用。`Vuex` 用于管理应用的状态，可以理解成将程序的状态相关的变量集中存储于 `state` 文件夹的 js 文件中。

### 文件

**根目录文件：**

- `index.html` 主页面文件，由Vue来渲染
- `package.json` 项目所使用的依赖包

**`src` 文件夹下文件：**

- `main.js` 入口文件，初始化实例，导入全局可用的模块
- `App.vue` 总组件文件，调用组件来进行页面的渲染，可以在此处定义所有页面共用的脚本和样式

**`config` 文件夹下文件：**

- `index.js` index页面的参数

## 文件调用简述

首先是 `index.html` 文件，查看 `<body>` 标签部分：

```html
<body>
  <div id="app"></div>
  <!-- built files will be auto injected -->
</body>
```

相对应的，`mian.js` 中的 Vue 实例创建部分：

```javascript
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})
```

`index.html` 中的 `id="app"` 与 `mian.js` 中的 `el: '#app'` 的相对应，两者会在实例创建时进行替换（查看[生命周期图示](#lifecycle)），相当于创建的实例会嵌入到 `index.html` 中。

再次看 `mian.js` 中的这段代码，其中 `components: { App }` 指定了该入口文件包含的组件，这个组件也就是整个应用的总组件 `App.vue`，其通过 `export` 进行暴露供其他组件调用。

这样，通过编辑 `App.vue` 以及该文件包含的子组件便可编辑页面显示的实际内容。

## Vue 文件简述

Vue 从扩展名就可以看出，其是 Vue 项目的独有文件，并且也是 Vue 项目内容的最主要组成部分。

我们打开 `App.vue` 文件来最简单的认识一下 Vue 文件：

```html
<template>
  <div id="app">
    <img src="./assets/logo.png">
    <router-view/>
  </div>
</template>

<script>
  export default {
    name: 'App'
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
```

很清晰的可以看到代码分为三个部分，分别由三个标签 `<template>`、`<script>`、`<style>` 包裹。三个部分分别对应 HTML、Javascript 和 CSS，三种语言的代码在各自的标签内进行编写。简单地讲，可以把 Vue 文件理解为将三种语言编写在同一文档中，并赋予一些新的特性。

## Vue 的常用指令

最常用的指令有两个：

- `v-bind`: 特性的绑定
- `v-on`： 事件的监听
  
这两个指令都有着对应的缩写，`v-bind` 的缩写是 `:`，`v-on` 的缩写是 `@`，比如 `<img v-bind:src="imageSrc">` 缩写为 `<img :src="imageSrc">`，`<button v-on:click="doThis"></button>` 缩写为 `<button @click="doThis"></button>`。

除此之外，常用的指令还有：

- `v-if` & `v-else`: 条件渲染，先判断条件再决定是否渲染
- `v-show`: 条件渲染，先渲染后决定是否显示
- `v-for`: 基于数据渲染多个同类元素

## Vue 的数据和选项

### data

组件的数据对象，能够响应数据变化，在实例中可以定义为：

```javascript
data: {
  message: 'Hello Vue!'
}
```

当组件作为模块进行编程时，`data` 的对象必须是函数：

```javascript
data: function () {
  return { a: 1 }
}
```

这是为了防止数据污染，此时 `return` 的对象则为实际调用的 `data` 对象。

### props

用于接收父组件传过来的数据，可以是对象或者数组，一般可以写成如下格式：

```javascript
props: {
  height: Number,
  age: {
    type: Number,
    default: 0,
    required: true,
    validator: function (value) {
      return value >= 0
    }
  }
}
```

写成对象时一般会添加类型监测。

父组件向子组件进行传值则需要用 `v-bind` 进行属性的绑定：

```html
<div
  :height="val"
  :age="obj"
></div>
```

### methods

`methods` 是供实例调用的方法，方法中的 `this` 自动绑定为 Vue 实例，绝大部分的函数都写在 `methods` 中。

```javascript
methods: {
  plus () {
    this.a++
  }
}
```

子组件可以通过 `$emit( eventName, […args] )` 调用父组件的方法，父组件需要使用 `v-on` 监听子组件触发的事件：

```javascript
this.$emit('welcome')
```

```html
<div id="emit-example-simple">
  <welcome-button v-on:welcome="sayHi"></welcome-button>
</div>
```

### computed

计算属性中的属性可以在其被调用时返回所需的属性值，相当于一个依赖于其他属性的 `data`。

以下代码相当于当有调用 `reversedMessage` 这个属性的时候，返回一个反转字符串的值：

```javascript
computed: {
  reversedMessage: function () {
    return this.message.split('').reverse().join('')
  }
}
```

方法虽然也可以做到相同的效果，但是计算属性会进行缓存，只有在依赖属性被更新的时才触发属性内的函数。

<span id="lifecycle"></span>
## Vue 的生命周期

生命周期也是 Vue 中很重要的概念，表示 Vue 的实例从创建到销毁的过程，每个生命周期的阶段都可以执行一个钩子函数。

![](/docs/imgs/readme/lifecycle.jpg)

