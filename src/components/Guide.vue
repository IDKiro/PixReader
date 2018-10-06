<template>
  <div class="guide">
    <div class="book-shelf" ref="bookshelflist">
      <div class="book-wrapper" v-for="(item, index) in bookList" :key="index" :style="{paddingLeft: paddingLeftAndRight + 'rem', paddingRight: paddingLeftAndRight + 'rem'}">
        <div class="book" @click="openBook(index)">
          <div class="book-title" v-show="!ifCoverExist[index]">
            {{bookList[index]}}
          </div>
          <img :src="'/static/cover/'+bookList[index]+'.jpg'" width="100%" height="100%" v-show="ifCoverExist[index]">
        </div>
      </div>
      <div class="book-wrapper" :style="{paddingLeft: paddingLeftAndRight + 'rem', paddingRight: paddingLeftAndRight + 'rem'}">
        <el-upload
          class="uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleUploadSuccess"
          :before-upload="beforeUpload"> <!-- TODO: 上传文件和后台对接-->
          <i class="el-icon-plus uploader-icon"></i>
        </el-upload>
      </div>
    </div>
  </div>
</template>

<script>
import Epub from 'epubjs'
import TitleBar from './TitleBar'

export default {
  name: 'Guide',
  components: {TitleBar},
  data () {
    return {
      ifCoverExist: [],
      imageUrl: ''
    }
  },
  methods: {
    openBook (index) {
      localStorage.setItem('defaultBook', '/static/library/' + this.bookList[index] + '.epub')
      this.$router.push('/ebook')
    },
    // TODO: 上传文件时解析封面并单独保存
    loadCover () {
      this.bookList.forEach((book, index) => {
        this.book = new Epub('/static/library/' + book + '.epub')
        this.book.ready.then(() => {
          this.book.loaded.metadata.then(() => {
            this.book.archive.getBase64(this.book.cover).then(value => {
              console.log(value)
            })
          })
        })
      })
    },
    // TODO: 上传成功后的相关操作
    handleUploadSuccess (res, file) {
      console.log(file)
      this.loadCover()
    },
    beforeUpload (file) {
      this.$message.error({
        message: '暂不支持用户上传文件!',
        center: true
      })
      const isEpub = file.type === 'application/epub+zip'
      if (!isEpub) {
        this.$message({
          message: '现版本只支持 epub 格式!',
          center: true
        })
      }
      return isEpub
    }
  },
  computed: {
    paddingLeftAndRight () {
      // 根据屏幕宽度调整 book-wrapper 的 padding
      let fontSize = window.innerWidth / 10
      fontSize = fontSize > 48 ? 48 : fontSize
      const bookLineNum = Math.floor((window.innerWidth * 36 / fontSize - 20) / 140)
      const paddingLR = ((window.innerWidth / fontSize - 20 / 36) / bookLineNum - 140 / 36) / 2 + 10 / 36
      return paddingLR
    },
    bookList () {
      return this.$store.getters.bookList
    }
  },
  mounted () {
    // TODO: 读取文件夹内的电子书列表
    this.$store.commit('setBookList',
      ['我的青春恋爱物语果然有问题01',
        '我的青春恋爱物语果然有问题02',
        '我的青春恋爱物语果然有问题03',
        '我的青春恋爱物语果然有问题04',
        '我的青春恋爱物语果然有问题05',
        '我的青春恋爱物语果然有问题06',
        '我的青春恋爱物语果然有问题07',
        '我的青春恋爱物语果然有问题08',
        '我的青春恋爱物语果然有问题09',
        '我的青春恋爱物语果然有问题10',
        '我的青春恋爱物语果然有问题11',
        '我的青春恋爱物语果然有问题12'])
    this.bookList.forEach((book, index) => {
      let img = new Image()
      img.src = '/static/cover/' + book + '.jpg'
      img.onload = () => {
        if (img.width > 0 && img.height > 0) {
          this.$set(this.ifCoverExist, index, true)
        } else {
          this.$set(this.ifCoverExist, index, false)
        }
      }
    })
  }
}
</script>

<style lang='scss' scoped>
  @import "../assets/styles/global";

  .guide {
    position: relative;
    @include center;
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
