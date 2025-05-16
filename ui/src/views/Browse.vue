<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';

import { getCocktailsWithBars, getBars, getLiquorList } from '../api.js';
import { useAuthStore } from '../stores/auth.js';
import type { Bar, CocktailBoxItem } from '../models.js';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import CocktailBox from '../components/CocktailBox.vue';
import SearchBox from '../components/SearchBox.vue';
import AddEditCocktailModal from './modals/AddEditCocktailModal.vue';

const ALL_BARS = 'All bars';
const ALL_SPIRITS = 'All spirits';

const authStore = useAuthStore();

let isLoading = ref(true);
let error = ref(null);

let isUserLoggedIn = authStore.checkIsUserLoggedIn();
let allCocktails: Ref<null | Array<CocktailBoxItem>> = ref(null);
let allBars: Ref<null | Array<Bar>> = ref(null);
let liquorTypes: Ref<null | string[]> = ref(null);

let showAddCocktailModal = ref(false);
let selectedBarFilter: Ref<null | number | string> = ref(ALL_BARS);
let selectedLiquorFilter: Ref<null | string> = ref(ALL_SPIRITS);
let filteredCocktails: Ref<null | undefined | Array<CocktailBoxItem>> = ref(null);

const handleBarFilterUpdate = (
  initialCocktailList: Array<CocktailBoxItem>,
  isInternalCall: boolean,
) => {
  let result: Array<CocktailBoxItem> = initialCocktailList;
  if (selectedBarFilter.value !== ALL_BARS) {
    result = initialCocktailList.filter(
      // @ts-ignore
      (cocktail) => cocktail.bar.id === selectedBarFilter.value,
    );
  }

  if (!isInternalCall) {
    result = handleLiquorFilterUpdate(result, true);
  }

  console.log('filtered for: ', selectedBarFilter.value, selectedLiquorFilter.value);

  return result;
};

const handleLiquorFilterUpdate = (
  initialCocktailList: Array<CocktailBoxItem>,
  isInternalCall: boolean,
) => {
  let result: Array<CocktailBoxItem> = initialCocktailList;

  if (selectedLiquorFilter.value !== ALL_SPIRITS) {
    result = initialCocktailList.filter(
      (cocktail) => cocktail.liquor === selectedLiquorFilter.value,
    );
  }

  if (!isInternalCall) {
    result = handleBarFilterUpdate(result, true);
  }

  console.log('filtered for: ', selectedBarFilter.value, selectedLiquorFilter.value);
  return result;
};

async function fetchData() {
  error.value = null;
  isLoading.value = true;

  try {
    const apiRes = await getCocktailsWithBars();
    allCocktails.value = apiRes;
    filteredCocktails.value = apiRes;

    allBars.value = await getBars();
    liquorTypes.value = await getLiquorList();
  } catch (err: any) {
    error.value = err.toString();
  } finally {
    isLoading.value = false;
  }
}

function onFilterChange(filterKey: 'bar' | 'liquor') {
  // TODO: add loading ux--maybe need a render lifecycle hook
  // MAYBE LATER: push filters to route
  switch (filterKey) {
    case 'bar':
      filteredCocktails.value = handleBarFilterUpdate(allCocktails.value ?? [], false);
      break;
    case 'liquor':
      filteredCocktails.value = handleLiquorFilterUpdate(allCocktails.value ?? [], false);
      break;
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
      <div class="span-2 justify-left">
        <button
          class="primary"
          @click.stop="showAddCocktailModal = true"
          :disabled="!isUserLoggedIn"
        >
          Add Cocktail
        </button>
      </div>
      <div class="span-2">
        <select :disabled="isLoading" v-model="selectedBarFilter" @change="onFilterChange('bar')">
          <option>All bars</option>
          <option v-for="bar in allBars" :key="bar.id" :value="bar.id">{{ bar.name }}</option>
        </select>
      </div>
      <div class="span-2">
        <select
          :disabled="isLoading"
          v-model="selectedLiquorFilter"
          @change="onFilterChange('liquor')"
        >
          <option>All spirits</option>
          <option v-for="type in liquorTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <search-box />
    </context-menu>
    <layout-container>
      <div v-if="isLoading">LOADING</div>
      <cocktail-box
        v-else
        v-for="cocktail in filteredCocktails"
        :key="cocktail.id"
        :cocktail="cocktail"
      >
      </cocktail-box>
    </layout-container>
  </div>

  <!-- modals -->

  <transition name="modal">
    <add-edit-cocktail-modal
      v-if="showAddCocktailModal"
      :existingCocktailInfo="null"
      :userId="+authStore.userId"
      @close="showAddCocktailModal = false"
    />
  </transition>
</template>
