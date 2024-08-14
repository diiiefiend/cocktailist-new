<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    // v-model makes it a string i guess
    sliderValue: string | null;
    type: string;
  }>(),
  {},
);

const emit = defineEmits(['ratingSet']);

let rating = ref(props.sliderValue);
</script>

<template>
  <div class="slider-container" @mouseleave="$emit('ratingSet', rating)">
    <div>
      <input
        v-model="rating"
        :class="props.type"
        type="range"
        max="10"
        min="1"
        :value="rating"
        step="1"
      />
    </div>
    <div class="slider-value">{{ rating }}</div>
  </div>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/rating-slider.scss';
</style>
