<template>
  <div class="ebook">
    <title-bar @addBookmark="addBookmark"
               @removeBookmark="removeBookmark"></title-bar>
    <div class="read-wrapper">
      <div id="read"></div>
      <div class="mask">
        <div class="left" @click="prevpage"></div>
        <div class="center" @click="toggleTitleAndMenu"></div>
        <div class="right" @click="nextpage"></div>
      </div>
    </div>
    <menu-bar :themeList="themeList"
              :fontSizeList="fontSizeList"
              @setFontSize="setFontSize"
              @setTheme="setTheme"
              @onProgressChange="onProgressChange"
              @getCurrentLocation="getCurrentLocation"
              @jumpTo="jumpTo"
              @turnMarkPage="turnMarkPage"
              ref="menuBar"></menu-bar>
  </div>
</template>

<script>
import Epub from 'epubjs'
import TitleBar from './TitleBar'
import MenuBar from './MenuBar'
global.ePub = Epub
export default {
  name: 'Ebook',
  components: {MenuBar, TitleBar},
  data () {
    return {
      themeList: [
        {
          name: '默认',
          style: {
            body: {
              'color': '#000', 'background': '#fff'
            }
          }
        },
        {
          name: '护眼',
          style: {
            body: {
              'color': '#000', 'background': '#c7edcc'
            }
          }
        },
        {
          name: '夜间',
          style: {
            body: {
              'color': '#fff', 'background': '#272822'
            }
          }
        },
        {
          name: '纸质',
          style: {
            body: {
              'color': '#000', 'background': '#caad75'
            }
          }
        }
      ],
      fontSizeList: [
        { fontSize: 12 },
        { fontSize: 14 },
        { fontSize: 16 },
        { fontSize: 18 },
        { fontSize: 20 },
        { fontSize: 22 },
        { fontSize: 24 }
      ]
    }
  },
  mounted () {
    this.showEpub()
  },
  methods: {
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
    },
    toggleTitleAndMenu () {
      this.$store.commit('toggleTitleAndMenu')
      // 如果菜单栏隐藏，那设置栏也一同隐藏
      if (!this.ifTitleAndMenuShow) {
        this.$refs.menuBar.hideSetting()
      }
    },
    hideTitleAndMenu () {
      if (this.ifTitleAndMenuShow) {
        this.$store.commit('setTitleAndMenuShow', false)
        this.$refs.menuBar.hideSetting()
        this.$refs.menuBar.hideContent()
      }
    },
    setFontSize (fontSize) {
      this.$store.commit('setDefaultFontSize', fontSize)
      if (this.themes) {
        this.themes.fontSize(fontSize + 'px')
      }
      localStorage.setItem('defaultFontSize', fontSize)
    },
    registerTheme () {
      this.themeList.forEach(themes => {
        this.themes.register(themes.name, themes.style)
      })
    },
    setTheme (index) {
      this.themes.select(this.themeList[index].name)
      this.$store.commit('setDefaultTheme', index)
      localStorage.setItem('defaultTheme', index)
    },
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
    },
    onProgressChange (progress) {
      const percentage = progress / 100
      const location = percentage > 0 ? this.location.cfiFromPercentage(percentage) : 0
      this.rendition.display(location)
      this.pageChanged()
    },
    getCurrentLocation () {
      let currentLocation = this.rendition.currentLocation()
      this.$store.commit('setBookCurrentLocation', this.location.percentageFromCfi(currentLocation.start.cfi) * 100)
    },
    jumpTo (href) {
      this.rendition.display(href)
      this.hideTitleAndMenu()
      this.pageChanged()
    },
    turnMarkPage (index) {
      this.rendition.display(this.bookmarks[index].cfi)
      this.hideTitleAndMenu()
      this.pageChanged()
    },
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
    },
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
    },
    isBookMarked () {
      let currentCfi = this.rendition.currentLocation()
      currentCfi = currentCfi.start.cfi
      if (this.bookmarks) {
        this.$store.commit('setBookMarked', this.bookmarks.some(item => {
          return item.cfi === currentCfi
        }))
      }
    },
    pageChanged () {
      // TODO: 每次页面改变都执行函数消耗过多资源，待优化
      this.isBookMarked()
      // 每次页面改变都改变本地存储的电子书进度记录
      let currentCfi = this.rendition.currentLocation()
      currentCfi = currentCfi.start.cfi
      localStorage.setItem(localStorage.getItem('defaultBook') + 'bookReadLocation', currentCfi)
    }
  },
  computed: {
    ifTitleAndMenuShow () {
      return this.$store.state.ifTitleAndMenuShow
    },
    bookmarks () {
      return this.$store.state.bookmarks
    },
    defaultFontSize () {
      return this.$store.state.defaultFontSize
    },
    defaultTheme () {
      return this.$store.state.defaultTheme
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "../assets/styles/global";
  .ebook {
    overflow: hidden;
    position: relative;
    .read-wrapper {
      .mask {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 100;
        display: flex;
        .left {
          flex: 0 0 px2rem(100);
        }
        .center {
          flex: 1;
        }
        .right {
          flex: 0 0 px2rem(100);
        }
      }
    }
  }
</style>
