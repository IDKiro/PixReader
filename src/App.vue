<template>
  <div id="app">
    <ebook v-if="ifShowBook" />
    <guide v-show="!ifShowBook" />
  </div>
</template>

<script>
import Guide from './Guide'
import Ebook from './Ebook'

export default {
  name: 'App',
  components: {Guide, Ebook},
  computed: {
    ifShowBook () {
      return this.$store.state.ifShowBook
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const html = document.querySelector('html')
  let fontSize = window.innerWidth / 10
  fontSize = fontSize > 48 ? 48 : fontSize
  html.style.fontSize = fontSize + 'px'
})
</script>

<style>
  #app {
  }
</style>
