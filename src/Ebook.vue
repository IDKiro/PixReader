<template>
  <div class="ebook">
    <title-bar @addBookmark="addBookmark"
               @removeBookmark="removeBookmark"></title-bar>
    <div class="loading" v-if="!bookReady">
      <div class="spinner">
        <div class="rect1"></div>
        <div class="rect2"></div>
        <div class="rect3"></div>
        <div class="rect4"></div>
        <div class="rect5"></div>
      </div>
    </div>
    <div class="read-wrapper" v-else>
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
import TitleBar from './components/TitleBar'
import MenuBar from './components/MenuBar'
global.ePub = Epub

export default {
  name: 'Ebook',
  components: {MenuBar, TitleBar},
  data () {
    return {
      bookReady: false,
      themeList: [
        {name: '默认', style: {body: {'color': '#000', 'background': '#fff'}}},
        {name: '护眼', style: {body: {'color': '#000', 'background': '#c7edcc'}}},
        {name: '夜间', style: {body: {'color': '#F8F8F2', 'background': '#272822'}}},
        {name: '纸质', style: {body: {'color': '#000', 'background': '#caad75'}}}
      ],
      fontSizeList: [
        { fontSize: 12 },
        { fontSize: 14 },
        { fontSize: 16 },
        { fontSize: 18 },
        { fontSize: 20 },
        { fontSize: 22 },
        { fontSize: 24 }
      ],
      client: null
    }
  },
  mounted () {
    this.openBook()
  },
  methods: {
    openBook () {
      this.$store.commit('setBookAvailable', false)
      if (this.localUrl) {
        this.showEpub(this.localUrl, true)
      } else {
        this.client.presignedGetObject(this.bucketName, localStorage.getItem('defaultBookName'), (err, presignedUrl) => {
          if (err) throw err
          this.showEpub(presignedUrl, false)
        })
      }
    },
    showEpub (url, ifBinary) {
      this.book = new Epub(url, ifBinary ? {encoding: 'binary'} : undefined)
      this.rendition = this.book.renderTo('read', {
        width: window.innerWidth,
        height: window.innerHeight
      })
      if (localStorage.getItem(localStorage.getItem('defaultBookName') + 'bookReadLocation')) {
        this.rendition.display(localStorage.getItem(localStorage.getItem('defaultBookName') + 'bookReadLocation'))
      } else {
        this.rendition.display()
      }
      if (localStorage.getItem('defaultFontSize')) {
        this.$store.commit('setDefaultFontSize', parseInt(localStorage.getItem('defaultFontSize')))
      }
      this.themes = this.rendition.themes
      this.setFontSize(this.defaultFontSize)
      this.registerTheme()
      if (localStorage.getItem('defaultTheme')) {
        this.$store.commit('setDefaultTheme', parseInt(localStorage.getItem('defaultTheme')))
      }
      this.setTheme(this.defaultTheme)
      this.book.ready.then(() => {
        this.bookReady = true
        this.book.loaded.metadata.then(() => {
          this.book.archive.getBase64(this.book.cover).then(value => {
            const localForage = require('localforage')
            localForage.setItem(localStorage.getItem('defaultBookName') + 'cover', value)
          })
        })
        this.$store.commit('openNavigation', this.book.navigation)
        if (localStorage.getItem(localStorage.getItem('defaultBookName'))) {
          this.$store.commit('setBookmarks', JSON.parse(localStorage.getItem(localStorage.getItem('defaultBookName'))))
        } else {
          this.$store.commit('setBookmarks', undefined)
        }
        return this.book.locations.generate(1650)
      }).then(() => {
        this.location = this.book.locations
        this.$store.commit('setBookAvailable', true)
        this.isBookMarked()
      })
    },
    toggleTitleAndMenu () {
      this.$store.commit('toggleTitleAndMenu')
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
      localStorage.setItem(localStorage.getItem('defaultBookName'), JSON.stringify(this.bookmarks))
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
      } else {
        this.$store.commit('setBookMarked', false)
      }
    },
    pageChanged () {
      this.isBookMarked()
      let currentCfi = this.rendition.currentLocation()
      currentCfi = currentCfi.start.cfi
      localStorage.setItem(localStorage.getItem('defaultBookName') + 'bookReadLocation', currentCfi)
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
    },
    endPoint () {
      return localStorage.getItem('endPoint')
    },
    port () {
      return parseInt(localStorage.getItem('port'))
    },
    useSSL () {
      return false
    },
    accessKey () {
      return localStorage.getItem('accessKey')
    },
    secretKey () {
      return localStorage.getItem('secretKey')
    },
    bucketName () {
      return localStorage.getItem('bucketName')
    },
    localUrl () {
      return this.$store.state.localUrl
    }
  },
  created () {
    const Minio = require('minio')
    this.client = new Minio.Client({
      endPoint: this.endPoint,
      port: this.port,
      useSSL: this.useSSL,
      accessKey: this.accessKey,
      secretKey: this.secretKey
    })
  }
}
</script>

<style lang='scss' scoped>
  @import "./assets/styles/global";
  .ebook {
    overflow: hidden;
    position: relative;
    .loading {
      height: 100vh;
      .spinner {
        height: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: px2rem(12);
      }
      .spinner > div {
        background-color: #ccc;
        margin: px2rem(3);
        height: px2rem(100);
        width: px2rem(5);
        display: inline-block;
        -webkit-animation: stretchdelay 1.2s infinite ease-in-out;
        animation: stretchdelay 1.2s infinite ease-in-out;
        &.rect2 {
          -webkit-animation-delay: -1.1s;
          animation-delay: -1.1s;
        }
        &.rect3 {
          -webkit-animation-delay: -1.0s;
          animation-delay: -1.0s;
        }
        &.rect4 {
          -webkit-animation-delay: -0.9s;
          animation-delay: -0.9s;
        }
        &.rect5 {
          -webkit-animation-delay: -0.8s;
          animation-delay: -0.8s;
        }
      }
      @-webkit-keyframes stretchdelay {
        0%, 40%, 100% { -webkit-transform: scaleY(0.4) }
        20% { -webkit-transform: scaleY(1.0) }
      }
      @keyframes stretchdelay {
        0%, 40%, 100% {
          transform: scaleY(0.4);
          -webkit-transform: scaleY(0.4);
        }  20% {
          transform: scaleY(1.0);
          -webkit-transform: scaleY(1.0);
        }
      }
    }
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
          cursor: url(./assets/icon/left.png), pointer;
          flex: 0 0 px2rem(100);
        }
        .center {
          cursor: pointer;
          flex: 1;
        }
        .right {
          cursor: url(./assets/icon/right.png), pointer;
          flex: 0 0 px2rem(100);
        }
      }
    }
  }
</style>
