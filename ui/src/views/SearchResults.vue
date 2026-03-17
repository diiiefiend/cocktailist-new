<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';

import type { Bar, CocktailItem } from '../models.js';
import { search } from '../api.js';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import CocktailBox from '../components/CocktailBox.vue';
import SearchBox from '../components/SearchBox.vue';

const props = defineProps<{
  searchTerm: string;
}>();

const isLoading = ref(true);
const error = ref(null);

const matchedCocktails: Ref<null | Array<CocktailItem>> = ref(null);
const matchedBars: Ref<null | Array<Bar>> = ref(null);

async function getSearchResults(searchTerm: string) {
  const results = await search(searchTerm);
  matchedCocktails.value = results.matchedCocktails;
  matchedBars.value = results.matchedBars;
}

async function fetchData() {
  error.value = null;
  isLoading.value = true;

  try {
    await getSearchResults(props.searchTerm);
  } catch (err: any) {
    error.value = err.toString();
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div id="browse">
    <context-menu>
      <div class="row-gap-1"></div>
      <div class="span-2 justify-left"></div>
      <div class="span-2"></div>
      <div class="span-2"></div>
      <search-box :onSubmitCallback="getSearchResults" />
    </context-menu>
    <div v-if="isLoading" class="loader">LOADING</div>
    <layout-container v-else>
      <cocktail-box v-for="cocktail in matchedCocktails" :key="cocktail.id" :cocktail="cocktail">
      </cocktail-box>
      <!-- TODO: display matched bars -->
    </layout-container>
  </div>

  <!-- modals -->
</template>
