<script setup lang="ts">
import { mockCocktailData } from '../mocks.js';
import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import CocktailBox from '../components/CocktailBox.vue';
import SearchBox from '../components/SearchBox.vue';

const cocktails = mockCocktailData;
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
          <option>All bars</option>
        </select>
      </div>
      <div class="span-2">
        <select>
          <option>All spirits</option>
        </select>
      </div>
      <search-box />
    </context-menu>
    <layout-container>
      <cocktail-box v-for="cocktail in cocktails" :key="cocktail.id" :cocktail="cocktail">
      </cocktail-box>
    </layout-container>
  </div>
</template>
