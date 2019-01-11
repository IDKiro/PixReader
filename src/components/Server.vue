<template>
  <div class="setting">
    <div class="toolbar">
      <div>{{$t('setting.server')}}</div>
    </div>
    <div class="main-wrapper">
      <div class="main">
        <input class="input" v-for="(item, index) in server" :key="index" 
          v-model="server[index].value" :placeholder="server[index].name" :type="server[index].type">  
        <div class="switch-wrapper">
          <div class="switch-container">
            <input id="switch" type="checkbox" class="switch" v-model="useSSL.value"/>
            <label for="switch" class="label" @click="changeSSL"></label>
          </div>
          <label>{{useSSL.name}}</label>  
        </div>
        <div class="btn-group">
          <button class="btn" @click="apply">
            <div v-show="iconShow === 0">{{$t('default.apply')}}</div>
            <span class="icon-correct icon" v-show="iconShow === 1"></span>
            <span class="icon-error icon" v-show="iconShow === 2"></span>
          </button>
          <button class="btn" @click="reset">{{$t('default.reset')}}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Server',
  data () {
    return {
      client: null,
      server: {
        endPoint: {value: null, name: this.$t('server.endPoint'), type: 'text'},
        port: {value: null, name: this.$t('server.port'), type: 'text'},
        accessKey: {value: null, name: this.$t('server.accessKey'), type: 'text'},
        secretKey: {value: null, name: this.$t('server.secretKey'), type: 'password'}
      },
      useSSL: {value: false, name: this.$t('server.useSSL')},
      iconShow: 0
    }
  },
  methods: {
    apply () {
      const Minio = require('minio')
      try {
        this.client = new Minio.Client({
          endPoint: this.server.endPoint.value,
          port: parseInt(this.server.port.value),
          useSSL: this.useSSL.value,
          accessKey: this.server.accessKey.value,
          secretKey: this.server.secretKey.value
        })
        this.iconShow = 1
        localStorage.setItem('endPoint', this.server.endPoint.value)
        localStorage.setItem('port', this.server.port.value)
        localStorage.setItem('useSSL', this.useSSL.value)
        localStorage.setItem('accessKey', this.server.accessKey.value)
        localStorage.setItem('secretKey', this.server.secretKey.value)
      } catch (err) {
        this.iconShow = 2
        throw err
      }
    },
    reset () {
      this.client = null
      this.iconShow = 0
      this.server.endPoint.value = null
      this.server.port.value = null
      this.useSSL.value = false
      this.server.accessKey.value = null
      this.server.secretKey.value = null
    },
    changeSSL () {
      this.useSSL.value = !this.useSSL.value
    }
  },
  mounted () {
    this.server.endPoint.value = localStorage.getItem('endPoint')
    this.server.port.value = localStorage.getItem('port')
    this.useSSL.value = localStorage.getItem('useSSL') === 'true'
    this.server.accessKey.value = localStorage.getItem('accessKey')
    this.server.secretKey.value = localStorage.getItem('secretKey')
  }
}
</script>

<style lang='scss' scoped>
  @import "../assets/styles/global";
  
  .setting {
    position: relative;
    overflow: hidden;
    margin: px2rem(10);
    width: px2rem(240);
    font-size: px2rem(20);
    background: #fff;
    .toolbar {
      background: #e8eaec;
      padding: px2rem(10);
    }
    .main-wrapper {
      width: 100%;
      .title {
        display: flex;
        flex-wrap: wrap;
        height: px2rem(30);
        width: 100%;
        font-size: px2rem(14);
        align-items: center;
        border-bottom: px2rem(1) solid #d9d9d9;
        .right {
          position: absolute;
          right: 0;
        }
      }
      .main {
        padding: px2rem(10);
        .input {
          font-size: px2rem(14);
          margin: px2rem(6) 0;
          padding: 0 px2rem(6);
          height: px2rem(32);
          width: 100%;
          border: px2rem(1) solid #ccc;
          border-radius: px2rem(3);
          -webkit-box-shadow: inset 0 px2rem(1) px2rem(1) rgba(0,0,0,.075);
          box-shadow: inset 0 px2rem(1) px2rem(1) rgba(0,0,0,.075);
          -webkit-transition: border-color ease-in-out .15s,-webkit-box-shadow ease-in-out .15s;
          -o-transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s;
          transition: border-color ease-in-out .15s,box-shadow ease-in-out .15s
        }
        .switch-wrapper {
          display: flex;
          flex-wrap: wrap;
          height: px2rem(24);
          font-size: px2rem(14);
          align-items: center;
          .switch-container {
            height: px2rem(15);
            width: px2rem(30);
            margin: 0 px2rem(6);
            .switch {
              display: none;
            }
            .label {
              display: block;
              background-color: #ccc;
              height: 100%;
              width: 100%;
              cursor: pointer;
              border-radius: px2rem(25);
            }
            .label:before {
              content: '';
              display: block;
              border-radius: px2rem(25);
              height: 100%;
              width: px2rem(15);
              background-color: #fff;
              opacity: 1;
              box-shadow: px2rem(1) px2rem(1) px2rem(1) px2rem(1) rgba(0, 0, 0, 0.15);
              -webkit-transition: all 0.2s ease;
            }
            .label:after {
              position: relative;
              top: - px2rem(15);
              left: px2rem(15);
              content: '';
              display: block;
              border-radius: px2rem(25);
              height: 100%;
              width: px2rem(15);
              background-color: #fff;
              opacity: 0;
              box-shadow: px2rem(1) px2rem(1) px2rem(1) px2rem(1) rgba(0, 0, 0, 0.15);
              -webkit-transition: all 0.2s ease;
            }
            #switch:checked~.label:after {
              opacity: 1;
            }
            #switch:checked~.label:before {
              opacity: 0;
            }
            #switch:checked~.label {
              background-color: #515a6e;
            }
          }
        }
        .btn-group {
          @include center;
          .btn {
            margin: 2%;
            width: 46%;
            height: px2rem(36);
            font-size: px2rem(14);
            color: rgba(0, 0, 0, 0.80);
            border: none rgba(0, 0, 0, 0);
            background-color: #e8eaec;
            text-decoration: none;
            border-radius: px2rem(2);
          }
          .btn:hover,
          .btn:focus {
            background-image: linear-gradient(transparent, rgba(0,0,0, 0.05) 40%, rgba(0,0,0, 0.10));
          }
          .btn:focus {
            outline: 0;
          }
          .btn:active {
            box-shadow: 0 0 0 px2rem(1) rgba(0,0,0, 0.15) inset, 0 0 px2rem(6) rgba(0,0,0, 0.20) inset;
            border-color: #000;
          }
        }
      }
    }
  }
</style>
