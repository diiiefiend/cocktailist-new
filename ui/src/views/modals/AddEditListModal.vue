<script setup lang="ts">
import { ref } from 'vue';

import SiteModal from '../../components/SiteModal.vue';

const props = defineProps<{}>();

const emit = defineEmits(['close']);

let listName = ref(null);

const onSubmit = () => {
  // TODO: validate and submit review
  // and share feedback on submission success/failure
  // reset state if success
  console.log(listName.value);
  listName.value = null;
};
</script>

<template>
  <!-- bubble up the close event bc emits don't naturally bubble -->
  <site-modal @close="$emit('close')">
    <template #header>
      <h2>Create New List</h2>
    </template>
    <template #body>
      <form @submit.prevent>
        <fieldset>
          <label>List Name</label>
          <input v-model="listName" type="text" />
        </fieldset>
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
