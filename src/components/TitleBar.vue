<template>
  <transition name="slide-down">
    <div class="title-wrapper" v-show="ifTitleAndMenuShow">
      <div class="left">
        <div class="icon-wrapper" @click="back">
          <span class="icon-arrow-left icon"></span>
        </div>
      </div>
      <div class="right" v-if="bookAvailable">
        <div class="icon-wrapper" v-if="!ifBookMarked" @click="addBookmark">
          <span class="icon-bookmark icon"></span>
        </div>
        <div class="icon-wrapper" v-else @click="removeBookmark">
          <span class="icon-bookmark-on icon"></span>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'TitleBar',
  methods: {
    back () {
      this.$store.commit('setTitleAndMenuShow', false)
      this.$store.commit('setShowBook', false)
    },
    addBookmark () {
      this.$emit('addBookmark')
    },
    removeBookmark () {
      this.$emit('removeBookmark')
    }
  },
  computed: {
    ifTitleAndMenuShow () {
      return this.$store.state.ifTitleAndMenuShow
    },
    ifBookMarked () {
      return this.$store.state.ifBookMarked
    },
    bookAvailable () {
      return this.$store.state.bookAvailable
    }
  }
}
</script>

<style lang='scss' scoped>
  @import "../styles/global";

  .title-wrapper {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: px2rem(48);
    z-index: 101;
    display: flex;
    background: #fff;
    box-shadow: 0 px2rem(8) px2rem(8) rgba(0, 0, 0, .15);
    &.hideBoxShadow {
      box-shadow: none;
    }
    .left {
      display: flex;
      flex: 0 0 px2rem(60);
      @include center;
      .icon-wrapper {
        cursor: pointer;
        flex: 0 0 px2rem(40);
        @include center;
      }
    }
    .right {
      display: flex;
      flex: 1;
      justify-content: flex-end;
      .icon-wrapper {
        cursor: pointer;
        flex: 0 0 px2rem(40);
        @include center;
      }
    }
    &.slide-down-enter, &.slide-down-leave-to {
      transform: translate3d(0, -100%, 0);
    }
    &.slide-down-enter-to, &.slide-down-leave {
      transform: translate3d(0, 0, 0);
    }
    &.slide-down-enter-active, &.slide-down-leave-active {
      transition: all .3s linear;
    }
  }
</style>
