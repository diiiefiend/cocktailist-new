<script setup lang='ts'>
  defineProps<{
    width?: number,
    startCol?: number,
    applyBoxStyle: boolean,
  }>();

  const gridStyle = `grid-column: ${startCol || 'auto'} / span ${width ||
        1};`;
</script>

<template>
  <div :class='{ box: this.applyBoxStyle }' :style='gridStyle'>
    <slot></slot>
  </div>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang='scss'>
  @import '../assets/styles/components/grid-box.scss';
</style>
