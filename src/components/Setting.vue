<template>
  <div class="setting-wrapper">
    <div class="setting">
      <v-form ref="form" lazy-validation>
        <v-text-field class="setting-item" v-for="(item, index) in server" :key="index" v-model="server[index].value" :rules="server[index].rule" :label="server[index].name" solo required></v-text-field>
        <v-btn @click="apply">
          <div v-show="iconShow === 0">{{$t("default.apply")}}</div>
          <span class="icon-correct icon" v-show="iconShow === 1"></span>
          <span class="icon-error icon" v-show="iconShow === 2"></span>
        </v-btn>
      </v-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Setting',
  data () {
    return {
      server: {
        endPoint: {value: null, name: this.$t("server.endPoint"), rule:[]},
        port: {value: null, name: this.$t("server.port"), rule:[]},
        accessKey: {value: null, name: this.$t("server.accessKey"), rule:[]},
        secretKey: {value: null, name: this.$t("server.secretKey"), rule:[]},
        bucketName: {value: null, name: this.$t("server.bucketName"), rule:[]}
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
      }
      button {
        margin: 3%;
        width: 94%;
        height: px2rem(36);
        font-size: px2rem(16);
      }
    }
  }
</style>
