<script setup lang="ts">
import { computed, ref } from 'vue';

import { DRINK_TYPES, type CocktailDetailItem } from '../../models';
import { addCocktail, updateCocktail } from '../../api';
import { checkRequiredFields } from '../../utils';

import SiteModal from '../../components/SiteModal.vue';

const props = defineProps<{
  existingCocktailInfo: CocktailDetailItem | null;
  userId: number;
  allBars: Bar[];
  onSubmitCallback: any;
}>();

const emit = defineEmits(['close']);

const isEdit = computed(() => !!props.existingCocktailInfo);
const payload = ref(
  props.existingCocktailInfo
    ? {
        name: props.existingCocktailInfo.name,
        type: props.existingCocktailInfo.liquor,
        barId: props.existingCocktailInfo.bar.id,
        barName: props.existingCocktailInfo.bar.name,
        barAddress: null,
        ingredients: props.existingCocktailInfo.ingredients,
        imgUrl: props.existingCocktailInfo.img_file_name,
      }
    : {
        name: null,
        type: null,
        barId: null,
        barName: null,
        barAddress: null,
        ingredients: null,
        imgUrl: null,
      },
);

const errors: Ref<string[]> = ref([]);
const isSubmitting = ref(false);
const isNewBar = ref(false);

const onSubmit = async () => {
  errors.value = [];
  isSubmitting.value = true;

  // validations
  console.log('hello ', payload.value);
  // TODO: update this to require EITHER barId OR barName/address, based on "isNewBar"
  const requiredFields = ['name', 'type', 'barId', 'ingredients'];
  errors.value = errors.value.concat(checkRequiredFields(requiredFields, payload));

  console.log(errors);

  // if no errors, continue to try to submit
  if (!errors.value.length) {
    try {
      if (isEdit.value) {
        // @ts-ignore
        await updateCocktail(props.existingCocktailInfo!.id, payload.value);
        emit('close');

        props.onSubmitCallback();
      } else {
        // @ts-ignore
        const createdCocktail = await addCocktail(payload.value);
        emit('close');

        props.onSubmitCallback(createdCocktail);
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
      <h2>{{ isEdit ? 'Edit Entry' : 'Add New Cocktail' }}</h2>
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
            <option v-for="bar in props.allBars" :key="bar.id" :value="bar.id">
              {{ bar.name }}
            </option>
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
