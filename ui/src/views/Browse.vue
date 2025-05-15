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

let isLoading = ref(true);
let error = ref(null);

// TODO: implement this UX and style disabled button
let isUserLoggedIn = useAuthStore().checkIsUserLoggedIn();
let cocktails: Ref<null | Array<CocktailBoxItem>> = ref(null);
let allBars: Ref<null | Array<Bar>> = ref(null);
let liquorTypes: Ref<null | String> = ref(null);

let showAddCocktailModal = ref(false);

async function fetchData() {
  error.value = null;
  isLoading.value = true;

  try {
    cocktails.value = await getCocktailsWithBars();
    allBars.value = await getBars();
    liquorTypes.value = await getLiquorList();
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
        <select :disabled="isLoading">
          <option>All bars</option>
          <option v-for="bar in allBars" :key="bar.id" :value="bar.id">{{ bar.name }}</option>
        </select>
      </div>
      <div class="span-2">
        <select :disabled="isLoading">
          <option>All spirits</option>
          <option v-for="type in liquorTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <search-box />
    </context-menu>
    <layout-container>
      <div v-if="isLoading">LOADING</div>
      <cocktail-box v-else v-for="cocktail in cocktails" :key="cocktail.id" :cocktail="cocktail">
      </cocktail-box>
    </layout-container>
  </div>

  <!-- modals -->

  <transition name="modal">
    <add-edit-cocktail-modal
      v-if="showAddCocktailModal"
      :existingCocktailInfo="null"
      :userId="2"
      @close="showAddCocktailModal = false"
    />
  </transition>
</template>
