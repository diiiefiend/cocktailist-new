<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    ratingValue: number;
    isInteractive?: boolean;
    showTotal?: boolean;
    totalRatings?: number;
    showDivider?: boolean;
  }>(),
  {
    isInteractive: false,
    showTotal: false,
    totalRatings: 0,
    showDivider: false,
  },
);

const HIGHEST_VALUE = 5;
let rating = ref(props.ratingValue);
let fullValue = ref(Math.floor(props.ratingValue));
// doesn't need to be ref bc interactive mode doesn't allow partial values
const partialValueWidth = Math.floor(18 * (props.ratingValue % 1));

const emptyImg = '/images/rating-empty.png';
const fullImg = '/images/rating-full.png';
const flourishImg = '/images/deco-flourish.jpg';

const onClick = (ratingValue: number) => {
  if (props.isInteractive) {
    rating.value = ratingValue;
    fullValue.value = ratingValue;
    console.log('hi', rating.value);
  }
};
</script>

<template>
  <div :class="{ centered: props.showTotal }">
    <div class="rating">
      <span v-for="val in HIGHEST_VALUE" @click.stop="onClick(val)" :key="val">
        <span v-if="val <= fullValue">
          <img :src="fullImg" alt="*" />
        </span>
        <span v-else-if="val <= fullValue + 1 && partialValueWidth > 0" class="partial-container">
          <span class="partial" :style="{ width: partialValueWidth + 'px' }">
            <img :src="fullImg" alt="*" />
          </span>
        </span>
        <span v-else>
          <img :src="emptyImg" alt="-" />
        </span>
      </span>
    </div>
    <p v-if="props.showTotal">(based on {{ props.totalRatings }} reviews)</p>
    <img class="divider" v-if="props.showDivider" :src="flourishImg" alt="" />
  </div>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/rating.scss';
</style>
