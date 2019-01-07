<template>
  <vue-scroll>
    <div class="book-shelf" ref="bookshelflist">
      <div class="book-wrapper" v-for="(item, index) in bookList" :key="index" :style="{paddingLeft: paddingLeftAndRight + 'rem', paddingRight: paddingLeftAndRight + 'rem'}">
        <div class="book" @click="openBook(index)">
          <div class="book-title" v-show="!ifCoverExist[index]">
            {{bookList[index]}}
          </div>
          <img :src="cover[index]" width="100%" height="100%" v-show="ifCoverExist[index]">
        </div>
      </div>
      <div class="book-wrapper" :style="{paddingLeft: paddingLeftAndRight + 'rem', paddingRight: paddingLeftAndRight + 'rem'}">
        <div class="sync">
          <label @click="syncBook">
            <span class="icon-reload icon" :class="{'go': rotate}"></span>
          </label>
        </div>
      </div>
    </div>
  </vue-scroll>
</template>

<script>
export default {
  name: 'Shelf',
  data () {
    return {
      paddingLeftAndRight: 1,
      cover: [],
      ifCoverExist: [],
      rotate: false,
      client: null
    }
  },
  methods: {
    openBook (index) {
      this.$store.commit('setLocalUrl', undefined)
      this.client.presignedGetObject(this.bucketName, this.bookList[index] + '.epub', (err, ) => {
        if (err) throw err
        localStorage.setItem('defaultBookName', this.bookList[index] + '.epub')
        this.$store.commit('setShowBook', true)
      })
    },
    syncBook () {
      this.rotate = true
      let stream = this.client.listObjects(this.bucketName, '', true)
      let booklist = []
      stream.on('data', (obj) => {
        let pattern = /\.{1}[a-z]{1,}$/
        let bookName = obj.name.slice(0, pattern.exec(obj.name).index)
        booklist.push(bookName)
      })
      stream.on('end', () => {
        localStorage.setItem('booklist', JSON.stringify(booklist))
        if (booklist) {
          this.$store.commit('setBookList', booklist)
        } else {
          this.$store.commit('setBookList', undefined)
        }
      })
      setTimeout(() => {
        this.rotate = false
      }, 1000)
    },
    changePadding () {
      if (this.$refs.bookshelflist) {
        let fontSize = document.documentElement.clientWidth / 10
        fontSize = fontSize > 48 ? 48 : fontSize
        const bookLineNum = Math.floor((this.$refs.bookshelflist.clientWidth * 36 / fontSize - 20) / 140)
        this.paddingLeftAndRight = ((this.$refs.bookshelflist.clientWidth / fontSize - 20 / 36) / bookLineNum - 140 / 36) / 2 + 10 / 36
      }
    }
  },
  computed: {
    bookList () {
      return this.$store.getters.bookList
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
    }
  },
  mounted () {
    if (localStorage.getItem('booklist')) {
      this.$store.commit('setBookList', JSON.parse(localStorage.getItem('booklist')))
    } else {
      this.$store.commit('setBookList', undefined)
    }
    if (this.bookList) {
      this.bookList.forEach((book, index) => {
        const localForage = require('localforage')
        localForage.getItem(this.bookList[index] + '.epub' + 'cover').then((value) => {
          let img = value
          if (img) {
            this.$set(this.cover, index, img)
            this.$set(this.ifCoverExist, index, true)
          } else {
            this.$set(this.ifCoverExist, index, false)
          }
        })
      })
    }
    this.changePadding()
    let that = this
    window.onresize = () => {
      that.changePadding()
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
  @import "../assets/styles/global";

  .book-shelf {
    display: flex;
    flex-wrap: wrap;
    position: relative;
    padding: px2rem(10);
    .book-wrapper {
      padding: px2rem(10);
      @include center;
      .book {
        height: px2rem(170);
        width: px2rem(120);
        background: beige;
        box-shadow: px2rem(3) px2rem(3) px2rem(5)  rgba(0, 0, 0, .5);
        cursor: pointer;
        @include center;
        .book-title {
          width: 80%;
          font-size: px2rem(11);
          text-align: center;
        }
      }
    }
    .sync {
      position: relative;
      overflow: hidden;
      label {
        cursor: pointer;
        border: px2rem(1) dashed #d9d9d9;
        border-radius: px2rem(6);
        color: #8c939d;
        height: px2rem(168);
        width: px2rem(118);
        @include center;
        span {
          font-size: px2rem(36);
        }
        .go {
          transform: rotate(360deg);
          transition: all 1s;
        }
      }
    }
  }
</style>
