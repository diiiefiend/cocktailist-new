<script setup lang="ts">
import { ref } from 'vue';

import { type ReviewSubmission, RATING_TYPES } from '../../models';

import SiteModal from '../../components/SiteModal.vue';
import RatingItem from '../../components/RatingItem.vue';
import RatingSlider from '../../components/RatingSlider.vue';
import TextAreaInput from '../../components/TextAreaInput.vue';

const props = defineProps<{
  cocktailId: number;
  cocktailName: string;
  userId: number;
}>();

const emit = defineEmits(['close']);

const defaultPayload: ReviewSubmission = {
  rating: 0,
  spiritedRating: 0,
  innovativeRating: 0,
  comment: null,
};

// TODO: if a review exists, then this should be prepopulated with the old review
let payload = ref(defaultPayload);

const updateRating = (rating: number | string, ratingType: RATING_TYPES) => {
  switch (ratingType) {
    case RATING_TYPES.RATING:
      payload.value.rating = +rating;
      break;
    case RATING_TYPES.SPIRITED_SLIDER:
      payload.value.spiritedRating = +rating;
      break;
    case RATING_TYPES.INNOVATION_SLIDER:
      payload.value.innovativeRating = +rating;
      break;
  }
};

const updateComment = (comment: string) => {
  payload.value.comment = comment;
};

const onSubmit = () => {
  // TODO: validate and submit review
  // and share feedback on submission success/failure
  // reset
  console.log('hello ', payload);
  payload.value = defaultPayload;
};
</script>

<template>
  <!-- bubble up the close event bc emits don't naturally bubble -->
  <site-modal @close="$emit('close')">
    <template #header>
      <h2>Review {{ cocktailName }}</h2>
    </template>
    <template #body>
      <form @submit.prevent>
        <div class="form-row">
          <label>Rating</label>
          <rating-item
            :rating-value="payload.rating"
            :is-interactive="true"
            @rating-set="(val) => updateRating(val, RATING_TYPES.RATING)"
          />
        </div>
        <div class="form-row">
          <label>Spirited</label>
          <rating-slider
            :slider-value="'' + payload.spiritedRating"
            type="spirited"
            @rating-set="(val) => updateRating(val, RATING_TYPES.SPIRITED_SLIDER)"
          />
        </div>
        <div class="form-row">
          <label>Innovative</label>
          <rating-slider
            :slider-value="'' + payload.innovativeRating"
            type="innovation"
            @rating-set="(val) => updateRating(val, RATING_TYPES.INNOVATION_SLIDER)"
          />
        </div>
        <div class="form-row">
          <label>Comments</label>
          <text-area-input @comment-set="updateComment" />
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
