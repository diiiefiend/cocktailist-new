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
const payload = ref(defaultPayload);
const isSubmitting = ref(false);

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
  isSubmitting.value = true;
  // TODO: validate and submit review
  // and share feedback on submission success/failure
  console.log('hello ', payload.value);
  isSubmitting.value = false;
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
        <fieldset>
          <label>Rating</label>
          <rating-item
            :rating-value="payload.rating"
            :is-interactive="true"
            @rating-set="(val) => updateRating(val, RATING_TYPES.RATING)"
          />
        </fieldset>
        <fieldset>
          <label>Spirited</label>
          <rating-slider
            :slider-value="'' + payload.spiritedRating"
            type="spirited"
            @rating-set="(val) => updateRating(val, RATING_TYPES.SPIRITED_SLIDER)"
          />
        </fieldset>
        <fieldset>
          <label>Innovative</label>
          <rating-slider
            :slider-value="'' + payload.innovativeRating"
            type="innovation"
            @rating-set="(val) => updateRating(val, RATING_TYPES.INNOVATION_SLIDER)"
          />
        </fieldset>
        <fieldset>
          <label>Comments</label>
          <text-area-input @comment-set="updateComment" />
        </fieldset>
      </form>
    </template>
    <template #footer>
      <button type="submit" class="primary" @click.stop="onSubmit" :disabled="isSubmitting">
        Submit
      </button>
      <button type="reset" class="cancel" @click="$emit('close')">Cancel</button>
    </template>
  </site-modal>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// @import '../assets/styles/views/modals/review-modal.scss';
</style>
