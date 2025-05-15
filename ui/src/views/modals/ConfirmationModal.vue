<script setup lang="ts">
import { ref } from 'vue';

import SiteModal from '../../components/SiteModal.vue';

const props = defineProps<{
  title: string;
  modalText: string;
  submitText: string;
  submitFn: any;
}>();

const emit = defineEmits(['close']);

let isSubmitting = ref(false);
let errors: Ref<string[]> = ref([]);

const onSubmit = async () => {
  errors.value = [];
  isSubmitting.value = true;

  // if no errors, continue to try to submit
  if (!errors.value.length) {
    try {
      // @ts-ignore
      await props.submitFn();
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
      <h2>{{ props.title }}</h2>
    </template>
    <template #body>
      {{ props.modalText }}
    </template>
    <template #footer>
      <div v-if="errors.length" class="form-error">
        Please see the following error(s):
        <ul>
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>
      </div>
      <button type="submit" class="primary" @click.stop="onSubmit" :disabled="isSubmitting">
        {{ props.submitText }}
      </button>
      <button type="reset" class="cancel" @click="$emit('close')">Cancel</button>
    </template>
  </site-modal>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss"></style>
