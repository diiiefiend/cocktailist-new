<script setup lang="ts">
import { ref } from 'vue';

import SiteModal from '../../components/SiteModal.vue';
import type { List } from '../../models';

const props = defineProps<{
  cocktailId: number;
  cocktailName: string;
  userId: number;
  lists: List[];
  selectedLists: List[];
}>();

const emit = defineEmits(['close']);

let selectedListIds = ref(props.selectedLists.map((selectedList) => selectedList.id));

const onSubmit = () => {
  // TODO: validate and submit lists
  // and share feedback on submission success/failure
  console.log(selectedListIds.value);
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
      <button type="submit" class="primary" @click.stop="onSubmit">Submit</button>
      <button type="reset" class="cancel" @click="$emit('close')">Cancel</button>
    </template>
  </site-modal>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
