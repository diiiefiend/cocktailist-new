<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';

import { getCocktailsWithBars, getBars, getLiquorList } from '../api.js';
import { useAuthStore } from '../stores/auth.js';
import type { Bar, CocktailItem } from '../models.js';
import router from '../router/index.js';
import { ALL_BARS, ALL_SPIRITS } from '../utils.js';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import CocktailBox from '../components/CocktailBox.vue';
import SearchBox from '../components/SearchBox.vue';

import AddEditCocktailModal from './modals/AddEditCocktailModal.vue';

const authStore = useAuthStore();

const isLoading = ref(true);
const error = ref(null);

const isUserLoggedIn = authStore.checkIsUserLoggedIn();
const allCocktails: Ref<null | Array<CocktailItem>> = ref(null);
const allBars: Ref<null | Array<Bar>> = ref(null);
const liquorTypes: Ref<null | string[]> = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);

const showAddCocktailModal = ref(false);
const selectedBarFilter: Ref<null | number | string> = ref(ALL_BARS);
const selectedLiquorFilter: Ref<null | string> = ref(ALL_SPIRITS);
const filteredCocktails: Ref<null | undefined | Array<CocktailItem>> = ref(null);

const handleBarFilterUpdate = (
  initialCocktailList: Array<CocktailItem>,
  isInternalCall: boolean,
) => {
  let result: Array<CocktailItem> = initialCocktailList;
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
  initialCocktailList: Array<CocktailItem>,
  isInternalCall: boolean,
) => {
  let result: Array<CocktailItem> = initialCocktailList;

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
    allCocktails.value = apiRes.cocktails;
    filteredCocktails.value = apiRes.cocktails;
    currentPage.value = apiRes.currentPage;
    totalPages.value = apiRes.totalPages;

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

function onCocktailCreate(createdCocktail: CocktailItem) {
  router.push(`/cocktails/${createdCocktail.id}`);
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
          <option>{{ ALL_BARS }}</option>
          <option v-for="bar in allBars" :key="bar.id" :value="bar.id">{{ bar.name }}</option>
        </select>
      </div>
      <div class="span-2">
        <select
          :disabled="isLoading"
          v-model="selectedLiquorFilter"
          @change="onFilterChange('liquor')"
        >
          <option>{{ ALL_SPIRITS }}</option>
          <option v-for="type in liquorTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <search-box />
    </context-menu>
    <div v-if="isLoading" class="loader">LOADING</div>
    <layout-container v-else>
      <cocktail-box v-for="cocktail in filteredCocktails" :key="cocktail.id" :cocktail="cocktail">
      </cocktail-box>
    </layout-container>
  </div>

  <!-- modals -->

  <transition name="modal">
    <add-edit-cocktail-modal
      v-if="showAddCocktailModal"
      :existingCocktailInfo="null"
      :userId="+authStore.userId!"
      :allBars="allBars ?? []"
      :onSubmitCallback="onCocktailCreate"
      @close="showAddCocktailModal = false"
    />
  </transition>
</template>
