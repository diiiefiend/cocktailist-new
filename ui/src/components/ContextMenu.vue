<script setup lang="ts"></script>

<template>
  <div class="context-menu">
    <section class="grid">
      <slot></slot>
    </section>
  </div>
</template>

<!-- NOT scoped bc then the styling doesn't apply to <slot> elements -->
<style lang="scss">
@import '../assets/styles/components/context-menu.scss';
</style>
