<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
// 动态调整根节点字体
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
