<script setup lang="ts">
import { mockCocktailData, mockBarData } from '../mocks.js';
import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import GridBox from '../components/GridBox.vue';
import CocktailBox from '../components/CocktailBox.vue';
import RatingItem from '../components/RatingItem.vue';

const props = withDefaults(
  defineProps<{
    id?: string;
  }>(),
  {
    id: '1',
  },
);

const cocktails = mockCocktailData.filter((cocktail) => cocktail.bar.id === +props.id);
const barDetails = mockBarData.find((bar) => bar.id === +props.id)!;
</script>

<template>
  <div id="browse">
    <context-menu>
      <div class="row-gap-1"></div>
      <div class="span-2 justify-left">
        <button class="primary">Add Cocktail</button>
      </div>
      <div class="span-2">
        <select>
          <option>{{ barDetails.name }}</option>
        </select>
      </div>
      <div class="span-2">
        <select>
          <option>All spirits</option>
        </select>
      </div>
      <div class="span-3 justify-right">
        <input id="search" placeholder="I have something in mind" />
      </div>
      <div class="span-1 justify-right">
        <button class="secondary">Search</button>
      </div>
    </context-menu>
    <layout-container>
      <grid-box :width="3" :startCol="1" :applyBoxStyle="true" class="bar-details-box">
        <h2>{{ barDetails.name }}</h2>
        <rating-item
          :rating-value="4"
          :show-total="true"
          :total-ratings="10"
          :show-divider="true"
        ></rating-item>
        <h3>{{ barDetails.address }}</h3>
      </grid-box>
      <grid-box :width="4" :startCol="4" :applyBoxStyle="true" class="map-box">
        <div class="placeholder-box"></div>
      </grid-box>
      <grid-box :width="3" :startCol="8" :applyBoxStyle="true" class="bar-details-box">
        <ul>
          <li>hours</li>
          <li>hours</li>
          <li>hours</li>
        </ul>
      </grid-box>
      <cocktail-box v-for="cocktail in cocktails" :key="cocktail.id" :cocktail="cocktail">
      </cocktail-box>
    </layout-container>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/views/bar.scss';
</style>
