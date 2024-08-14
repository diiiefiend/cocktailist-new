<script setup lang="ts">
// import { mockCocktailData, mockBarData } from '../mocks.js';
// import GridBox from '../components/GridBox.vue';
import Modal from '../../components/Modal.vue';

const props = defineProps<{
  cocktailId: number;
  userId: number;
}>();
</script>

<template>
  <modal>
    <template #header> I am header content! </template>
    <template #body> body body body </template>
    <template #footer> footy foot foot </template>
  </modal>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// @import '../assets/styles/views/modals/review-modal.scss';
</style>
