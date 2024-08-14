<script setup lang="ts">
// import { mockCocktailData, mockBarData } from '../mocks.js';
// import GridBox from '../components/GridBox.vue';
import Modal from '../../components/Modal.vue';
import RatingItem from '../../components/RatingItem.vue';

const props = defineProps<{
  cocktailId: number;
  cocktailName: string;
  userId: number;
}>();
</script>

<template>
  <modal>
    <template #header>
      <h2>Review {{ cocktailName }}</h2>
    </template>
    <template #body>
      <form>
        <div class="form-row">
          <label>Rating</label>
          <rating-item :rating-value="3" />
        </div>
        <div class="form-row">
          <label>Spirited</label>
          slider dood-dad
        </div>
        <div class="form-row">
          <label>Innovative</label>
          slider dood-dad
        </div>
        <div class="form-row">
          <label>Comments</label>
          <textarea> </textarea>
        </div>
      </form>
    </template>
    <template #footer> footy foot foot </template>
  </modal>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// @import '../assets/styles/views/modals/review-modal.scss';
</style>
