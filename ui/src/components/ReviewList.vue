<script setup lang='ts'>
  import { ReviewItem } from '../models';
  import Rating from './Rating.vue';

  defineProps<{
    reviews: ReviewItem[],
  }>();

  // @Component({
  //   components: { Rating }
  // })
  // export default class ReviewList extends Vue {
  //   @Prop() private reviews!: ReviewItem[];
  // }
</script>

<template>
  <ul class='reviews'>
    <li v-for='review in reviews' :key='review.id'>
      <rating :rating-value='review.rating'></rating><br />
      Spirited:
      <span class='rating number'>{{ review.spiritedRating }}</span>
      ; Innovative:
      <span class='rating number'>{{ review.innovationRating }}</span>
      <br />
      <p>{{ review.comment }}</p>
      <div class='reviewer'>{{ review.reviewer }}</div>
      <div class='timestamp'>on {{ review.timestamp }}</div>
    </li>
  </ul>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang='scss'>
  @import '../assets/styles/components/review-list.scss';
</style>
