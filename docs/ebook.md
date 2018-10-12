# Ebook: 电子书阅读器主界面

电子书阅读器的阅读界面，标题栏和菜单栏在该组件导入进行调用，阅读功能的实现集中在该组件内。

### Feature

1. 可选主题的定义
2. 可选字体大小的定义
3. 电子书的显示、定位、书签等核心功能的实现

### TODO

1. 翻页样式的设置
2. 滑动翻页

## 页面构成

阅读器页面的结构分为三层，由 CSS 的 `z-index` 属性来定义元素的层次。

最下面一层为阅读显示层，调用 epub.js 提供的属性和方法来进行阅读功能的实现。

中间一层为蒙版层，用于检测用户在阅读时的点击事件，中间为切换标题栏和菜单栏的显示状态，左右分别为上一页和下一页。

最上面一层为标题栏和菜单栏的显示层，标题栏和菜单栏通过调用子组件进行渲染，通过绑定和监听与子组件进行数据的传递。

## 阅读功能

`showEpub` 方法为阅读方法的实现部分，各部分的操作已做注释。

```javascript
showEpub () {
  // 重置部分状态为不可用
  this.$store.commit('setBookAvailable', false)
  // 从本地存储记录里加载上次选择的图书
  this.book = new Epub(localStorage.getItem('defaultBook'))
  // 获取 Rendition，定义显示区域
  this.rendition = this.book.renderTo('read', {
    width: window.innerWidth,
    height: window.innerHeight
  })
  // 显示电子书，如该电子书阅读过，则直接加载上一次阅读到的位置
  if (localStorage.getItem(localStorage.getItem('defaultBook') + 'bookReadLocation')) {
    this.rendition.display(localStorage.getItem(localStorage.getItem('defaultBook') + 'bookReadLocation'))
  } else {
    this.rendition.display()
  }
  // 设置字体，如本地存储中保存有更改过的默认设置，则加载
  if (localStorage.getItem('defaultFontSize')) {
    this.$store.commit('setDefaultFontSize', parseInt(localStorage.getItem('defaultFontSize')))
  }
  this.setFontSize(this.defaultFontSize)
  // 注册和加载主题，如本地存储中保存有更改过的默认设置，则加载
  this.themes = this.rendition.themes
  this.registerTheme()
  if (localStorage.getItem('defaultTheme')) {
    this.$store.commit('setDefaultTheme', parseInt(localStorage.getItem('defaultTheme')))
  }
  this.setTheme(this.defaultTheme)
  // 加载目录和书签并开始生成定位
  this.book.ready.then(() => {
    // 保存电子书的封面
    this.book.loaded.metadata.then(() => {
      this.book.archive.getBase64(this.book.cover).then(value => {
        localStorage.setItem(localStorage.getItem('defaultBook') + 'cover', value)
      })
    })
    this.$store.commit('openNavigation', this.book.navigation)
    if (localStorage.getItem(localStorage.getItem('defaultBook'))) {
      this.$store.commit('setBookmarks', JSON.parse(localStorage.getItem(localStorage.getItem('defaultBook'))))
    } else {
      this.$store.commit('setBookmarks', undefined)
    }
    return this.book.locations.generate(1650)
  }).then(() => {
    // 加载定位并将进度条、书签等功能启用
    this.location = this.book.locations
    this.$store.commit('setBookAvailable', true)
  })
}
```

因为 epub.js 解析电子书有一定的顺序要求，所以需要使用 `Promise.prototype.then()` 方法来规定顺序，当 `Promise` 为成功时才执行后续的步骤。电子书加载时需要加载完成才允许生成目录和定位，当资源加载后才允许获取资源中的封面。

在上传书籍后直接打开书籍也是为了加载书籍后获取书籍的封面图片并保存供书架使用。当然这部分也可以在书架中实现，只要加载后不显示电子书即可，再使用 `foreach` 遍历 `filelist` 获取每本书的封面。

## 蒙版

蒙版部分使用绝对位置使其覆盖在整个页面，并用 `flex` 布局分割为三个区域，点击三个区域时分别触发相应的方法。

翻页功能较为简单，直接调用 epub.js 提供的方法即可。为了实现点击后隐藏标题栏、菜单栏等的功能，调用 `hideTitleAndMenu` 方法，最后调用 `pageChanged` 方法来进行页面数据的更新，用于检测当前页是否被加入书签。

```javascript
prevpage () {
  if (this.rendition) {
    this.rendition.prev()
  }
  this.hideTitleAndMenu()
  this.pageChanged()
},
nextpage () {
  if (this.rendition) {
    this.rendition.next()
  }
  this.hideTitleAndMenu()
  this.pageChanged()
}
```

```javascript
hideTitleAndMenu () {
  if (this.ifTitleAndMenuShow) {
    this.$store.commit('setTitleAndMenuShow', false)
    this.$refs.menuBar.hideSetting()
    this.$refs.menuBar.hideContent()
  }
}
```

点击蒙版的中间位置调用切换菜单栏和标题栏显示状态的方法，因为设置栏由菜单栏呼出，所以要一同隐藏。

```javascript
toggleTitleAndMenu () {
  this.$store.commit('toggleTitleAndMenu')
  // 如果菜单栏隐藏，那设置栏也一同隐藏
  if (!this.ifTitleAndMenuShow) {
    this.$refs.menuBar.hideSetting()
  }
}
```

`hideSetting` 和 `hideContent` 方法均在子组件中，调用子组件的方法不需要进行绑定或者监听。

## 主题和字体

epub.js 支持主题的更换，按照规定格式定义对象即可：

```javascript
{
  name: '默认',
  style: {
    body: {
      'color': '#000', 'background': '#fff'
    }
  }
}
```

使用主题前需要对主题进行注册，使用遍历便可以完成。设置主题直接调用 `select` 方法即可。

```javascript
registerTheme () {
  this.themeList.forEach(themes => {
    this.themes.register(themes.name, themes.style)
  })
},
setTheme (index) {
  this.themes.select(this.themeList[index].name)
  this.$store.commit('setDefaultTheme', index)
  localStorage.setItem('defaultTheme', index)
}
```

字体在 epub.js 中属于主题的一部分，可以通过 `fontSize` 方法设置字体大小。

```javascript
setFontSize (fontSize) {
  this.$store.commit('setDefaultFontSize', fontSize)
  if (this.themes) {
    this.themes.fontSize(fontSize + 'px')
  }
  localStorage.setItem('defaultFontSize', fontSize)
}
```

为了保存用户的偏好，将这些设置数据全部保存在 `localStorage` 中。

## 其他功能

书签、定位、跳转、设置字体和主题等功能虽然也在本组件内实现，但是实际调用在子组件内，将在子组件的笔记中进行记录。
