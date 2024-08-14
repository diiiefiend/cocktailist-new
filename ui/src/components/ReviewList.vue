<script setup lang="ts">
import { type ReviewItem } from '../models';
import RatingItem from './RatingItem.vue';

const props = defineProps<{
  reviews: ReviewItem[];
}>();
</script>

<template>
  <ul class="reviews">
    <li v-for="review in props.reviews" :key="review.id">
      <rating-item :rating-value="review.rating"></rating-item><br />
      Spirited:
      <span class="rating number">{{ review.spiritedRating }}</span>
      ; Innovative:
      <span class="rating number">{{ review.innovativeRating }}</span>
      <br />
      <p>{{ review.comment }}</p>
      <div class="reviewer">{{ review.reviewer }}</div>
      <div class="timestamp">on {{ review.timestamp }}</div>
    </li>
  </ul>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/review-list.scss';
</style>
