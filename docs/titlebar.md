# MenuBar.vue: 菜单栏

电子书阅读器主界面的标题栏的实现。

### Feature

1. 返回
2. 添加/去除书签

### TODO

1. 搜索

## 页面构成

标题栏的构成非常简单，左边按钮组内现在只有一个返回功能，右边按钮组现在只有一个书签功能。点击返回按钮可以返回到书架，点击书签则可以添加或删去书签。通过判断该页面是否被标记书签，使用 `v-if` 和 `v-else` 决定是否渲染添加或删去书签的按钮，同一状态只会显示其中一个按钮。其中，返回按钮的功能实现在路由管理器中记录。

## 书签

添加书签要调用 epub.js 解析的电子书对象，所以调用方法都使用 `$emit` 组件进行事件的触发，让父组件监听到事件进而执行父组件的方法。

```javascript
addBookmark () {
  this.$emit('addBookmark')
},
removeBookmark () {
  this.$emit('removeBookmark')
}
```

```html
<title-bar @addBookmark="addBookmark"
            @removeBookmark="removeBookmark"></title-bar>
```

父组件的书签实现方法中的书签添加删除、书签已添加判定和标题栏组件有关。

加载定位完成后，可以用epub.js提供的 `rendition.currentLocation()` 方法来生成当前定位的相关信息，包括当前位置的开始和结束位置的 cfi(epub 的标记方法)。epub.js提供的 `display`方法的对象可以是 cfi，`display(cfi)` 可以直接显示该 cfi 所标记的电子书文本。那么书签就可以定义为一个数组，将要添加书签处的开始的 cfi 添加进数组中即可。 同样，为了保存用户的书签，需要将书签数组保存至 `localStorage`。因为 `cookie` 和 `localStorage` 都只保存字符串，所以需要使用 `JSON` 模块来进行转换。添加书签后，直接将书签的状态设置为已添加，此时添加书签按钮变成移除书签按钮。

```javascript
addBookmark () {
  let currentCfi = this.rendition.currentLocation()
  currentCfi = currentCfi.start.cfi
  let currentContents = this.rendition.getContents()
  currentContents = currentContents[0].document.title
  let currentBookmark = {cfi: currentCfi, title: currentContents}
  if (!this.bookmarks) {
    this.$store.commit('setBookmarks', [])
  }
  this.$store.commit('pushBookmark', currentBookmark)
  localStorage.setItem(localStorage.getItem('defaultBook'), JSON.stringify(this.bookmarks))
  this.$store.commit('setBookMarked', true)
}
```

移除书签的方法则和添加书签相反，先读取书签，再对比书签中和当前页面 cfi 一致的项，调用方法进行数组元素的删除即可。

```javascript
removeBookmark () {
  let currentCfi = this.rendition.currentLocation()
  currentCfi = currentCfi.start.cfi
  this.bookmarks.forEach((item, index) => {
    if (item.cfi === currentCfi) {
      this.$store.commit('spliceBookmark', index)
    }
  })
  if (this.bookmarks.length < 1) {
    this.$store.commit('setBookmarks', undefined)
  }
  this.$store.commit('setBookMarked', false)
}
```

每当页面改变时，都要进行当前页是否加入书签的判断，来决定显示添加书签的按钮还是显示移除书签的按钮。

```javascript
isBookMarked () {
  let currentCfi = this.rendition.currentLocation()
  currentCfi = currentCfi.start.cfi
  if (this.bookmarks) {
    this.$store.commit('setBookMarked', this.bookmarks.some(item => {
      return item.cfi === currentCfi
    }))
  }
}
```

## 切换动画

标题栏的显示通过父组件控制存储状态进行控制。

```html
<div class="title-wrapper" v-show="ifTitleAndMenuShow"><div>
```

Vue 在更新 DOM 时可以添加过渡动画，最常用的过渡使用 CSS 过渡。

需要应用过渡动画的元素需要用 `transition` 标签的元素进行包裹，并且制定过渡动画的 `name` 属性。

```html
<transition name="slide-down"></transition>
```

因为 `transition` 标签元素包裹着应用动画的元素，需要使用 `&.` 定位到父元素。该 CSS 过渡动画定义了进入前、进入后的动画状态以及动画的形式。

```css
&.slide-down-enter, &.slide-down-leave-to {
  transform: translate3d(0, -100%, 0);
}
&.slide-down-enter-to, &.slide-down-leave {
  transform: translate3d(0, 0, 0);
}
&.slide-down-enter-active, &.slide-down-leave-active {
  transition: all .3s linear;
}
```

标题栏在移入前和移除后都处于页面外，移入后则处于页面的最上方，动画使用直线移动即可。
