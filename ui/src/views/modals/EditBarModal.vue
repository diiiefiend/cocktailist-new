<script setup lang="ts">
import { ref, type Ref } from 'vue';

import { checkRequiredFields } from '../../utils';
import { convertAddressToLatLng } from '../../google';
import { updateBar } from '../../api';
import type { BarDetails } from '../../models';

import SiteModal from '../../components/SiteModal.vue';

const props = defineProps<{
  existingBarInfo: BarDetails | null;
  userId: number | null;
  onSubmitCallback?: any;
}>();

const emit = defineEmits(['close']);

const isSubmitting = ref(false);
const errors: Ref<string[]> = ref([]);

const payload: Ref<BarDetails> = ref(
  props.existingBarInfo
    ? {
        id: +props.existingBarInfo.id,
        name: props.existingBarInfo.name,
        address: props.existingBarInfo.address,
        latitude: props.existingBarInfo.latitude,
        longitude: props.existingBarInfo.longitude,
      }
    : {
        id: 0,
        name: '',
        address: '',
        latitude: undefined,
        longitude: undefined,
      },
);

const onSubmit = async () => {
  errors.value = [];
  isSubmitting.value = true;

  const hasNameUpdate = payload.value.name !== props.existingBarInfo?.name;
  const hasAddressUpdate = payload.value.address !== props.existingBarInfo?.address;

  if (hasNameUpdate || hasAddressUpdate) {
    if (payload.value.address && hasAddressUpdate) {
      console.trace('has address update, refetching coordinates!');

      // look up coordinates using Google Geocoding API
      const coords = await convertAddressToLatLng(payload.value.address);
      payload.value.latitude = coords?.lat();
      payload.value.longitude = coords?.lng();
    }

    console.trace('hello ', payload.value);

    const requiredFields = ['id', 'name', 'address'];

    errors.value = errors.value.concat(checkRequiredFields(requiredFields, payload));

    console.log(errors);

    // if no errors, continue to try to submit
    if (!errors.value.length) {
      try {
        const updatedBarStatus = await updateBar(payload.value.id, { ...payload.value });

        if (updatedBarStatus.length && updatedBarStatus[0] > 0) {
          props.onSubmitCallback(payload.value);
        } else {
          console.trace('no bars updated');
        }

        emit('close');
      } catch (e) {
        // @ts-ignore
        errors.value.push(e);
      }
    }
  }

  isSubmitting.value = false;
};
</script>

<template>
  <!-- bubble up the close event bc emits don't naturally bubble -->
  <site-modal @close="$emit('close')">
    <template #header>
      <h2>Edit Bar</h2>
    </template>
    <template #body>
      <form @submit.prevent>
        <fieldset>
          <label>Bar Name</label>
          <input v-model="payload.name" type="text" />
        </fieldset>
        <fieldset>
          <label>Bar Address</label>
          <input v-model="payload.address" type="text" />
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
