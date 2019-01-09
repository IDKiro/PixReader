<template>
  <v-card class="setting">
    <v-toolbar flat>
      <v-toolbar-title>{{$t('setting.minio')}}</v-toolbar-title>
    </v-toolbar>
    <v-list class="main">
      <v-list-group v-model="serverPart.active" :prepend-icon="serverPart.action" append-icon="icon-down icon" no-action>
        <v-list-tile slot="activator">{{serverPart.title}}</v-list-tile>
        <v-form lazy-validation>
          <v-text-field class="setting-item" v-for="(item, index) in server" :key="index"
            v-model="server[index].value" :rules="server[index].rule" :label="server[index].name" :type="server[index].type"
            solo></v-text-field>
          <v-switch class="setting-item" color="grey darken-4" :label="useSSL.name" v-model="useSSL.value"></v-switch>
          <v-btn class="btn-group" @click="apply">
            <div v-show="iconShow === 0">{{$t('default.apply')}}</div>
            <span class="icon-correct icon" v-show="iconShow === 1"></span>
            <span class="icon-error icon" v-show="iconShow === 2"></span>
          </v-btn>
          <v-btn class="btn-group" @click="reset">{{$t('default.reset')}}</v-btn>
        </v-form>
      </v-list-group>
      <v-list-group v-if="ifBucketShow" v-model="buckets.active" :prepend-icon="buckets.action" append-icon="icon-down icon" no-action>
        <v-list-tile slot="activator">{{buckets.title}}</v-list-tile>
        <v-list-tile v-for="item in buckets.items" :key="item.name" :class="{'selected': bucketName === item.name}" 
          @click="selectBucket(item.name)">{{item.name}}</v-list-tile>
          <div class="addItem">
            <v-text-field class="text" v-model="newBucket.value" :rules="newBucket.rule" :type="newBucket.type"></v-text-field>
            <span :class="newBucket.icon" @click="addBucket(newBucket.value)"></span>
          </div>
      </v-list-group>
    </v-list>
  </v-card>
</template>

<script>
export default {
  name: 'Setting',
  data () {
    return {
      client: null,
      server: {
        endPoint: {value: null, name: this.$t('server.endPoint'), type: 'text', rule:[]},
        port: {value: null, name: this.$t('server.port'), type: 'text', rule:[]},
        accessKey: {value: null, name: this.$t('server.accessKey'), type: 'text', rule:[]},
        secretKey: {value: null, name: this.$t('server.secretKey'), type: 'password', rule:[]},
      },
      useSSL: {value: false, name: this.$t('server.useSSL'), rule:[]},
      serverPart: {
        action: 'icon-server icon',
        title: this.$t('setting.server'),
        active: true,
        items: []
      },
      buckets: {
        action: 'icon-folder icon',
        title: this.$t('setting.bucket'),
        active: false,
        items: []
      },
      newBucket: {value: null, icon: 'icon-add icon', type: 'text', rule:[]},
      bucketName: undefined,
      ifBucketShow: false,
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
        this.client.listBuckets((err, buckets) => {
          if (err) throw err
          this.buckets.items = buckets
        })
        this.ifBucketShow = true
        this.buckets.active = true
        this.serverPart.active = false
        this.iconShow = 1
        localStorage.setItem('endPoint', this.server.endPoint.value)
        localStorage.setItem('port', this.server.port.value)
        localStorage.setItem('useSSL', this.useSSL.value)
        localStorage.setItem('accessKey', this.server.accessKey.value)
        localStorage.setItem('secretKey', this.server.secretKey.value)
      } catch (err) {
        this.iconShow = 2
      }
    },
    reset () {
      this.client = null
      this.buckets.items = []
      this.ifBucketShow = false
      this.buckets.active = false
      this.serverPart.active = true
      this.iconShow = 0
      this.server.endPoint.value = null
      this.server.port.value = null
      this.useSSL.value = false
      this.server.accessKey.value = null
      this.server.secretKey.value = null
    },
    selectBucket (bucketName) {
      this.client.bucketExists(bucketName, (err, exists) => {
        if (err) throw err
        if (exists) {
          this.bucketName = bucketName
          localStorage.setItem('bucketName', bucketName)
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
  mounted () {
    this.server.endPoint.value = localStorage.getItem('endPoint')
    this.server.port.value = localStorage.getItem('port')
    this.useSSL.value = localStorage.getItem('useSSL') === "true" ? true : false
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
    .main {
      width: 100%;
      .setting-item {
        padding: 0 px2rem(10);
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;
        font-size: px2rem(14);
      }
      .btn-group {
        margin: 4%;
        width: 42%;
        height: px2rem(36);
        font-size: px2rem(14);
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
        margin-top: px2rem(10);
        margin-left: px2rem(50);
        margin-right: px2rem(14);
        margin-bottom: - px2rem(10);
        .text {
          margin-right: px2rem(14);
          font-size: px2rem(14);
        }
        .icon {
          cursor: pointer;
        }
      }
    }
  }
</style>
