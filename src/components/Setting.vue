<template>
  <div class="setting-wrapper">
    <div class="setting">
      <div class="setting-item" v-for="(item, index) in server" :key="index">
        <label>{{server[index].name}}</label>
        <input type="text" v-model="server[index].value" :placeholder="placer[index]">
      </div>
      <button class="accept" type="button" @click="apply">
        <div v-show="iconShow === 0">确定</div>
        <span class="icon-correct icon" v-show="iconShow === 1"></span>
        <span class="icon-error icon" v-show="iconShow === 2"></span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  data () {
    return {
      server: {
        endPoint: {value: null, name: '服务器地址'},
        port: {value: null, name: '端口'},
        accessKey: {value: null, name: 'Access Key'},
        secretKey: {value: null, name: 'Secret Key'},
        bucketName: {value: null, name: 'Bucket Name'}
      },
      iconShow: 0
    }
  },
  methods: {
    apply () {
      const Minio = require('minio')
      try {
        let client = new Minio.Client({
          endPoint: this.server.endPoint.value,
          port: this.server.port.value,
          useSSL: false,
          accessKey: this.server.accessKey.value,
          secretKey: this.server.secretKey.value
        })
        client.bucketExists(this.server.bucketName.value, (err, exists) => {
          if (err) {
            this.iconShow = 2
          }
          if (exists) {
            this.iconShow = 1
            localStorage.setItem('endPoint', this.server.endPoint.value)
            localStorage.setItem('port', this.server.port.value)
            localStorage.setItem('accessKey', this.server.accessKey.value)
            localStorage.setItem('secretKey', this.server.secretKey.value)
            localStorage.setItem('bucketName', this.server.bucketName.value)
          }
        })
      } catch (err) {
        this.iconShow = 2
      }
    }
  },
  computed: {
    placer () {
      return {
        endPoint: '127.0.0.1',
        port: '9000',
        accessKey: 'myserver',
        secretKey: '12345678',
        bucketName: 'books'
      }
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "../assets/styles/global";
  .setting-wrapper {
    height: 100vh;
    @include center;
    .setting {
      position: relative;
      overflow: hidden;
      margin: px2rem(10);
      border: px2rem(1) dashed #d9d9d9;
      border-radius: px2rem(4);
      width: px2rem(360);
      .setting-item {
        padding: px2rem(10);
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        label {
          font-size: px2rem(16);
          padding: px2rem(5) 0;
          margin-right: px2rem(10);
        }
        input {
          font-size: px2rem(12);
          display: block;
          flex: 0 1 px2rem(200);
          outline: 0;
          padding: px2rem(5);
          border: px2rem(1) solid #ccc;
          box-shadow: inset 0 px2rem(1) px2rem(3) #ddd;
          border-radius: px2rem(4);
        }
        input:focus {
          outline: 0;
          border-color: #555555;
        }
      }
      button {
        margin: 3%;
        width: 94%;
        height: px2rem(40);
        font-size: px2rem(16);
        font-family: inherit;
        padding: 0.5em 1em;
        color: #444;
        color: rgba(0, 0, 0, 0.80);
        border: px2rem(1) solid #999;
        border: none rgba(0, 0, 0, 0);
        background-color: #E6E6E6;
        text-decoration: none;
        border-radius: px2rem(2);
      }
      button:hover,
      button:focus {
          background-image: linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10));
      }
      button:focus {
          outline: 0;
      }
      button:active {
          box-shadow: 0 0 0 px2rem(1) rgba(0,0,0, 0.15) inset, 0 0 px2rem(6) rgba(0,0,0, 0.20) inset;
          border-color: #000;
      }
    }
  }
</style>
