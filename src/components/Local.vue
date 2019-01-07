<template>
  <div class="localFile">
    <label class="localFileArea"
      ref="localFileArea"
      for="openfile"
      @drop.prevent="onDrop"
      @dragover.prevent="onDragover"
      @dragleave.prevent="dragover = false">
      <span class="icon-folder icon"></span>
      <div class="text">{{$t('default.localMessage')}}</div>
    </label>
    <input id="openfile" name="file" ref="localFile" type="file" accept="application/epub+zip" v-show="false" @change="open"/>
  </div>
</template>

<script>
export default {
  name: 'Local',
  data () {
    return {
      client: null,
      dragover: false,
      progress: 0
    }
  },
  methods: {
    open () {
      let fileObj = this.$refs.localFile.files
      let file = fileObj[0]
      let reader = new FileReader()
      reader.addEventListener('load', () => {
        let arr = (new Uint8Array(reader.result)).subarray(0, 2)
        let header = ''
        for (let i = 0; i < arr.length; i++) {
          header += arr[i].toString(16)
        }
        if (header === '504b') {
          localStorage.setItem('defaultBookName', file.name)
          this.$store.commit('setShowBook', true)
          this.$store.commit('setLocalUrl', reader.result)
        }
      }, false)
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
      this.$refs.localFile.files = event.dataTransfer.files
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "../assets/styles/global";

  .localFile {
    position: relative;
    overflow: hidden;
    height: 100vh;
    @include center;
    .localFileArea {
      cursor: pointer;
      margin: px2rem(10);
      border: px2rem(1) dashed #d9d9d9;
      border-radius: px2rem(6);
      height: px2rem(270);
      width: px2rem(480);
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
