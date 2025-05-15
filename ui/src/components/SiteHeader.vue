<script setup lang="ts">
import { ref } from 'vue';
import { MutationType } from 'pinia';

import { useAuthStore } from '../stores/auth';

const hovered = ref(false);
const authStore = useAuthStore();
let isUserLoggedIn = ref(authStore.isUserLoggedIn);

const imgStandard = '/images/deco-logo.png';
const imgHover = '/images/deco-logo-hover.png';

authStore.$subscribe((mutation, state) => {
  isUserLoggedIn.value = state.isUserLoggedIn;
});
</script>

<template>
  <header class="grid">
    <div id="logo">
      <a href="/" @mouseover="hovered = true" @mouseleave="hovered = false">
        <img alt="cocktailist" :src="hovered ? imgHover : imgStandard" />
      </a>
    </div>
    <nav>
      <li v-if="!isUserLoggedIn"></li>
      <li><router-link to="/">Cocktails</router-link></li>
      <li><router-link to="/bars">Bars</router-link></li>
      <li v-if="isUserLoggedIn"><router-link to="/lists">Lists</router-link></li>
      <li><router-link to="/data">Data</router-link></li>
      <li>
        <router-link v-if="!isUserLoggedIn" to="/login">Login</router-link>
        <router-link v-else to="/account">Account</router-link>
      </li>
    </nav>
  </header>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/header.scss';
</style>
