<script setup lang="ts">
import { onMounted, useTemplateRef, ref, type Ref } from 'vue';

import { getBarCocktails, getBars } from '../api.js';
import { useAuthStore } from '../stores/auth.js';
import type { BarDetails, CocktailItem } from '../models.js';
import router from '../router/index.js';
import { ALL_SPIRITS, FLOURISH_IMG, DATE_FORMATTING } from '../utils.js';
import { getMap, getPlaceDetails } from '../google.js';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import GridBox from '../components/GridBox.vue';
import CocktailBox from '../components/CocktailBox.vue';
import SearchBox from '../components/SearchBox.vue';

import AddEditCocktailModal from './modals/AddEditCocktailModal.vue';
import EditBarModal from './modals/EditBarModal.vue';

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
const googleMapEl = useTemplateRef('googleMapEl');

const allBars: Ref<Array<BarDetails>> = ref([]);
const bar: Ref<null | BarDetails> = ref(null);
const cocktails: Ref<Array<CocktailItem>> = ref([]);
const liquorTypes: Ref<null | string[]> = ref(null);
const barDays: Ref<string[]> = ref([]);
const barHours: Ref<string[]> = ref([]);
const barSite: Ref<null | string> = ref(null);

const showAddCocktailModal = ref(false);
const selectedLiquorFilter: Ref<null | string> = ref(ALL_SPIRITS);
const filteredCocktails: Ref<null | undefined | Array<CocktailItem>> = ref(null);

const isUserLoggedIn = authStore.checkIsUserLoggedIn();
const showEditBarModal = ref(false);

const setLiquorTypes = () => {
  liquorTypes.value = [...new Set(cocktails.value.map((cocktail) => cocktail.liquor).sort())];
};

const fetchBarCocktails = async (barId: number) => {
  const barCocktails = await getBarCocktails(barId);
  cocktails.value = barCocktails;

  filteredCocktails.value = barCocktails;
  setLiquorTypes();

  selectedLiquorFilter.value = ALL_SPIRITS;
};

const fetchBarGoogleInfo = async (bar: BarDetails) => {
  if (googleMapEl.value) {
    await getMap(googleMapEl.value, bar);
  }

  const placeDetails = await getPlaceDetails(bar);
  const barDaysAndHours = placeDetails.hours ?? [];

  barDays.value = [];
  barHours.value = [];

  if (!barDaysAndHours.length) {
    barDays.value = ['Hours of operation not available'];
  } else {
    barDaysAndHours.forEach((info: any) => {
      const infoArr = info.split(': ');
      barDays.value.push(infoArr[0]);
      barHours.value.push(infoArr[1]);
    });
  }

  barSite.value = placeDetails.website ?? null;
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
    fetchBarGoogleInfo(bar.value);
    // MAYBE LATER: push id & filters into router URL?
  }
}

function onFilterChange() {
  let result: Array<CocktailItem> = cocktails.value;

  if (selectedLiquorFilter.value !== ALL_SPIRITS) {
    result = result.filter((cocktail) => cocktail.liquor === selectedLiquorFilter.value);
  }

  console.log('filtered for: ', selectedLiquorFilter.value);
  filteredCocktails.value = result;
}

function onCocktailCreate(createdCocktail: CocktailItem) {
  router.push(`/cocktails/${createdCocktail.id}`);
}

async function onBarDetailsUpdate(updatedBar: BarDetails) {
  if (bar.value) {
    if (bar.value.address !== updatedBar.address) {
      fetchBarGoogleInfo(updatedBar);
    }
    // update bar in this scope
    bar.value = updatedBar;
  }
}

onMounted(async () => {
  await fetchData();
  if (bar.value) {
    await fetchBarGoogleInfo(bar.value);
  }
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
    <div v-if="isLoading" class="loader">LOADING</div>
    <layout-container v-else>
      <grid-box :width="3" :startCol="1" :applyBoxStyle="true" class="bar-details-box">
        <h2 v-if="barSite">
          <a :href="barSite" target="_blank">{{ bar!.name }}</a>
        </h2>
        <h2 v-else>{{ bar!.name }}</h2>
        <h3>{{ bar!.address }}</h3>
        <div v-if="isUserLoggedIn" class="edit-bar-link">
          <button class="link-button edit-bar-link" @click.stop="showEditBarModal = true">
            Edit Bar Details
          </button>
        </div>
        <img class="divider" :src="FLOURISH_IMG" alt="" width="110" />
        {{ cocktails.length }} entries<br />
        <span class="last-updated">
          Updated
          {{ new Date(cocktails[0]?.updated_at).toLocaleString('en-US', DATE_FORMATTING) }}</span
        >
      </grid-box>
      <grid-box :width="4" :startCol="4" :applyBoxStyle="true" class="map-box">
        <div ref="googleMapEl" class="placeholder-box"></div>
      </grid-box>
      <grid-box :width="3" :startCol="8" :applyBoxStyle="true" class="bar-details-box">
        <ul class="bar-hours">
          <li v-for="(day, index) in barDays" :key="day">
            <span class="day">{{ day }}</span>
            <span class="hours">{{ barHours[index] }}</span>
          </li>
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
      :userId="+authStore.userId!"
      :allBars="allBars ?? []"
      :onSubmitCallback="onCocktailCreate"
      @close="showAddCocktailModal = false"
    />
  </transition>
  <transition name="modal">
    <edit-bar-modal
      v-if="showEditBarModal"
      :existingBarInfo="bar"
      :userId="+authStore.userId!"
      :onSubmitCallback="onBarDetailsUpdate"
      @close="showEditBarModal = false"
    />
  </transition>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/views/bar.scss';
</style>
