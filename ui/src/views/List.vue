<script setup lang="ts">
import { mockCocktailData, mockListsData, mockListItemsData } from '../mocks.js';
import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import CocktailBox from '../components/CocktailBox.vue';

const props = defineProps<{
  id: string;
}>();

const cocktails = mockCocktailData;
</script>

<template>
  <div id="browse">
    <context-menu>
      <div class="row-gap-1"></div>
      <div class="span-2 justify-left">
        <button class="primary">Create List</button>
      </div>
      <div class="span-2">
        <select>
          <option>Done and done</option>
        </select>
      </div>
      <div class="span-1">
        <button class="secondary">Delete List</button>
      </div>
      <div class="span-1"></div>
      <div class="span-3 justify-right">
        <input id="search" placeholder="I have something in mind" />
      </div>
      <div class="span-1 justify-right">
        <button class="secondary">Search</button>
      </div>
    </context-menu>
    <layout-container>
      <!-- <cocktail-box v-for="cocktail in cocktails" :key="cocktail.id" :cocktail="cocktail">
      </cocktail-box> -->
      {{ props.id }}
    </layout-container>
  </div>
</template>
