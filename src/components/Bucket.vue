<template>
  <div class="setting">
    <div class="toolbar">
      <div>{{$t('setting.bucket')}}</div>
    </div>
    <div class="main-wrapper">
      <div class="selectItem" v-for="item in buckets.items" :key="item.name" :class="{'selected': bucketName === item.name}" @click="selectBucket(item.name)">
        <div class="icon-wrapper">
          <span class="icon-correct icon" v-show="bucketName === item.name"></span>
        </div>
        <div class="text">{{item.name}}</div>
      </div>
      <div class="addItem">
        <input class="pix-input" v-model="newBucket.value" :type="newBucket.type">  
        <span :class="newBucket.icon" @click="addBucket(newBucket.value)"></span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Bucket',
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
      buckets: {
        action: 'icon-folder icon',
        title: this.$t('setting.bucket'),
        active: false,
        items: []
      },
      newBucket: {value: null, icon: 'icon-add icon', type: 'text'},
      bucketName: undefined,
      iconShow: 0
    }
  },
  methods: {
    selectBucket (bucketName) {
      this.client.bucketExists(bucketName, (err, exists) => {
        if (err) throw err
        if (exists) {
          this.bucketName = bucketName
          localStorage.setItem('bucketName', bucketName)
          this.$emit('bucketSelected')
        }
      })
    },
    addBucket (bucketName) {
      this.client.bucketExists(bucketName, (err, exists) => {
        if (err) throw err
        if (!exists) {
          this.client.makeBucket(bucketName, (err) => {
            if (err) throw err
            this.client.listBuckets((err, buckets) => {
              if (err) throw err
              this.buckets.items = buckets
            })
          })
        }
      })
    }
  },
  created () {
    const Minio = require('minio')
    try {
      this.server.endPoint.value = localStorage.getItem('endPoint')
      this.server.port.value = parseInt(localStorage.getItem('port'))
      this.useSSL.value = localStorage.getItem('useSSL') === 'true'
      this.server.accessKey.value = localStorage.getItem('accessKey')
      this.server.secretKey.value = localStorage.getItem('secretKey')
      this.client = new Minio.Client({
        endPoint: this.server.endPoint.value,
        port: this.server.port.value,
        useSSL: this.useSSL.value,
        accessKey: this.server.accessKey.value,
        secretKey: this.server.secretKey.value
      })
      this.client.listBuckets((err, buckets) => {
        if (err) throw err
        this.buckets.items = buckets
      })
    } catch (err) {
      throw err
    }
    try {
      this.bucketName = localStorage.getItem('bucketName')
    } catch (err) {
      throw err
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "../styles/global";
  
  .setting {
    position: relative;
    overflow: hidden;
    margin: px2rem(10);
    width: px2rem(200);
    font-size: px2rem(20);
    background: #fff;
    .toolbar {
      background: #e8eaec;
      padding: px2rem(10);
    }
    .main-wrapper {
      width: 100%;
      .selectItem {
        height: px2rem(30);
        font-size: px2rem(14);
        display: flex;
        align-items: center;
        .icon-wrapper {
          padding-left: px2rem(6);
          width: px2rem(30);
          @include center;
        }
        .text {
          padding-left: px2rem(4);
        }
      }
      .selectItem:hover {
        background: #f8f8f2;
      }
      .selected {
        background: #e8eaec;
        color: #272822;
        .icon {
          color: #272822;
        }
      }
      .addItem {
        display: flex;
        margin: px2rem(10);
        align-items: center;
        .pix-input {
          padding-left: px2rem(4);
          margin-left: px2rem(26);
          margin-right: px2rem(10);
          font-size: px2rem(14);
          height: px2rem(24);
          width: 100%;
        }
        .icon {
          cursor: pointer;
        }
      }
    }
  }
</style>
