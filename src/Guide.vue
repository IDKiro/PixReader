<template>
  <div class="guide">
    <div class="setting-wrapper" v-if="ifSettingShow">
      <minio @bucketSelected="bucketSelected" class="setting"/>
    </div>
    <transition name="slide-right">
      <div class="popup" v-show="ifPop">
        <div class="changeTag" v-for="(item, index) in menuItem" :key="index" :class="{'selected': chooseTag === index}" @click="choose(index)">
          <span :class="menuItem[index].icon"></span>
          <div class="text">{{menuItem[index].title}}</div>
        </div>
        <button class="setting-btn" @click="showSetting">
          <span :class="serverSetting.icon"></span>
        </button>
      </div>
    </transition>
    <transition name="fade">
      <div class="mask" v-show="ifMask" @click="hideMenu"></div>
    </transition>
    <div class="sidebar">
      <div class="changeTag" v-for="(item, index) in menuItem" :key="index" :class="{'selected': chooseTag === index}" @click="choose(index)">
        <span :class="menuItem[index].icon"></span>
        <div class="text">{{menuItem[index].title}}</div>
      </div>
      <button class="setting-btn" @click="showSetting">
        <span :class="serverSetting.icon"></span>
      </button>
    </div>
    <div class="main-wrapper">
      <div class="topbar">
        <div class="left" @click="showMenu">
          <span class="icon-menu icon"></span>
        </div>
        <div class="title">{{menuItem[chooseTag].title}}</div>
      </div>   
      <div class="main">
        <local v-if="chooseTag === 0"/>
        <upload v-if="chooseTag === 1"/>
        <vue-scroll>
          <shelf v-if="chooseTag === 2" ref="shelf"/>
        </vue-scroll>
      </div>   
    </div>
  </div>
</template>

<script>
import Shelf from './components/Shelf'
import Upload from './components/Upload'
import Minio from './components/Minio'
import Local from './components/Local'

export default {
  name: 'Guide',
  components: {Shelf, Upload, Minio, Local},
  data () {
    return {
      chooseTag: 0,
      ifPop: false,
      ifMask: false,
      ifSettingShow: false,
      menuItem: [
        {title: this.$t('menu.folder'), icon: 'icon-folder icon'},
        {title: this.$t('menu.upload'), icon: 'icon-upload icon'},
        {title: this.$t('menu.shelf'), icon: 'icon-bookshelf icon'}
      ],
      serverSetting: {title: this.$t('menu.setting'), icon: 'icon-server icon'}
    }
  },
  methods: {
    choose (index) {
      this.chooseTag = index
      this.hideMenu()
    },
    hideMenu () {
      this.ifMask = false
      this.ifPop = false
      this.ifSettingShow = false
    },
    showMenu () {
      this.ifMask = true
      this.ifPop = true
      this.ifSettingShow = false
    },
    showSetting () {
      this.ifMask = true
      this.ifPop = false
      this.ifSettingShow = true
    },
    bucketSelected () {
      this.hideMenu()
      // this.$refs.shelf.syncBook()
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "./assets/styles/global";

  .guide {
    .setting-wrapper {
      height: 100%;
      width: 100%;
      position: absolute;
      @include center;
      .setting {
        border-radius: px2rem(6);
        z-index: 4;
      }
    }
    .sidebar, .popup {
      height: 100vh;
      width: px2rem(200);
      background: #fff;
      box-shadow: px2rem(3) 0 px2rem(3) rgba(0, 0, 0, .25);
      .changeTag {
        cursor: pointer;
        display: flex;
        align-items: center;
        height: px2rem(48);
        color: #515a6e;
        &.selected {
          background: #e8eaec;
          color: #272822;
          .icon {
            color: #272822;
          }
        }
        .icon {
          font-size: px2rem(24);
          padding: 0 px2rem(10) 0 px2rem(20);
        }
        .text {
          font-size: px2rem(18);
        }
      }
      .setting-btn {
        position: absolute;
        bottom: 0;
        left: 0;
        height: px2rem(40);
        width: px2rem(40);
        border: none;
        border-radius: 50%;
        @include center;
      }
      .setting-btn:hover, .setting-btn:active  {
        background: #e8eaec;
      }
      .changeTag:hover {
        color: #272822;
        .icon {
          color: #272822;
        }
      }
    }
    .popup {
      position: absolute;
      z-index: 3;
      &.slide-right-enter, &.slide-right-leave-to {
        transform: translate3d(-100%, 0, 0);
      }
      &.slide-right-enter-to, &.slide-right-leave {
        transform: translate3d(0, 0, 0);
      }
      &.slide-right-enter-active, &.slide-right-leave-active {
        transition: all .3s linear;
      }
    }
    .mask {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
      width: 100%;
      z-index: 2;
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
    .main-wrapper {
      overflow: auto;
      height: 100vh;
      margin-top: -100vh;
      margin-left: px2rem(200);
      .topbar {
        display: none;
        z-index: 1;
        height: px2rem(48);
        width: 100%;
        background: #fff;
        box-shadow: 0 px2rem(3) px2rem(3) rgba(0, 0, 0, .25);
        .left {
          @include center;
          cursor: pointer;
          padding: 0 px2rem(10);
        }
        .title {
          @include center;
          font-size: px2rem(18);
          padding: 0 px2rem(10);
        }
      }
      .main {
        position: fixed;
        left: px2rem(200);
        right: 0;
        top: 0;
        bottom: 0;
      }
    }
  }
  @media screen and (max-width: 960px) {
    .guide {
      .sidebar {
        display: none;
      }
      .main-wrapper {
        margin-top: 0;
        margin-left: 0;
        .topbar {
          display: flex;
        }
        .main {
          left: 0;
          top: px2rem(48);
        }
      }
    }
  }
</style>
