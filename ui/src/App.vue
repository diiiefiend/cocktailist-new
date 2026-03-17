<script setup lang="ts">
import SiteHeader from './components/SiteHeader.vue';
import SiteFooter from './components/SiteFooter.vue';
</script>

<template>
  <site-header />

  <main id="content">
    <router-view :key="$route.path" />
  </main>

  <site-footer />
</template>

<style lang="scss">
@import './assets/styles/index.scss';
</style>
