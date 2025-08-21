<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';

import { DRINK_TYPES, type Bar, type CocktailItem } from '../../models';
import { addCocktail, updateCocktail } from '../../api';
import { checkRequiredFields } from '../../utils';

import SiteModal from '../../components/SiteModal.vue';

const props = defineProps<{
  existingCocktailInfo: CocktailItem | null;
  userId: number | null;
  allBars: Bar[];
  onSubmitCallback: any;
}>();

const emit = defineEmits(['close']);

const isEdit = computed(() => !!props.existingCocktailInfo);
const sortedDrinkTypes = computed(() => Object.values(DRINK_TYPES).sort());
const payload = ref(
  props.existingCocktailInfo
    ? {
        name: props.existingCocktailInfo.name,
        type: props.existingCocktailInfo.liquor,
        barId: props.existingCocktailInfo.bar.id,
        barName: props.existingCocktailInfo.bar.name,
        barAddress: null,
        ingredients: props.existingCocktailInfo.ingredients,
      }
    : {
        name: null,
        type: null,
        barId: null,
        barName: null,
        barAddress: null,
        ingredients: null,
      },
);

const errors: Ref<string[]> = ref([]);
const isSubmitting = ref(false);
const isNewBar = ref(false);
const fileInput: Ref<any> = ref(null);
const imageFile = ref(null);
const previewImage: Ref<string | null> = ref(null);

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
      // turn the payload into FormData so we can send the image
      const formData = new FormData();

      Object.keys(payload.value).forEach((key) => {
        // @ts-ignore
        formData.append(key, payload.value[key]);
      });

      if (imageFile.value) {
        formData.append('img', imageFile.value);
      }

      if (isEdit.value) {
        // @ts-ignore
        await updateCocktail(props.existingCocktailInfo!.id, formData);
        emit('close');

        props.onSubmitCallback();
      } else {
        // @ts-ignore
        const createdCocktail = await addCocktail(formData);
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

function onUpdateImage(event: any) {
  const file = event.target.files[0];

  if (file && file.type.match('image.*')) {
    imageFile.value = file;

    const reader = new FileReader();
    reader.onloadend = () => {
      previewImage.value = reader.result as string;
    };

    reader.readAsDataURL(file);
  } else {
    resetImages();
  }
}

function resetImages() {
  previewImage.value = null;
  imageFile.value = null;
  fileInput.value.value = null;
}
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
            <option v-for="type in sortedDrinkTypes" :key="type" :value="type">{{ type }}</option>
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
          <input type="file" @change="onUpdateImage" accept="image/*" ref="fileInput" />
          <button v-if="imageFile" class="link-button remove-image-link" @click.stop="resetImages">
            X
          </button>
          <img v-if="previewImage" class="preview-image" :src="previewImage" />
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
<style scoped lang="scss"></style>
