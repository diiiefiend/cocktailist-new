<script setup lang="ts">
import { ref, type Ref } from 'vue';

import { type ReviewItem, type ReviewSubmission, RATING_TYPES } from '../../models';
import { addReview, updateReview } from '../../api';
import { checkRequiredFields } from '../../utils';

import SiteModal from '../../components/SiteModal.vue';
import RatingItem from '../../components/RatingItem.vue';
import RatingSlider from '../../components/RatingSlider.vue';
import TextAreaInput from '../../components/TextAreaInput.vue';

const props = defineProps<{
  existingReview?: ReviewItem;
  cocktailId: number;
  cocktailName: string;
  userId: number | null;
  onSubmitCallback: any;
}>();

const emit = defineEmits(['close']);

const defaultPayload: ReviewSubmission = {
  rating: 0,
  scaleSpirited: 0,
  scaleComposition: 0,
  body: undefined,
};

const payload = ref(
  props.existingReview
    ? {
        rating: props.existingReview.rating,
        scaleSpirited: props.existingReview.scale_spirited,
        scaleComposition: props.existingReview.scale_composition,
        body: props.existingReview.body,
      }
    : defaultPayload,
);
const isSubmitting = ref(false);
const errors: Ref<string[]> = ref([]);

const updateRating = (rating: number | string, ratingType: RATING_TYPES) => {
  switch (ratingType) {
    case RATING_TYPES.RATING:
      payload.value.rating = +rating;
      break;
    case RATING_TYPES.SPIRITED_SLIDER:
      payload.value.scaleSpirited = +rating;
      break;
    case RATING_TYPES.INNOVATION_SLIDER:
      payload.value.scaleComposition = +rating;
      break;
  }
};

const updateComment = (comment: string) => {
  payload.value.body = comment;
};

const onSubmit = async () => {
  errors.value = [];
  isSubmitting.value = true;
  console.log('hello ', payload.value);

  const requiredFields = ['rating'];
  errors.value = errors.value.concat(checkRequiredFields(requiredFields, payload));

  console.log(errors);

  // if no errors, continue to try to submit
  if (!errors.value.length) {
    try {
      if (props.existingReview) {
        // @ts-ignore
        await updateReview(props.existingReview!.id, payload.value);
        emit('close');

        props.onSubmitCallback();
      } else {
        // @ts-ignore
        const createdReview = await addReview(props.cocktailId, payload.value);
        emit('close');

        props.onSubmitCallback(createdReview);
      }
    } catch (e) {
      // @ts-ignore
      errors.value.push(e);
    }
  }

  isSubmitting.value = false;
};
</script>

<template>
  <!-- bubble up the close event bc emits don't naturally bubble -->
  <site-modal @close="$emit('close')">
    <template #header>
      <h2>Review {{ props.cocktailName }}</h2>
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
            :slider-value="'' + payload.scaleSpirited"
            type="spirited"
            @rating-set="(val) => updateRating(val, RATING_TYPES.SPIRITED_SLIDER)"
          />
        </fieldset>
        <fieldset>
          <label>Innovative</label>
          <rating-slider
            :slider-value="'' + payload.scaleComposition"
            type="innovation"
            @rating-set="(val) => updateRating(val, RATING_TYPES.INNOVATION_SLIDER)"
          />
        </fieldset>
        <fieldset>
          <label>Comments</label>
          <text-area-input :existingComment="payload.body" @comment-set="updateComment" />
        </fieldset>
      </form>
    </template>
    <template #footer>
      <div v-if="errors.length" class="form-error">
        Please see the following error(s):
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
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
