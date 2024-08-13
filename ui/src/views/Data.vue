<script setup lang="ts">
import { type ReviewItem } from '../models';
import { mockCocktailDetailData, mockReviewData, mockBarData } from '../mocks';
import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import GridBox from '../components/GridBox.vue';
import CocktailDetail from '../components/CocktailDetail.vue';
import ReviewList from '../components/ReviewList.vue';
import RatingItem from '../components/RatingItem.vue';
import ScatterChart from '../components/ScatterChart.vue';

const props = defineProps<{
  id: string;
}>();
</script>

<template>Will start with google maps of all drinks</template>
