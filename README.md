# Vue.js 入门学习笔记：电子书阅读器

用于记录学习 Vue.js 并开发电子书阅读器的过程。

初期参考教程：[https://www.imooc.com/learn/1038](https://www.imooc.com/learn/1038)

Demo：[http://book.idkiro.xyz/](http://book.idkiro.xyz/)

## 相关框架和库的文档

Vue.js：[https://cn.vuejs.org/v2/guide/index.html](https://cn.vuejs.org/v2/guide/index.html)

Vuex: [https://vuex.vuejs.org/zh/guide/](https://vuex.vuejs.org/zh/guide/)

Vue Router: [https://router.vuejs.org/zh/](https://router.vuejs.org/zh/)

Sass: [https://www.sass.hk/docs/](https://www.sass.hk/docs/)

element.ui: [http://element-cn.eleme.io/#/zh-CN/component/installation](http://element-cn.eleme.io/#/zh-CN/component/installation)

epub.js: [https://github.com/futurepress/epub.js/blob/master/documentation/md/API.md](https://github.com/futurepress/epub.js/blob/master/documentation/md/API.md)

Vuescroll: [http://vuescrolljs.yvescoding.org/zh/guide/](http://vuescrolljs.yvescoding.org/zh/guide/)

## 引入

开始学习 Vue.js 前，需要一定的HTML+JS+CSS的基础，理解三个语言的基本概念和语法结构便可。

除此之外需要知道 shell（无论是 cmd、bash 还是 zsh）的一些基本的指令。

电子书阅读器使用 webpack 模板进行开发，需要预先安装 node.js、Vue-cli。

### 安装必要框架和库

#### node.js

下载地址: [https://nodejs.org/en/download/](https://nodejs.org/en/download/)

安装前选择正确的版本，安装时注意将path添加到环境变量，具体安装方法可参考：[https://www.runoob.com/nodejs/nodejs-install-setup.html](https://www.runoob.com/nodejs/nodejs-install-setup.html)

安装完毕后可以在shell中输入 `node --version` 和 `npm --version` 查看node.js是否安装成功。

#### Vue-cli

直接在shell中输入指令：

```bash
npm install vue-cli -g
```

`-g` 表示全局安装，之后就可以使用Vue-cli方便地搭建单页面应用。

如果npm的下载速度过慢，可以使用淘宝的cnpm：

```bash
npm install -g cnpm --registry=https://registry.npm.taobao.org
```

之后就可以使用cnpm代替npm进行模块的安装了。

除了npm，也可以使用yarn进行替代：[https://yarn.bootcss.com/docs/](https://yarn.bootcss.com/docs/)

### 使用vue-cli和webpack模板搭建应用

没有开发工具倾向的同学可以使用WebStorm，可以比较轻松地进行搭建。WebStorm学生可以获得免费教育授权。

WebStorm 下载地址：[http://www.jetbrains.com/webstorm/download/](http://www.jetbrains.com/webstorm/download/)

英文不好的可以使用汉化包：[https://github.com/pingfangx/TranslatorX](https://github.com/pingfangx/TranslatorX)

如果使用 vscod e等文本编辑器，可以使用命令搭建：

```bash
vue init webpack my-project-name
```

`my-project-name` 对应文件夹的名字，现在的版本不推荐使用驼峰命名。

输入命令后会进入搭建应用的引导，第一次使用可以先全部回车应用默认的设置，也可以按照提示选择或输入。

一个例子：

```
? Project name ebookreader
? Project description A  ebookreader with Vue.js
? Author IDKiro
? Vue build standalone
? Install vue-router? Yes
? Use ESLint to lint your code? Yes
? Pick an ESLint preset Standard
? Set up unit tests No
? Setup e2e tests with Nightwatch? No
? Should we run `npm install` for you after the project has been created? (recommended) npm
```

完成以后可以在 my-project-name 中看到以下文件：

![](/img/readme/1.png)

此时可以进入 my-project-name 目录下

```bash
cd my-project-name
```

然后输入以下命令运行开发实例

```bash
npm run dev
```

在浏览器中访问 `localhost:8080` 即可看到：

![](/img/readme/2.png)

这时应用已经搭建完毕，可以开始写程序了。

### Demo的使用

如果想查看按此笔记编写电子书阅读器的效果，可以将项目clone到本地。

进入项目目录下运行命令：

```bash
# 首次运行安装依赖
npm install

# 运行开发实例，访问localhost:8080
npm run dev
```

在浏览器中访问 `localhost:8080` 即可使用本电子书阅读器。

### 部署Demo到服务器

首先要构建部署的项目文件，通过指令：

```bash
npm run build
```

在项目根目录下会生成 `dist` 文件夹，文件夹中的文件直接部署到服务器即可。

## 安装本项目中使用的框架和库

文档介绍中提到过的均为本项目所使用到的依赖，如果一个一个安装依赖包稍微有些繁琐，并且可能存在版本上的问题，所以文件夹中的 `package.json` 就起到了很大的作用，该文件包含了项目所需要的包并且指定了的版本。将本项目的 `package.json` 对刚创建的项目的 `package.json` 进行覆盖，然后在 shell 中输入指令即可完成依赖的安装：

```bash
npm install
```

### 其他依赖包的安装

安装依赖包使用：

```bash
npm install package-name --save
```

仅开发依赖使用：

```bash
npm install package-name --save-dev
```

**两个例子：**

Vuex的安装：

```bash
npm install vuex --save
```

Sass的安装：

```bash
npm install node-sass --save-dev
```

## Vue项目简述

首先了解下Vue项目的一些基本知识。

### 项目的结构

先看一下项目的文件目录，知道哪些文件和文件夹是供我们编辑的：

![](/img/readme/1.png)

#### 文件夹

- `src` 文件夹，包含了整个应用所有的代码源文件，是整个项目最重要的部分
- `config` 文件夹，项目参数
- `static` 静态资源文件夹

因为 `src` 是程序的本体，所以讲一下里面的文件结构：

![](/img/readme/3.png)

`asset` 为资源文件夹，保存图片这类供程序调用的文件，也可以保存一些全局有效的样式。

`components` 为组件文件夹，Vue 有一个很重要的概念————组件，组件可以和其他语言的类或者函数做类比，它一方面可以方便代码的复用，另一方面可以减小单文件的长度，让代码更简洁。

`router` 为路由文件夹，对应 `vue-router` 库，`vue-router` 用于将各个页面（组件）连接起来，提供在不同的页面（组件）间切换的功能。

如果按照默认配置，那么文件夹里没有 `store` 这个文件夹，该文件夹需要安装 `Vuex` 后才能使用。`Vuex` 用于管理应用的状态，可以理解成将程序的状态相关的变量集中存储于 `state` 文件夹的 js 文件中。

#### 文件

**根目录文件：**

- `index.html` 主页面文件，由Vue来渲染
- `package.json` 项目所使用的依赖包

**`src` 文件夹下文件：**

- `main.js` 入口文件，初始化实例，导入全局可用的模块
- `App.vue` 总组件文件，调用组件来进行页面的渲染，可以在此处定义所有页面共用的脚本和样式

**`config` 文件夹下文件：**

- `index.js` index页面的参数

### 文件调用简述

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

再次看 `mian.js` 中的这段代码，其中 `components: { App }` 指定了该入口文件包含的组件，这个组件也就是整个应用的总组件 `App.vue`。

这样，通过编辑 `App.vue` 以及该文件包含的子组件便可编辑页面显示的实际内容。

### Vue 文件简述

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

<span id="lifecycle"></span>
### 生命周期图示

生命周期也是 Vue 中很重要的概念，表示 Vue 的实例从创建到销毁的过程。

![](/img/readme/lifecycle.png)

## 编写项目前的准备

### 开启同局域网下其他设备的访问

打开 `config` 文件夹下的 `index.js` 文件，查看第16~17行：

```javascript
host: 'localhost',
port: 8080,
```

将 `host` 修改为 `'0.0.0.0'` 可以开启监听所有ip的请求，方便其他设备（比如手机）查看页面，修改 `port` 可以修改网页访问的端口，开发中一般不做修改。

```javascript
host: '0.0.0.0',
port: 8080,
```

使用其他设备访问该网页还需要知道本机（运行该网页的PC）的ip，windows的指令为 `ipconfig`，linux 的指令为 `ifconfig -a`。

知道本机ip后可以使用 `ip:8080` 进行网页的访问

### 生成应用所需要的图标

首先找到应用所需要的图标，在 Iconfont 下载 svg 矢量图格式的图标：

Iconfont: [http://www.iconfont.cn/](http://www.iconfont.cn/)

使用下载的图标在 IcoMoon 生成图标组件：

IcoMoon: [https://icomoon.io/app/](https://icomoon.io/app/)

生成图标组件后下载组件压缩包，如果需要在多台终端上开发，最好将压缩包文件放在云端，因为 IcoMoon 的免费版没有云端保存功能，但是可以导入项目。

### 设置全局样式

本项目将样式文件夹 `styles` 全部放在`\src\asset\` 中：

![](/img/readme/4.png)

#### 图标样式

其中 `icon.css` 对应之前下载的图标组件的 `style.css`， `fonts` 则对应之前下载的图标组件的 `fonts`。

#### 全局样式

`reset.scss` 文件用于减少浏览器的不同导致的样式差别，直接在复制一份到该目录下即可：

[https://meyerweb.com/eric/tools/css/reset/](https://meyerweb.com/eric/tools/css/reset/)

这里为了字体的美观在 `reset.scss` 文件中添加了以下一段代码：

```css
html, body {
  width: 100%;
  height: 100%;
  font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","å¾®è½¯é›…é»‘",Arial,sans-serif;
}
```

使用的 `font-family` 为 element-ui 推荐的字体列表：

[http://element-cn.eleme.io/#/zh-CN/component/typography](http://element-cn.eleme.io/#/zh-CN/component/typography)

`global.scss` 则为全局可用的样式表：

```CSS
/* 导入 `reset.scss` */
@import "reset";
/* 定义 `px2rem` 函数 */
$fontSize : 36;
@function px2rem($px) {
  @return ($px / $fontSize) + rem;
}
/* 定义居中样式缩写 */
@mixin center() {
  display: flex;
  justify-content: center;
  align-items: center;
}
/* 设置图标默认样式 */
.icon {
  color: #555555;
  font-size: px2rem(20);
}
```

其中 `px2rem` 函数用于将 px 单位的大小转换为 rem 单位（1rem = 1倍根节点字体大小）的大小，查看本项目的 `App.vue` 可以看到增加了以下一段代码：

```javascript
// 动态调整根节点字体
document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 48 ? 48 : fontSize
  html.style.fontSize = fontSize + 'px'
})
```

这段代码是为了根据屏幕的宽度动态调整根节点字体的大小，让不同屏幕宽度的设备都有较好的字体显示效果。但是其他元素如果直接用 px 为单位进行样式的设置，那么就会使得字体和元素的大小不成比例，所以在全局样式中提供了 `px2rem` 函数，使得样式和字体有较好的一致性。

#### element-ui 主题

element-ui 默认主题的颜色为蓝色，为了和项目颜色一致，需要改变 element-ui 主题的颜色，官方提供了在线工具：

[https://elementui.github.io/theme-chalk-preview/#/zh-CN](https://elementui.github.io/theme-chalk-preview/#/zh-CN)

将下载的压缩包解压后得到的文件放在 `theme` 文件夹即可。

### 导入项目使用的库、组件和全局样式

为了在项目中启用之前准备的库、组件和全局样式，需要编辑 `main.js` ，也就是项目入口文件。

```javascript
import Vue from 'vue' …

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
```

- `import`: 导入库和样式表
- `Vue.use()`: 从库中注册组件供项目使用
- `new Vue()`: 使用包含的组件创建实例

## 项目组件的编写

TODO: 详细解释各组件的功能和相应的代码细节

### Guide.vue: 首页（书架）

### Ebook: 电子书阅读器主界面

### MenuBar.vue: 菜单栏

### TitleBar.vue: 标题栏

### Content.vue: 目录
