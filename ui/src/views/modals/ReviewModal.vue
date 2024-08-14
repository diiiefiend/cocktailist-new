<script setup lang="ts">
import { ref } from 'vue';

import { type ReviewSubmission } from '../../models';

import SiteModal from '../../components/SiteModal.vue';
import RatingItem from '../../components/RatingItem.vue';

const props = defineProps<{
  cocktailId: number;
  cocktailName: string;
  userId: number;
}>();

const emit = defineEmits(['close']);

const defaultPayload: ReviewSubmission = {
  rating: 0,
  spiritedRating: 0,
  innovationRating: 0,
  comment: null,
};

// TODO: if a review exists, then this should be prepopulated with the old review
let payload = ref(defaultPayload);

const onSubmit = () => {
  // submit review
  // and share feedback on submission success/failure
  // reset
  console.log('hello ', payload);
  payload.value = defaultPayload;
};
</script>

<template>
  <site-modal>
    <template #header>
      <h2>Review {{ cocktailName }}</h2>
    </template>
    <template #body>
      <form @submit.prevent>
        <div class="form-row">
          <label>Rating</label>
          <rating-item :rating-value="payload.rating" :is-interactive="true" />
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
    <template #footer>
      <button type="submit" class="primary" @click.stop="onSubmit">Submit</button>
      <button type="reset" class="cancel" @click="$emit('close')">Cancel</button>
    </template>
  </site-modal>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// @import '../assets/styles/views/modals/review-modal.scss';
</style>
