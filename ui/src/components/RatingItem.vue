<script setup lang="ts">
import { ref } from 'vue';

import { FLOURISH_IMG } from '../utils';

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

const emit = defineEmits(['ratingSet']);

const HIGHEST_VALUE = 5;
const rating = ref(props.ratingValue);
const fullValue = ref(Math.floor(props.ratingValue));
const stableFullValue = ref(Math.floor(props.ratingValue));
// doesn't need to be ref bc interactive mode doesn't allow partial values
const partialValueWidth = Math.floor(18 * (props.ratingValue % 1));

const emptyImg = '/images/rating-empty.png';
const fullImg = '/images/rating-full.png';

const onMouseover = (val: number) => {
  if (props.isInteractive) {
    fullValue.value = val;
  }
};

const onMouseleave = () => {
  if (props.isInteractive) {
    fullValue.value = stableFullValue.value;
  }
};

const onClick = (ratingValue: number) => {
  if (props.isInteractive) {
    rating.value = ratingValue;
    stableFullValue.value = ratingValue;
    emit('ratingSet', ratingValue);
  }
};
</script>

<template>
  <div :class="{ centered: props.showTotal }">
    <div class="rating">
      <span
        v-for="val in HIGHEST_VALUE"
        @mouseover.stop="onMouseover(val)"
        @mouseleave.stop="onMouseleave"
        @click.stop="onClick(val)"
        :key="val"
      >
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
    <img class="divider" v-if="props.showDivider" :src="FLOURISH_IMG" alt="" />
  </div>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/rating.scss';
</style>
