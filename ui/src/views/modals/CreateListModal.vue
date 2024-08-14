<script setup lang="ts">
import { ref } from 'vue';

import SiteModal from '../../components/SiteModal.vue';

const props = defineProps<{}>();

const emit = defineEmits(['close']);

// const defaultPayload: ReviewSubmission = {
//   rating: 0,
//   spiritedRating: 0,
//   innovativeRating: 0,
//   comment: null,
// };

// TODO: if a review exists, then this should be prepopulated with the old review
// let payload = ref(defaultPayload);

// const updateComment = (comment: string) => {
//   payload.value.comment = comment;
// };

const onSubmit = () => {
  // TODO: validate and submit review
  // and share feedback on submission success/failure
  // reset
  // console.log('hello ', payload);
  // payload.value = defaultPayload;
};
</script>

<template>
  <!-- bubble up the close event bc emits don't naturally bubble -->
  <site-modal @close="$emit('close')">
    <template #header>
      <h2>Create List</h2>
    </template>
    <template #body>
      <form @submit.prevent>
        <div class="form-row">
          <label>List Name</label>
          <input type="text" />
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
<style scoped lang="scss"></style>
