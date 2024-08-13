<script setup lang="ts">
import { ref } from 'vue';

const hovered = ref(false);

const imgStandard = '/images/deco-logo.png';
const imgHover = '/images/deco-logo-hover.png';
</script>

<template>
  <header class="grid">
    <div id="logo">
      <a href="/" @mouseover="hovered = true" @mouseleave="hovered = false">
        <img alt="cocktailist" :src="hovered ? imgHover : imgStandard" />
      </a>
    </div>
    <nav>
      <li><router-link to="/">Cocktails</router-link></li>
      <li><router-link to="/feed">Activity</router-link></li>
      <li><router-link to="/lists/1">Lists</router-link></li>
      <li><router-link to="/data">Data</router-link></li>
      <li><router-link to="/login">Login</router-link></li>
    </nav>
  </header>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/header.scss';
</style>
