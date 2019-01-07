# Content.vue: 目录和书签

电子书阅读器主界面的菜单栏中目录和书签的实现。

## 页面构成

目录和书签组件顶部部分为目录/书签切换按钮，主体部分为目录和书签的内容。

## 目录和书签切换

目录和书签切换时的显示效果改变和主题切换时一个思路，通过绑定 `class` 和相应的点击调用函数来实现样式的改变。

```html
<div class="content-bookmark">
  <div class="changeTag" :class="{'selected': chooseContentOrBookmark === true}" @click="chooseContent">目录</div>
  <div class="changeTag" :class="{'selected': chooseContentOrBookmark === false}" @click="chooseBookmark">书签</div>
</div>
```

通过 `v-show` 指令和 `chooseContentOrBookmark` 决定目录和书签的显示与否。

```javascript
chooseContent () {
  this.chooseContentOrBookmark = true
},
chooseBookmark () {
  this.chooseContentOrBookmark = false
}
```

背景颜色可以参考 Element-UI 提供的RGB值。

```css
&.selected {
  background: #F2F6FC;
}
```

## 目录

目录的列表渲染和主题的列表渲染方式一致，使用 `v-for` 指令监听列表项的点击事件。`Ebook` 组件生成 `navigation` 后保存在 `state` 中，并使用计算属性进行调用。遍历导航中的目录属性 `navigation.toc` 即可获取目录的标题和对应的位置链接。为了在目录未生成时显示提示，需要使用 `v-if` 和 `v-else` 进行条件渲染。

```html
<div class="content-wrapper" v-if="bookAvailable" v-show="chooseContentOrBookmark">
<vue-scroll>
  <div class="content-item"
      v-for="(item, index) in navigation.toc"
      :key="index"
      @click="jumpTo(item.href)">
  <span class="text">{{item.label}}</span>
  </div>
</vue-scroll>
</div>
<div class="empty" v-else v-show="chooseContentOrBookmark">加载中...</div>
```

`jumpTo` 方法即目录的跳转方法，参数为目标链接。因为 `jumpTo` 方法在 `Ebook` 组件中，所以需要先调用父组件 `MenuBar` 的同名方法，再调用父组件的父组件的同名方法。

```javascript
jumpTo (href) {
  this.rendition.display(href)
  this.hideTitleAndMenu()
  this.pageChanged()
}
```

## 书签

书签和目录的方法基本一致。

```html
<div class="content-wrapper" v-if="bookmarks" v-show="!chooseContentOrBookmark">
  <vue-scroll>
  <div class="content-item"
      v-for="(item, index) in bookmarks"
      :key="index"
      @click="turnMarkPage(index)">
      <span class="text">{{item.title}}</span>
  </div>
  </vue-scroll>
</div>
<div class="empty" v-else v-show="!chooseContentOrBookmark">您还没有添加书签哦~</div>
```

这里条件渲染则是根据书签有没有被定义，在 `Ebook` 组件中 `bookmarks` 只有在存在项时才定义为数组，为空时定义为 `undefined`.

```javascript
if (!this.bookmarks) {
  this.$store.commit('setBookmarks', [])
}
```

```javascript
if (this.bookmarks.length < 1) {
  this.$store.commit('setBookmarks', undefined)
}
```

书签的跳转方法则类似于进度条跳转，使用的是 CFI。

```javascript
turnMarkPage (index) {
  this.rendition.display(this.bookmarks[index].cfi)
  this.hideTitleAndMenu()
  this.pageChanged()
}
```

## 切换动画

目录的切换动画和标题栏、菜单栏完全一致，只需要将方向从纵轴改为横轴即可。

```css
&.slide-right-enter, &.slide-right-leave-to {
    transform: translate3d(-100%, 0, 0);
}
&.slide-right-enter-to, &.slide-right-leave {
    transform: translate3d(0, 0, 0);
}
&.slide-right-enter-active, &.slide-right-leave-active {
    transition: all .3s linear;
}
```