<script setup lang='ts'>
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";

</script>

<template>
  <div id="app">
    <Header />

    <main id="content">
      <router-view />
    </main>

    <Footer />
  </div>
</template>

<style lang="scss">
@import "./assets/styles/index.scss";
</style>