<template>
  <div class="guide">
    <transition name="slide-right">
      <div class="popup" v-show="ifPop">
        <div class="changeTag" v-for="(item, index) in menuItem" :key="index" :class="{'selected': chooseTag === index}" @click="choose(index)">
          <span :class="menuItem[index].icon"></span>
          <div class="text">{{menuItem[index].title}}</div>
        </div>
      </div>
    </transition>
    <transition name="fade">
      <div class="pop-mask" v-show="ifPop" @click="hideMenu"></div>
    </transition>
    <div class="sidebar">
      <div class="changeTag" v-for="(item, index) in menuItem" :key="index" :class="{'selected': chooseTag === index}" @click="choose(index)">
        <span :class="menuItem[index].icon"></span>
        <div class="text">{{menuItem[index].title}}</div>
      </div>
    </div>
    <div class="main-wrapper">
      <div class="topbar">
        <div class="left" @click="showMenu">
          <span class="icon-menu icon"></span>
        </div>
        <div class="title">{{menuItem[chooseTag].title}}</div>
      </div>
      <div class="main">
        <upload v-if="chooseTag === 0"/>
        <shelf v-if="chooseTag === 1"/>
        <local v-if="chooseTag === 2"/>
        <setting v-if="chooseTag === 3"/>
      </div>
    </div>
  </div>
</template>

<script>
import Shelf from './components/Shelf'
import Upload from './components/Upload'
import Setting from './components/Setting'
import Local from './components/Local'

export default {
  name: 'Guide',
  components: {Shelf, Upload, Setting, Local},
  data () {
    return {
      chooseTag: 0,
      ifPop: false,
      menuItem: [
        {title: '上传书籍', icon: 'icon-upload icon'},
        {title: '云书架', icon: 'icon-bookshelf icon'},
        {title: '本地书籍', icon: 'icon-folder icon'},
        {title: '服务器设置', icon: 'icon-setting icon'}
      ]
    }
  },
  methods: {
    choose (index) {
      this.chooseTag = index
      this.hideMenu()
    },
    hideMenu () {
      this.ifPop = false
    },
    showMenu () {
      this.ifPop = true
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "./assets/styles/global";

  .guide {
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
    .pop-mask {
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
        height: px2rem(36);
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
        height: 100vh;
        .topbar {
          display: flex;
        }
        .main {
          position: fixed;
          width: 100%;
          top: px2rem(36);
          bottom: 0;
        }
      }
    }
  }
</style>
