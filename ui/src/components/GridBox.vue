<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    width?: number;
    startCol?: number;
    applyBoxStyle?: boolean;
  }>(),
  {
    applyBoxStyle: true,
  },
);

const gridStyle = `grid-column: ${props.startCol || 'auto'} / span ${props.width || 1};`;
</script>

<template>
  <div :class="{ box: props.applyBoxStyle, 'grid-box': true }" :style="gridStyle">
    <slot></slot>
  </div>
</template>

<!-- not scoped bc then styles won't apply to "slot" children -->
<style lang="scss">
@import '../assets/styles/components/grid-box.scss';
</style>
