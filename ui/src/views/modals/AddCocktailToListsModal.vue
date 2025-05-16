<script setup lang="ts">
import { ref } from 'vue';

import SiteModal from '../../components/SiteModal.vue';
import type { List } from '../../models';
import { addCocktailToLists } from '@/api';

const props = defineProps<{
  cocktailId: number;
  cocktailName: string;
  userId: number;
  lists: List[];
  selectedLists: List[];
  onSubmitCallback: any;
}>();

const emit = defineEmits(['close']);

const selectedListIds = ref(props.selectedLists.map((selectedList) => selectedList.id));
const isSubmitting = ref(false);
const errors: Ref<string[]> = ref([]);
const isSuccess = ref(false);

const onSubmit = async () => {
  errors.value = [];
  isSuccess.value = false;
  isSubmitting.value = true;
  console.log(selectedListIds.value);

  const initialValues = [...props.selectedLists];
  if (selectedListIds.value.sort().toString() != initialValues.sort().toString()) {
    // only call API if values have changed
    try {
      await addCocktailToLists(props.cocktailId, {
        listIds: selectedListIds.value,
      });

      props.onSubmitCallback(props.lists.filter((list) => selectedListIds.value.includes(list.id)));

      isSuccess.value = true;
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
      <h2>Modify Lists</h2>
    </template>
    <template #body>
      <form @submit.prevent>
        <fieldset class="checkbox-field">
          <legend>
            Add <span style="font-style: normal">{{ props.cocktailName }}</span> to:
          </legend>
          <label v-for="list in lists" :key="list.id" :for="'' + list.id">
            <input
              v-model="selectedListIds"
              :value="list.id"
              type="checkbox"
              :id="'' + list.id"
              :name="list.name"
              :checked="selectedLists.some((selectedList) => selectedList.id === list.id)"
            />
            {{ list.name }}
          </label>
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
      <div v-if="isSuccess" class="success-message">Updated!</div>
      <button type="submit" class="primary" @click.stop="onSubmit" :disabled="isSubmitting">
        Submit
      </button>
      <button type="reset" class="cancel" @click="$emit('close')">Close</button>
    </template>
  </site-modal>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
