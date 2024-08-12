<script setup lang='ts'>
  import { ref } from 'vue';

  const hovered = ref(false);

  const imgStandard = '/images/deco-logo.png';
  const imgHover = '/images/deco-logo-hover.png';
</script>

<template>
  <header class='grid'>
    <div id='logo'>
      <a href='/' @mouseover='hovered = true' @mouseleave='hovered = false'>
        <img alt='cocktailist' :src='[hovered ? imgHover : imgStandard]' />
      </a>
    </div>
    <nav>
      <li><RouterLink to='/'>Cocktails</RouterLink></li>
      <li><RouterLink to='/feed'>Activity</RouterLink></li>
      <li><RouterLink to='/lists'>Lists</RouterLink></li>
      <li><RouterLink to='/data'>Data</RouterLink></li>
      <li><RouterLink to='/login'>Login</RouterLink></li>
    </nav>
  </header>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang='scss'>
  @import '../assets/styles/components/header.scss';
</style>
