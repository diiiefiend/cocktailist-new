<script setup lang="ts">
import { ref } from 'vue';

import { checkRequiredFields } from '../../utils';
import { addList } from '../../api';
import SiteModal from '../../components/SiteModal.vue';

const props = defineProps<{
  userId: number;
  onSubmitCallback?: any;
}>();

const emit = defineEmits(['close']);

const listName: Ref<string | null> = ref(null);
const isSubmitting = ref(false);
const errors: Ref<string[]> = ref([]);

const onSubmit = async () => {
  errors.value = [];
  isSubmitting.value = true;

  // validations
  console.log('hello ', listName.value);
  // make an artificial Payload ref to make "checkRequiredFields" happy
  const payload = {
    value: { name: listName.value },
  };
  const requiredFields = ['name'];
  // @ts-ignore
  errors.value = errors.value.concat(checkRequiredFields(requiredFields, payload));

  console.log(errors);

  // if no errors, continue to try to submit
  if (!errors.value.length) {
    try {
      // @ts-ignore
      const newList = await addList({ ...payload.value });

      props.onSubmitCallback(newList.id);
      emit('close');
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
      <button type="submit" class="primary" @click.stop="onSubmit" :disabled="isSubmitting">
        Submit
      </button>
      <button type="reset" class="cancel" @click="$emit('close')">Cancel</button>
    </template>
  </site-modal>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
