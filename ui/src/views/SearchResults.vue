<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';

import type { BarDetails, CocktailItem } from '../models.js';
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
const hovered = ref(false);
const hasNoResults = ref(false);

const currentSearchTerm: Ref<string> = ref(props.searchTerm);
const matchedCocktails: Ref<null | Array<CocktailItem>> = ref(null);
const matchedBars: Ref<null | Array<BarDetails>> = ref(null);

async function getSearchResults(searchTerm: string) {
  // TODO: update query param in route with updated search term
  currentSearchTerm.value = searchTerm;
  const results = await search(currentSearchTerm.value);
  matchedCocktails.value = results.matchedCocktails;
  matchedBars.value = results.matchedBars;
  hasNoResults.value = !results.matchedCocktails.length && !results.matchedBars.length;
}

async function fetchData() {
  error.value = null;
  isLoading.value = true;

  try {
    await getSearchResults(currentSearchTerm.value);
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
      <div class="span-4 justify-left">
        <h1>Search Results for "{{ currentSearchTerm }}"</h1>
      </div>
      <div class="span-2"></div>
      <search-box :onSubmitCallback="getSearchResults" />
    </context-menu>
    <div v-if="isLoading" class="loader">LOADING</div>
    <layout-container v-else>
      <!-- // TODO: fix this up later -->
      <div v-if="hasNoResults">NO RESULTS!</div>
      <cocktail-box v-for="cocktail in matchedCocktails" :key="cocktail.id" :cocktail="cocktail">
      </cocktail-box>
      <!-- note: can pull this into own component if necessary to reuse -->
      <div
        class="cocktail-box"
        v-for="bar in matchedBars"
        :key="bar.name"
        @mouseover="hovered = true"
        @mouseleave="hovered = false"
      >
        <router-link :to="{ name: 'Bar', params: { id: bar.id } }">
          <h3 :class="{ hovered }">{{ bar!.name }}</h3>
          <ul class="details colored-by-type bar" :class="{ hovered }">
            <li>{{ bar!.address }}</li>
            <li class="label">bar</li>
          </ul>
        </router-link>
      </div>
    </layout-container>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
// since the bar cards look very similar to the cocktail cards, we can borrow the styling
@import '../assets/styles/components/cocktail-box.scss';
</style>
