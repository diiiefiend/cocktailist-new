<script setup lang="ts">
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    existingComment?: string;
  }>(),
  {},
);

const emit = defineEmits(['commentSet']);

let comment = ref(props.existingComment);
</script>

<template>
  <div>
    <textarea
      rows="5"
      v-model="comment"
      @blur="$emit('commentSet', comment)"
      placeholder="(optional)"
    ></textarea>
  </div>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/text-area.scss';
</style>
