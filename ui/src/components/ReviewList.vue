<script setup lang="ts">
import { type ReviewItem } from '../models';
import RatingItem from './RatingItem.vue';

const props = defineProps<{
  reviews: ReviewItem[];
}>();

const dateOptions: any = {
  year: 'numeric',
  weekday: 'long',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
  hour12: false,
};
</script>

<template>
  <ul class="reviews">
    <li v-for="review in props.reviews" :key="review.id">
      <rating-item :rating-value="review.rating"></rating-item>
      <span v-if="review.scale_spirited">
        <br />
        Spirited:
        <span class="rating number">{{ review.scale_spirited }}</span>
      </span>
      <span v-if="review.scale_spirited">
        ; Innovative:
        <span class="rating number">{{ review.scale_composition }}</span>
        <br />
      </span>
      <p>{{ review.body }}</p>
      <div class="reviewer">{{ review.reviewer.username }}</div>
      <div class="timestamp">
        on {{ new Date(review.updated_at).toLocaleString('en-US', dateOptions) }}
      </div>
    </li>
  </ul>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/review-list.scss';
</style>
