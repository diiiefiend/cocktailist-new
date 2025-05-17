<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

import { getBarCocktails, getBars } from '../api.js';
import { useAuthStore } from '../stores/auth.js';
import type { BarDetails, CocktailDetailItem } from '../models.js';
import router from '../router/index.js';
import { ALL_SPIRITS, FLOURISH_IMG, DATE_FORMATTING } from '../utils.js';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import GridBox from '../components/GridBox.vue';
import CocktailBox from '../components/CocktailBox.vue';
import SearchBox from '../components/SearchBox.vue';

import AddEditCocktailModal from './modals/AddEditCocktailModal.vue';

const authStore = useAuthStore();

const props = withDefaults(
  defineProps<{
    id?: string;
  }>(),
  {
    id: '1',
  },
);

const isLoading = ref(true);
const error = ref(null);

const allBars: Ref<Array<BarDetails>> = ref([]);
const bar: Ref<null | BarDetails> = ref(null);
const cocktails: Ref<Array<CocktailDetailItem>> = ref([]);
const liquorTypes: Ref<null | string[]> = ref(null);

const showAddCocktailModal = ref(false);
const selectedLiquorFilter: Ref<null | string> = ref(ALL_SPIRITS);
const filteredCocktails: Ref<null | undefined | Array<CocktailDetailItem>> = ref(null);

const isUserLoggedIn = authStore.checkIsUserLoggedIn();
// TODO: implement edit bar modal
const showEditBarModal = ref(false);

const setLiquorTypes = () => {
  liquorTypes.value = [...new Set(cocktails.value.map((cocktail) => cocktail.liquor))];
};

const fetchBarCocktails = async (barId: number) => {
  const barCocktails = await getBarCocktails('' + barId);
  cocktails.value = barCocktails;

  filteredCocktails.value = barCocktails;
  setLiquorTypes();

  selectedLiquorFilter.value = ALL_SPIRITS;
};

async function fetchData() {
  error.value = null;
  isLoading.value = true;

  try {
    let barId;
    if (props.id === '' || props.id === undefined) {
      barId = '1';
      // useRouter().push({ name: 'Bar', params: { id: barId } });
    } else {
      barId = props.id;
    }

    allBars.value = await getBars();
    bar.value = allBars.value.find((bar: BarDetails) => bar.id === +barId) || null;

    fetchBarCocktails(+barId);
  } catch (err: any) {
    error.value = err.toString();
  } finally {
    isLoading.value = false;
  }
}

async function onBarUpdate() {
  if (bar.value) {
    fetchBarCocktails(bar.value.id);
    // MAYBE LATER: push id & filters into router URL?
  }
}

function onFilterChange() {
  let result: Array<CocktailDetailItem> = cocktails.value;

  if (selectedLiquorFilter.value !== ALL_SPIRITS) {
    result = result.filter((cocktail) => cocktail.liquor === selectedLiquorFilter.value);
  }

  console.log('filtered for: ', selectedLiquorFilter.value);
  filteredCocktails.value = result;
}

function onCocktailCreate(createdCocktail: CocktailDetailItem) {
  router.push(`/cocktails/${createdCocktail.id}`);
}

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div id="bar-view">
    <context-menu>
      <div class="row-gap-1"></div>
      <div class="span-2 justify-left">
        <button
          class="primary"
          :disabled="!isUserLoggedIn"
          @click.stop="showAddCocktailModal = true"
        >
          Add Cocktail
        </button>
      </div>
      <div class="span-2">
        <select :disabled="isLoading" v-model="bar" @change="onBarUpdate">
          <option v-for="bar in allBars" :key="bar.id" :value="bar">{{ bar.name }}</option>
        </select>
      </div>
      <div class="span-2">
        <select :disabled="isLoading" v-model="selectedLiquorFilter" @change="onFilterChange">
          <option>{{ ALL_SPIRITS }}</option>
          <option v-for="type in liquorTypes" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <search-box />
    </context-menu>
    <div v-if="isLoading">LOADING</div>
    <layout-container v-else>
      <grid-box :width="3" :startCol="1" :applyBoxStyle="true" class="bar-details-box">
        <h2>{{ bar!.name }}</h2>
        <h3>{{ bar!.address }}</h3>
        <img class="divider" :src="FLOURISH_IMG" alt="" width="110" />
        {{ cocktails.length }} entries<br />
        Last updated:
        <em>{{ new Date(cocktails[0]?.updated_at).toLocaleString('en-US', DATE_FORMATTING) }}</em>
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
      <cocktail-box v-for="cocktail in filteredCocktails" :key="cocktail.id" :cocktail="cocktail">
      </cocktail-box>
    </layout-container>
  </div>

  <!-- modals -->

  <transition name="modal">
    <add-edit-cocktail-modal
      v-if="showAddCocktailModal"
      :existingCocktailInfo="null"
      :userId="+authStore.userId"
      :allBars="allBars ?? []"
      :onSubmitCallback="onCocktailCreate"
      @close="showAddCocktailModal = false"
    />
  </transition>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/views/bar.scss';
</style>
