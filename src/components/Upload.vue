<template>
  <div class="uploader">
    <label class="uploadArea"
      ref="uploadArea"
      for="uploadfile"
      @drop.prevent="onDrop"
      @dragover.prevent="onDragover"
      @dragleave.prevent="dragover = false">
      <span class="icon-upload icon"></span>
      <div class="text">点击或者拖拽进行上传</div>
    </label>
    <input id="uploadfile" name="file" ref="uploader" type="file" multiple="multiple" accept="application/epub+zip" v-show="false" @change="upload"/>
  </div>
</template>

<script>
export default {
  name: 'Upload',
  data () {
    return {
      client: null,
      dragover: false,
      progress: 0
    }
  },
  methods: {
    upload () {
      let fileObj = this.$refs.uploader.files
      for (let i = 0; i < fileObj.length; i++) {
        let file = fileObj[i]
        this.client.presignedPutObject(this.bucketName, file.name, (err, url) => {
          if (err) throw err
          let xhr = new XMLHttpRequest()
          xhr.open('PUT', url, true)
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              this.progress = (event.loaded / event.total) * 100
              this.$refs.uploadArea.style.backgroundSize = `${this.progress}% 100%`
            }
          }
          xhr.send(file)
          xhr.onload = () => {
            if (xhr.status === 200) {
              this.$refs.uploadArea.style.backgroundSize = `0 100%`
              this.UploadSuccess(file)
            }
          }
        })
      }
    },
    UploadSuccess (file) {
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
    },
    onDragover () {
      if (!this.disabled) {
        this.dragover = true
      }
    },
    onDrop (event) {
      this.dragover = false
      this.$refs.uploader.files = event.dataTransfer.files
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

  .uploader {
    position: relative;
    overflow: hidden;
    height: 100vh;
    @include center;
    .uploadArea {
      cursor: pointer;
      border: px2rem(1) dashed #d9d9d9;
      border-radius: px2rem(6);
      height: px2rem(270);
      width: px2rem(480);
      margin: px2rem(10);
      background: -webkit-linear-gradient(#ddd, #ddd) no-repeat, #fff;
      background-size: 0 100%;
      .icon {
        @include center;
        margin-top: px2rem(70);
        margin-bottom: px2rem(5);
        font-size: px2rem(80);
        color: #8c939d;
      }
      .text {
        @include center;
        color: #8c939d;
        font-size: px2rem(20);
      }
    }
  }
</style>