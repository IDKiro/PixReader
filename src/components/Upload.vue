<template>
  <div class="uploader">
    <label
      class="uploadArea"
      ref="uploadArea"
      for="uploadfile"
      @drop.prevent="onDrop"
      @dragover.prevent="onDragover"
      @dragleave.prevent="dragover = false"
    >
      <span class="icon-upload icon" />
      <div class="text">
        {{ $t('default.uploadMessage') }}
      </div>
    </label>
    <input
      id="uploadfile"
      name="file"
      ref="uploader"
      type="file"
      multiple="multiple"
      accept="application/epub+zip"
      v-show="false"
      @change="upload"
    >
  </div>
</template>

<script>
import Epub from 'epubjs'
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
      let fileList = []
      for (let i = 0; i < fileObj.length; i++) {
        fileList.push(fileObj[i])
      }
      this.uploadLoop(fileList)
    },
    uploadLoop (fileList) {
      let file = fileList.shift()
      this.client.presignedPutObject(this.bucketName(), file.name, (err, url) => {
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
            this.loadCover(file)
            this.UploadSuccess(file)
            if (fileList.length) {
              this.uploadLoop(fileList)
            } else {
              this.$emit('uploaded')
            }
          }
        }
      })
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
    loadCover (file) {
      let reader = new FileReader()
      reader.onload = () => {
        let arr = (new Uint8Array(reader.result)).subarray(0, 2)
        let header = ''
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16)
        }
        if (header === '504b') {
          let book = new Epub(reader.result, {encoding: 'binary'})
          book.ready.then(() => {
            book.loaded.metadata.then(() => {
              book.archive.getBase64(book.cover).then(value => {
                const localForage = require('localforage')
                localForage.setItem(file.name + 'cover', value)
              })
            })
          })
        }
      }
      if (file) {
        reader.readAsArrayBuffer(file)
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
    },
    bucketName () {
      return localStorage.getItem('bucketName')
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
      return localStorage.getItem('useSSL') === 'true'
    },
    accessKey () {
      return localStorage.getItem('accessKey')
    },
    secretKey () {
      return localStorage.getItem('secretKey')
    }
  },
  mounted () {
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
  @import "../styles/global";

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
        color: #515a6e;
      }
      .text {
        @include center;
        color: #515a6e;
        font-size: px2rem(20);
      }
    }
  }
</style>
