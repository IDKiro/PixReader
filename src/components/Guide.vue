<template>
  <div class="guide">
    <div class="book-shelf" ref="bookshelflist">
      <div class="book-wrapper" v-for="(item, index) in bookList" :key="index" :style="{paddingLeft: paddingLeftAndRight + 'rem', paddingRight: paddingLeftAndRight + 'rem'}">
        <div class="book" @click="openBook(index)">
          <div class="book-title" v-show="!ifCoverExist[index]">
            {{bookList[index]}}
          </div>
          <img :src="loadCover(index)" width="100%" height="100%" v-show="ifCoverExist[index]">
        </div>
      </div>
      <div class="book-wrapper" :style="{paddingLeft: paddingLeftAndRight + 'rem', paddingRight: paddingLeftAndRight + 'rem'}">
        <el-upload
          class="uploader"
          :multiple="false"
          :action="actionPath"
          :data="postData"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :on-error="handleUploadError"
          :before-upload="beforeUpload">
          <i class="el-icon-plus uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import TitleBar from './TitleBar'

export default {
  name: 'Guide',
  components: {TitleBar},
  data () {
    return {
      ifCoverExist: [],
      imageUrl: '',
      actionPath: 'http://upload.qiniup.com/',
      postData: {
        // http://jsfiddle.net/6ht3smzd/ 生成
        token: '5sFhEbE9tpcKk6IME0LgegxeEZ5ZmdyAcWJdaT3A:l9pPjtKso14aB5CfwrPZ5TkncjU=:eyJzY29wZSI6ImVib29rLXJlYWRlciIsImRlYWRsaW5lIjoxNTQ3MDEzNDg0fQ==',
        key: ''
      }
    }
  },
  methods: {
    openBook (index) {
      localStorage.setItem('defaultBook', 'http://pgeycpcdk.bkt.clouddn.com/' + this.bookList[index] + '.epub')
      this.$router.push('/ebook')
    },
    handleUploadError () {
      this.$message({
        message: '上传失败，请重试~',
        center: true,
        type: 'warning'
      })
    },
    handleUploadSuccess (res, file) {
      this.$message({
        message: '上传成功！',
        center: true,
        type: 'success'
      })
      // 将电子书加入书籍列表
      localStorage.setItem('defaultBook', 'http://pgeycpcdk.bkt.clouddn.com/' + file.name)
      // 去除文件名后缀
      let pattern = /\.{1}[a-z]{1,}$/
      let bookName = file.name.slice(0, pattern.exec(file.name).index)
      if (localStorage.getItem('booklist')) {
        let bookListTemp = JSON.parse(localStorage.getItem('booklist'))
        bookListTemp.push(bookName)
        localStorage.setItem('booklist', JSON.stringify(bookListTemp))
      } else {
        let bookListTemp = [bookName]
        localStorage.setItem('booklist', JSON.stringify(bookListTemp))
      }
      // 打开上传成功的电子书
      this.$router.push('/ebook')
    },
    beforeUpload (file) {
      this.postData.key = file.name
      const isEpub = file.type === 'application/epub+zip'
      if (!isEpub) {
        this.$message({
          message: '现版本只支持 epub 格式！',
          center: true
        })
      }
      return isEpub
    },
    loadCover (index) {
      return localStorage.getItem('http://pgeycpcdk.bkt.clouddn.com/' + this.bookList[index] + '.epub' + 'cover')
    }
  },
  computed: {
    paddingLeftAndRight () {
      // 根据屏幕宽度调整 book-wrapper 的 padding
      let fontSize = window.innerWidth / 10
      fontSize = fontSize > 48 ? 48 : fontSize
      const bookLineNum = Math.floor((window.innerWidth * 36 / fontSize - 20) / 140)
      return ((window.innerWidth / fontSize - 20 / 36) / bookLineNum - 140 / 36) / 2 + 10 / 36
    },
    bookList () {
      return this.$store.getters.bookList
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
        let img = localStorage.getItem('http://pgeycpcdk.bkt.clouddn.com/' + this.bookList[index] + '.epub' + 'cover')
        if (img) {
          this.$set(this.ifCoverExist, index, true)
        } else {
          this.$set(this.ifCoverExist, index, false)
        }
      })
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "../assets/styles/global";

  .guide {
    position: relative;
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
          cursor: pointer;
          @include center;
          .book-title {
            width: 80%;
            font-size: px2rem(11);
            text-align: center;
          }
        }
      }
      .uploader .el-upload {
        cursor: pointer;
        position: relative;
        overflow: hidden;
      }
      .uploader-icon {
        border: px2rem(1) dashed #d9d9d9;
        border-radius: px2rem(6);
        font-size: px2rem(28);
        color: #8c939d;
        height: px2rem(170);
        width: px2rem(120);
        @include center;
      }
    }
  }
</style>
