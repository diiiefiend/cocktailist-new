<script setup lang="ts">
import { ref } from 'vue';

import { DRINK_TYPES, type CocktailSubmission } from '../../models';
import { mockBarData } from '../../mocks';

import SiteModal from '../../components/SiteModal.vue';
import { addCocktail } from '../../api';
import { checkRequiredFields } from '../../utils';

const props = defineProps<{
  existingCocktailInfo: CocktailSubmission | null;
  userId: number;
}>();

const emit = defineEmits(['close']);

const allBars = mockBarData;

let payload = ref(
  props.existingCocktailInfo ?? {
    name: null,
    type: null,
    barId: null,
    ingredients: null,
    imgUrl: null,
  },
);

let errors: Ref<string[]> = ref([]);

const onSubmit = async () => {
  errors.value = [];

  // validations
  console.log('hello ', payload.value);
  const requiredFields = ['name', 'type', 'barId', 'ingredients'];
  errors.value = errors.value.concat(checkRequiredFields(requiredFields, payload));

  console.log(errors);

  // if no errors, continue to try to submit
  if (!errors.value.length) {
    try {
      // @ts-ignore
      await addCocktail(payload.value);
    } catch (e) {
      // @ts-ignore
      errors.value.push(e);
    }
  }
};
</script>

<template>
  <!-- bubble up the close event bc emits don't naturally bubble -->
  <site-modal @close="$emit('close')">
    <template #header>
      <h2>Add New Cocktail</h2>
    </template>
    <template #body>
      <form @submit.prevent>
        <fieldset>
          <label>Name</label>
          <input type="text" v-model="payload.name" />
        </fieldset>
        <fieldset>
          <label for="cocktail-types">Type</label>
          <!-- TODO: add option to add type? -->
          <select id="cocktail-type" v-model="payload.type">
            <option v-for="type in DRINK_TYPES" :key="type" :value="type">{{ type }}</option>
          </select>
        </fieldset>
        <fieldset>
          <label for="bars">Bar</label>
          <!-- TODO: add option to add bar -->
          <select id="bars" v-model="payload.barId">
            <option v-for="bar in allBars" :key="bar.id" :value="bar.id">{{ bar.name }}</option>
          </select>
        </fieldset>
        <fieldset>
          <label>Ingredients</label>
          <input type="text" v-model="payload.ingredients" placeholder="(comma-delimited)" />
        </fieldset>
        <fieldset>
          <label>Image</label>
          <!-- TODO: image upload form -->
          <input type="text" v-model="payload.imgUrl" />
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
      <button type="submit" class="primary" @click.stop="onSubmit">Submit</button>
      <button type="reset" class="cancel" @click="$emit('close')">Cancel</button>
    </template>
  </site-modal>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// @import '../assets/styles/views/modals/review-modal.scss';
</style>
