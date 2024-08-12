<script setup lang='ts'>
  import Header from "./components/Header.vue";
  import Footer from "./components/Footer.vue";
</script>

<template>
  <Header />

  <main id="content">
    <RouterView />
  </main>

  <Footer />
</template>

<style lang="scss">
  @import "./assets/styles/index.scss";
</style>