<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

import { getBarCocktails, getBars } from '../api.js';
import { useAuthStore } from '../stores/auth.js';
import type { BarDetails, CocktailDetailItem } from '../models.js';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import GridBox from '../components/GridBox.vue';
import CocktailBox from '../components/CocktailBox.vue';
import RatingItem from '../components/RatingItem.vue';
import SearchBox from '../components/SearchBox.vue';

const props = withDefaults(
  defineProps<{
    id?: string;
  }>(),
  {
    id: '1',
  },
);

let isLoading = ref(true);
let error = ref(null);

let allBars: Ref<Array<BarDetails>> = ref([]);
let bar: Ref<null | BarDetails> = ref(null);
let cocktails: Ref<Array<CocktailDetailItem>> = ref([]);

// TODO: implement edit bar modal
let isUserLoggedIn = useAuthStore().isUserLoggedIn();
const showEditBarModal = ref(false);

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

    // TODO: feels weird to get all the bars every time. Prob can refactor to persist this list in the store or via props
    // and go back to a single bar get
    allBars.value = await getBars();
    bar.value = allBars.value.find((bar: BarDetails) => bar.id === +barId) || null;
    cocktails.value = await getBarCocktails(barId);
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
  <div id="bar-view">
    <context-menu>
      <div class="row-gap-1"></div>
      <div class="span-2 justify-left">
        <button class="primary" :disabled="!isUserLoggedIn">Add Cocktail</button>
      </div>
      <div class="span-2">
        <select v-if="allBars">
          <option v-for="bar in allBars" :key="bar.id" :value="bar.id">{{ bar.name }}</option>
        </select>
      </div>
      <div class="span-2">
        <select>
          <option>All spirits</option>
        </select>
      </div>
      <search-box />
    </context-menu>
    <div v-if="isLoading">LOADING</div>
    <layout-container v-else>
      <grid-box :width="3" :startCol="1" :applyBoxStyle="true" class="bar-details-box">
        <h2>{{ bar!.name }}</h2>
        <rating-item
          :rating-value="4"
          :show-total="true"
          :total-ratings="10"
          :show-divider="true"
        ></rating-item>
        <h3>{{ bar!.address }}</h3>
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
      <cocktail-box v-for="cocktail in cocktails" :key="cocktail.id" :cocktail="cocktail">
      </cocktail-box>
    </layout-container>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/views/bar.scss';
</style>
