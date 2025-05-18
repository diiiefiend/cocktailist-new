<script setup lang="ts">
import { useAuthStore } from '../stores/auth';
import { type ReviewItem } from '../models';
import { DATE_FORMATTING } from '../utils';

import RatingItem from './RatingItem.vue';

const props = defineProps<{
  reviews: ReviewItem[];
  deleteReviewCallback: any;
}>();

const authStore = useAuthStore();
</script>

<template>
  <ul class="reviews">
    <!-- TODO: handle no reviews case -->
    <li v-for="review in props.reviews" :key="review.id">
      <!-- TODO: this is not re-rendering based without a refresh -->
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
      <button
        v-if="authStore.userId && review.user_id === +authStore.userId"
        class="link-button"
        @click.stop="props.deleteReviewCallback(review)"
      >
        remove your review?
      </button>
      <div class="reviewer">{{ review.reviewer.username }}</div>
      <div class="timestamp">
        on {{ new Date(review.updated_at).toLocaleString('en-US', DATE_FORMATTING) }}
      </div>
    </li>
  </ul>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/review-list.scss';
</style>
