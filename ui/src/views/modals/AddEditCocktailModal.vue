<script setup lang="ts">
import { computed, ref, type Ref } from 'vue';

import { DRINK_TYPES, type Bar, type CocktailItem } from '../../models';
import { addCocktail, updateCocktail } from '../../api';
import { checkRequiredFields } from '../../utils';

import SiteModal from '../../components/SiteModal.vue';

const NEW_LIQUOR_TYPE_VALUE = '--Add new liquor type--';
const NEW_BAR_PLACEHOLDER_ID = -1;

const props = defineProps<{
  existingCocktailInfo: CocktailItem | null;
  userId: number | null;
  allBars: Bar[];
  onSubmitCallback: any;
}>();

const emit = defineEmits(['close']);

const isEdit = computed(() => !!props.existingCocktailInfo);
const liquorTypeList = computed(() => {
  return [NEW_LIQUOR_TYPE_VALUE, ...Object.values(DRINK_TYPES).sort()];
});
const barList = computed(() => {
  const newBarPlaceholder: Bar = {
    id: NEW_BAR_PLACEHOLDER_ID,
    name: '--Add new bar--',
  };
  return [newBarPlaceholder, ...props.allBars];
});
const payload: Ref<{
  name: string | null,
  type: string | null,
  barId: number | null,
  barName: string | null,
  barAddress: string | null,
  ingredients: string | null,
}> = ref(
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
const newBarInfo: Ref<{
  name: string | null,
  address: string | null,
}> = ref(
  {
    name: null,
    address: null,
  }
);

const errors: Ref<string[]> = ref([]);
const isSubmitting = ref(false);
const liquorTypeValue: Ref<string | null> = ref(null);
const newLiquorType: Ref<string | null> = ref(null);
const fileInput: Ref<any> = ref(null);
const imageFile = ref(null);
const previewImage: Ref<string | null> = ref(null);
  
const showNewLiquorTypeInput = computed(() => {
  return liquorTypeValue.value === NEW_LIQUOR_TYPE_VALUE;
});
const showNewBarInputs = computed(() => {
  return payload.value.barId === NEW_BAR_PLACEHOLDER_ID;
})

const onSubmit = async () => {
  errors.value = [];
  isSubmitting.value = true;

  // validations
  if (newLiquorType.value && newLiquorType.value.trim() !== '') {
    payload.value.type = newLiquorType.value;
  } else if (liquorTypeValue.value && liquorTypeValue.value !== NEW_LIQUOR_TYPE_VALUE) {
    payload.value.type = liquorTypeValue.value;
  };

  const isNewBar = payload.value.barId === NEW_BAR_PLACEHOLDER_ID;
  if (isNewBar) {
    if (newBarInfo.value.name && newBarInfo.value.name.trim() !== '') {
      payload.value.barName = newBarInfo.value.name;
    }
    if (newBarInfo.value.address && newBarInfo.value.address.trim() !== '') {
      payload.value.barAddress = newBarInfo.value.address;
    }
  }

  console.log('hello ', payload.value);
  const requiredFields = ['name', 'type', 'barId', 'ingredients'];
  if (isNewBar) {
    requiredFields.push('barName');
    requiredFields.push('barAddress');
  };
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
          <select id="cocktail-type" v-model="liquorTypeValue">
            <option v-for="type in liquorTypeList" :key="type" :value="type">{{ type }}</option>
          </select>
          <input v-if="showNewLiquorTypeInput" class="subfield" type="text" v-model="newLiquorType" placeholder="new liquor type"></input>
        </fieldset>
        <fieldset>
          <label for="bars">Bar</label>
          <!-- TODO: add option to add bar -->
          <select id="bars" v-model="payload.barId">
            <option v-for="bar in barList" :key="bar.id" :value="bar.id">
              {{ bar.name }}
            </option>
          </select>
          <input v-if="showNewBarInputs" class="subfield" type="text" v-model="newBarInfo.name" placeholder="new bar name"></input>
          <input v-if="showNewBarInputs" class="subfield" type="text" v-model="newBarInfo.address" placeholder="new bar address"></input>
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
