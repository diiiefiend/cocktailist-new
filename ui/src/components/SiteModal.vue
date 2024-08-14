<script setup lang="ts">
const props = defineProps<{}>();

const emit = defineEmits(['close']);
</script>

<template>
  <div class="modal-mask">
    <div class="modal-wrapper">
      <div class="modal-container">
        <button class="close-modal" @click="$emit('close')">X</button>
        <div class="modal-header">
          <slot name="header"></slot>
        </div>

        <div class="modal-body">
          <slot name="body"></slot>
        </div>

        <div class="modal-footer">
          <slot name="footer">
            <button class="cancel" @click="$emit('close')">Close</button>
          </slot>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/modal.scss';
</style>
