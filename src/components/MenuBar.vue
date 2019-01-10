<template>
  <div ref="menubar">
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
          <span class="icon-brightness icon"></span>
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
          <div class="select-wrapper">
            <input type="range" class="select" :min="fontSizeList[0].fontSize" :max="fontSizeList[fontSizeList.length - 1].fontSize" step="2"
                    @change="setFontSize($event.target.value)"
                    :value="currentFontSize"
                    :disabled="!$store.state.bookAvailable">
          </div>
          <div class="preview" :style="{fontSize: fontSizeList[fontSizeList.length - 1].fontSize + 'px'}">A</div>
        </div>
        <div class="setting-theme" v-else-if="showTag === 1">
          <div class="setting-theme-item" v-for="(item, index) in themeList" :key="index" @click="setTheme(index)">
            <div class="preview" :style="{background: item.style.body.background}" :class="{'no-border': item.style.body.background !=='#fff'}"></div>
            <div class="text" :class="{'selected': index === defaultTheme}">{{item.name}}</div>
          </div>
        </div>
        <div class="setting-progress" v-else-if="showTag === 2">
          <div class="progress-wrapper">
            <input type="range" class="progress" max="100" min="0" step="1"
                    @change="onProgressChange($event.target.value)"
                    @input="onProgressInput($event.target.value)"
                    :value="progress"
                    :disabled="!$store.state.bookAvailable"
                    ref="progress">
          </div>
          <div class="text-wrapper">
            <span>{{bookAvailable ? progress + '%' : $t('default.loading')}}</span>
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
      lineHalfLength: (document.body.clientWidth - 160 / 3) / 14,
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
    onProgressChange (progress) {
      this.$emit('onProgressChange', progress)
    },
    onProgressInput (progress) {
      this.progress = progress
      this.$refs.progress.style.backgroundSize = `${this.progress}% 100%`
    },
    jumpTo (target) {
      this.$emit('jumpTo', target)
    },
    turnMarkPage (index) {
      this.$emit('turnMarkPage', index)
    }
  },
  watch: {
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
      .select-wrapper {
        display: flex;
        flex: 1;
        @include center;
        .select {
          width: 100%;
          height: px2rem(2);
          -webkit-appearance: none;
          background: #ddd;
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            cursor: pointer;
            -webkit-appearance: none;
            height:px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: #fff;
            border: px2rem(1) solid #ccc;
            box-shadow: 0 px2rem(3) px2rem(3) rgba(0, 0, 0, .15);
          }
        }
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
          color: #8c939d;
          @include center;
          &.selected {
            color: #515a6e;
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
      .progress-wrapper {
        width: 100%;
        height: px2rem(40);
        padding: 0 px2rem(30);
        box-sizing: border-box;
        @include center;
        .progress {
          width: 100%;
          height: px2rem(2);
          -webkit-appearance: none;
          background: -webkit-linear-gradient(#999, #999) no-repeat, #ddd;
          background-size: 0 100%;
          &:focus {
            outline: none;
          }
          &::-webkit-slider-thumb {
            cursor: pointer;
            -webkit-appearance: none;
            height:px2rem(20);
            width: px2rem(20);
            border-radius: 50%;
            background: #fff;
            border: px2rem(1) solid #ccc;
            box-shadow: 0 px2rem(3) px2rem(3) rgba(0, 0, 0, .15);
          }
        }
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
