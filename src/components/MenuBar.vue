<template>
  <div class="menu-bar">
    <transition name="slide-up">
      <div class="menu-wrapper" :class="{'hideBoxShadow': ifSettingShow || !ifTitleAndMenuShow}"
           v-show="ifTitleAndMenuShow">
        <div class="icon-wrapper" @click="showSetting(3)">
          <span class="icon-contents icon"></span>
        </div>
        <div class="icon-wrapper" @click="showSetting(2)">
          <span class="icon-Progress-read icon"></span>
        </div>
        <div class="icon-wrapper" @click="showSetting(1)">
          <span class="icon-brightness-contrast icon"></span>
        </div>
        <div class="icon-wrapper" @click="showSetting(0)">
          <span class="icon">A</span>
        </div>
      </div>
    </transition>
    <transition name="slide-up">
      <div class="setting-wrapper" v-show="ifSettingShow">
        <div class="setting-font-size" v-if="showTag === 0">
          <div class="preview" :style="{fontSize: fontSizeList[0].fontSize + 'px'}">A</div>
          <el-slider class="select"
                     :style="{fontSize: '.5rem', padding: '.4rem .15rem'}"
                     :min="12"
                     :max="24"
                     :step="2"
                     v-model="currentFontSize"
                     :show-tooltip="false"
                     @change="setFontSize(currentFontSize)"
                     show-stops>
          </el-slider>
          <div class="preview" :style="{fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px'}">A</div>
        </div>
        <div class="setting-theme" v-else-if="showTag === 1">
          <div class="setting-theme-item" v-for="(item, index) in themeList" :key="index" @click="setTheme(index)">
            <div class="preview" :style="{background: item.style.body.background}" :class="{'no-border': item.style.body.background !=='#fff'}"></div>
            <div class="text" :class="{'selected': index === defaultTheme}">{{item.name}}</div>
          </div>
        </div>
        <div class="setting-progress" v-else-if="showTag === 2">
          <el-slider v-model="progress"
                     :style="{fontSize: '.5rem', padding: '.1rem 1rem'}"
                     :show-tooltip="false"
                     @change="onProgressChange"></el-slider>
          <div class="text-wrapper">
            <span>{{bookAvailable ? progress + '%' : '加载中...'}}</span>
          </div>
        </div>
      </div>
    </transition>
    <content-view :if-show-content="ifContentShow"
                  v-show="ifContentShow"
                  @jumpTo="jumpTo"
                  @turnMarkPage="turnMarkPage"></content-view>
    <transition name="fade">
      <div class="content-mask" v-show="ifContentShow" @click="hideContent"></div>
    </transition>
  </div>
</template>

<script>
import ContentView from './Content'
export default {
  name: 'MenuBar',
  components: {ContentView},
  props: {
    themeList: Array,
    fontSizeList: Array
  },
  data () {
    return {
      ifSettingShow: false,
      ifContentShow: false,
      showTag: 0,
      progress: 0,
      currentFontSize: 16
    }
  },
  methods: {
    showSetting (tag) {
      if (tag === 3) {
        this.ifSettingShow = false
        this.ifContentShow = true
      } else {
        this.ifSettingShow = true
      }
      if (tag === 2 && this.bookAvailable) {
        this.$emit('getCurrentLocation')
      }
      this.showTag = tag
    },
    hideSetting () {
      this.ifSettingShow = false
    },
    hideContent () {
      this.ifContentShow = false
    },
    setFontSize (fontSize) {
      this.$emit('setFontSize', fontSize)
    },
    setTheme (index) {
      this.$emit('setTheme', index)
    },
    onProgressChange () {
      this.$emit('onProgressChange', this.progress)
    },
    jumpTo (target) {
      this.$emit('jumpTo', target)
    },
    turnMarkPage (index) {
      this.$emit('turnMarkPage', index)
    }
  },
  watch: {
    // 监听电子书的页码变化
    bookCurrentLocation () {
      this.progress = Math.round(this.bookCurrentLocation)
    }
  },
  computed: {
    bookCurrentLocation () {
      return this.$store.state.bookCurrentLocation
    },
    bookAvailable () {
      return this.$store.state.bookAvailable
    },
    ifTitleAndMenuShow () {
      return this.$store.state.ifTitleAndMenuShow
    },
    defaultFontSize () {
      return this.$store.state.defaultFontSize
    },
    defaultTheme () {
      return this.$store.state.defaultTheme
    }
  },
  mounted () {
    // 将字体选择滑块的数据与 state 中的数据进行同步，否则每次进入阅读滑块都会回到初始设定位置
    // TODO: 直接在阅读界面进行刷新后，滑块会回到初始设定位置但字体设置正常
    this.currentFontSize = this.defaultFontSize
  }
}
</script>

<style lang='scss' scoped>
  @import "../assets/styles/global";

  .menu-wrapper {
    display: flex;
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: px2rem(48);
    z-index: 101;
    background: #fff;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    &.hideBoxShadow {
      box-shadow: none
    }
    .icon-wrapper {
      cursor: pointer;
      flex: 1;
      @include center;
      .icon-Progress-read {
        font-size: px2rem(24);
      }
    }
    &.slide-up-enter, &.slide-up-leave-to {
      transform: translate3d(0, 100%, 0);
    }
    &.slide-up-enter-to, &.slide-up-leave {
      transform: translate3d(0, 0, 0);
    }
    &.slide-up-enter-active, &.slide-up-leave-active {
      transition: all .3s linear;
    }
  }
  .setting-wrapper {
    display: flex;
    position: absolute;
    bottom: px2rem(48);
    left: 0;
    width: 100%;
    height: px2rem(60);
    z-index: 100;
    background: #fff;
    box-shadow: 0 px2rem(-8) px2rem(8) rgba(0, 0, 0, .15);
    .icon-wrapper {
      cursor: pointer;
      flex: 1;
      @include center;
    }
    &.slide-up-enter, &.slide-up-leave-to {
      transform: translate3d(0, px2rem(108), 0);
    }
    &.slide-up-enter-to, &.slide-up-leave {
      transform: translate3d(0, 0, 0);
    }
    &.slide-up-enter-active, &.slide-up-leave-active {
      transition: all .3s linear;
    }
    .setting-font-size {
      display: flex;
      width: 100%;
      height: 100%;
      .preview {
        flex: 0 0 px2rem(40);
        @include center;
      }
      .select {
        display: flex;
        flex: 1;
      }
    }
    .setting-theme {
      display: flex;
      width: 100%;
      height: 100%;
      .setting-theme-item {
        cursor: pointer;
        display: flex;
        flex: 1;
        flex-direction: column;
        padding: px2rem(5);
        box-sizing: border-box;
        .preview {
          flex: 1;
          border: px2rem(1) solid gainsboro;
          box-sizing: border-box;
          &.no-border {
            border: none;
          }
        }
        .text {
          flex: 0 0 px2rem(20);
          font-size: px2rem(14);
          color: #ccc;
          @include center;
          &.selected {
            color: #555555;
          }
        }
      }
    }
    .setting-progress {
      position: relative;
      width: 100%;
      height: 100%;
      .text-wrapper {
        @include center;
        height: px2rem(20);
        font-size: px2rem(12);
      }
    }
  }
  .content-mask {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    z-index: 101;
    display: flex;
    background: rgba(51, 51, 51, .8);
    &.fade-enter, &.fade-leave-to {
      opacity: 0;
    }
    &.fade-enter-to, &.fade-leave {
      opacity: 1;
    }
    &.fade-enter-active, &.fade-leave-active {
      transition: all .3s;
    }
  }
</style>
