<script setup lang="ts">
import { ref, onMounted, type Ref } from 'vue';

import { getCocktailsWithBars, getBars, getSpiritList } from '../api.js';
import { useAuthStore } from '../stores/auth.js';
import type { Bar, CocktailItem, DRINK_TYPES } from '../models.js';
import router from '../router/index.js';
import { ALL_BARS, ALL_SPIRITS } from '../utils.js';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import CocktailBox from '../components/CocktailBox.vue';
import SearchBox from '../components/SearchBox.vue';

import AddEditCocktailModal from './modals/AddEditCocktailModal.vue';

type ValidSpiritFilterValue = DRINK_TYPES | typeof ALL_SPIRITS;

const authStore = useAuthStore();

const props = defineProps<{
  spirit?: DRINK_TYPES;
  page?: string; // really a number, but it's coming from a query param
}>();

const isLoading = ref(true);
const error = ref(null);

const isUserLoggedIn = authStore.checkIsUserLoggedIn();
const allCocktails: Ref<null | Array<CocktailItem>> = ref(null);
const allBars: Ref<null | Array<Bar>> = ref(null);
const spiritTypes: Ref<null | string[]> = ref(null);
const currentPage = ref(1);
const totalPages = ref(1);

const showAddCocktailModal = ref(false);
const selectedBarFilter: Ref<null | number | string> = ref(ALL_BARS);
const selectedSpiritFilter: Ref<ValidSpiritFilterValue> = ref(
  props.spirit ? props.spirit : ALL_SPIRITS,
);
const filteredCocktails: Ref<null | undefined | Array<CocktailItem>> = ref(null);

const handleBarFilterUpdate = () => {
  if (selectedBarFilter.value !== ALL_BARS) {
    isLoading.value = true;
    router.push({
      name: 'Bar',
      params: { id: selectedBarFilter.value },
    });

    isLoading.value = false;
  }
};

const handleSpiritFilterUpdate = async (spirit: ValidSpiritFilterValue) => {
  isLoading.value = true;

  if (spirit !== ALL_SPIRITS) {
    router.push({
      params: { spirit: selectedSpiritFilter.value },
    });

    await fetchCocktailData(undefined, spirit);
  } else {
    router.push({
      params: { spirit: undefined },
    });

    await fetchCocktailData();
  }

  isLoading.value = false;
};

const fetchCocktailData = async (pageNumber?: number, spirit?: DRINK_TYPES) => {
  const additionalParams: {
    page?: number;
    liquor?: DRINK_TYPES;
  } = {};
  if (pageNumber) {
    additionalParams.page = pageNumber;
  }
  if (spirit) {
    // the api and DB calls "spirit" "liquor", annoyingly
    additionalParams.liquor = spirit;
  }

  const apiRes = await getCocktailsWithBars(additionalParams);
  allCocktails.value = apiRes.cocktails;
  filteredCocktails.value = apiRes.cocktails;
  currentPage.value = apiRes.currentPage;
  totalPages.value = apiRes.totalPages;
};

async function fetchInitialData() {
  error.value = null;
  isLoading.value = true;

  try {
    await fetchCocktailData(props.page ? +props.page : undefined, props.spirit);
    allBars.value = await getBars();
    spiritTypes.value = await getSpiritList();
  } catch (err: any) {
    error.value = err.toString();
  } finally {
    isLoading.value = false;
  }
}

function onCocktailCreate(createdCocktail: CocktailItem) {
  router.push({
    name: 'Cocktail',
    params: { id: createdCocktail.id },
  });
}

async function fetchPage(
  pageNumber: number,
  selectedSpiritFilter?: DRINK_TYPES | typeof ALL_SPIRITS,
) {
  isLoading.value = true;
  error.value = null;

  const spirit = selectedSpiritFilter === ALL_SPIRITS ? undefined : selectedSpiritFilter;

  router.push({
    params: { spirit },
    query: { page: pageNumber },
  });

  try {
    await fetchCocktailData(pageNumber, spirit);
    currentPage.value = pageNumber;
  } catch (err: any) {
    error.value = err.toString();
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await fetchInitialData();
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
        <select :disabled="isLoading" v-model="selectedBarFilter" @change="handleBarFilterUpdate()">
          <option>{{ ALL_BARS }}</option>
          <option v-for="bar in allBars" :key="bar.id" :value="bar.id">{{ bar.name }}</option>
        </select>
      </div>
      <div class="span-2">
        <select
          :disabled="isLoading"
          v-model="selectedSpiritFilter"
          @change="handleSpiritFilterUpdate(selectedSpiritFilter)"
        >
          <option>{{ ALL_SPIRITS }}</option>
          <option v-for="type in spiritTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <search-box />
    </context-menu>
    <div v-if="isLoading" class="loader">LOADING</div>
    <layout-container v-else>
      <cocktail-box v-for="cocktail in filteredCocktails" :key="cocktail.id" :cocktail="cocktail">
      </cocktail-box>
    </layout-container>
    <div v-if="totalPages > 1" class="pages-list">
      <ul>
        <li>Page</li>
        <li v-for="pageNumber in totalPages" :key="pageNumber">
          <button
            :class="{ 'link-button': true, active: pageNumber === currentPage }"
            @click.stop="fetchPage(pageNumber, selectedSpiritFilter)"
          >
            {{ pageNumber }}
          </button>
        </li>
      </ul>
    </div>
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
