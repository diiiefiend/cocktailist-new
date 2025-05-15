<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

import type { BarDetails, CocktailDetailItem, List, ReviewItem } from '../models';
import { getCocktail, getCocktailReviews, getLists } from '../api';
import { useAuthStore } from '../stores/auth';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import GridBox from '../components/GridBox.vue';
import CocktailDetail from '../components/CocktailDetail.vue';
import ReviewList from '../components/ReviewList.vue';
import RatingItem from '../components/RatingItem.vue';
import ScatterChart from '../components/ScatterChart.vue';
import SearchBox from '../components/SearchBox.vue';

import ReviewModal from './modals/ReviewModal.vue';
import ListsModal from './modals/ListsModal.vue';

const props = defineProps<{
  id: string;
}>();

let isLoading = ref(true);
let error = ref(null);

let isUserLoggedIn = useAuthStore().checkIsUserLoggedIn();
let cocktail: Ref<null | CocktailDetailItem> = ref(null);
let bar: Ref<null | BarDetails> = ref(null);
let lists: Ref<Array<List>> = ref([]);
let selectedLists: Ref<Array<List>> = ref([]);
let reviews: Ref<Array<ReviewItem>> = ref([]);
let scatterChartData: Ref<{ xValues: Array<number>; yValues: Array<number> }> = ref({
  xValues: [],
  yValues: [],
});

const showReviewModal = ref(false);
const showListsModal = ref(false);

async function fetchData() {
  error.value = null;
  isLoading.value = true;

  try {
    cocktail.value = await getCocktail(props.id);
    bar.value = cocktail.value!.bar;
    lists.value = await getLists();
    selectedLists.value = lists.value.length ? [lists.value![0]] : [];

    reviews.value = await getCocktailReviews(props.id);
    scatterChartData.value = {
      xValues: reviews.value.map((review: ReviewItem) => review.scale_spirited),
      yValues: reviews.value.map((review: ReviewItem) => review.scale_composition),
    };
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
  <div id="cocktail-view">
    <context-menu>
      <div class="row-gap-1"></div>
      <div class="span-3 justify-left">
        <!-- TODO: if user is not logged in, these 2 buttons should be disabled (with a tooltip?) -->
        <!-- TODO: if a review exists, then this should say "edit review" -->
        <button class="primary" @click.stop="showReviewModal = true" :disabled="!isUserLoggedIn">
          Add Review
        </button>
        <button class="primary" @click.stop="showListsModal = true" :disabled="!isUserLoggedIn">
          Modify Lists
        </button>
      </div>
      <div class="span-2">
        Listed in:
        <router-link
          v-for="list in selectedLists"
          :to="{ name: 'List', params: { id: list.id } }"
          :key="list.id"
        >
          {{ list.name }}
        </router-link>
      </div>
      <div class="span-1 justify-right">
        <!-- TODO: if user is not logged in, this button should be disabled (with a tooltip?) -->
        <button class="secondary" :disabled="!isUserLoggedIn">Edit Entry</button>
      </div>
      <search-box />
    </context-menu>
    <div v-if="isLoading">LOADING</div>
    <layout-container v-else>
      <!-- main content -->
      <grid-box :width="6" :startCol="1" :applyBoxStyle="false">
        <!-- grids in grids so the left and right content areas can flow independently--at least until there's native masonry -->
        <layout-container>
          <grid-box :width="10">
            <cocktail-detail
              :cocktail="cocktail!"
              :bar-name="bar!.name"
              :bar-id="bar!.id"
            ></cocktail-detail>
          </grid-box>
          <grid-box :width="10">
            <h1 class="reviews">Guests say...</h1>
            <review-list :reviews="reviews"></review-list>
          </grid-box>
        </layout-container>
      </grid-box>
      <!-- sidebar -->
      <grid-box :width="4" :startCol="7" :applyBoxStyle="false">
        <layout-container>
          <grid-box :width="10">
            <h2>Stats</h2>
            <rating-item
              :rating-value="cocktail!.avg_rating"
              :show-total="true"
              :total-ratings="reviews.length"
              :show-divider="true"
            ></rating-item>
            <scatter-chart
              :x-values="scatterChartData.xValues"
              :y-values="scatterChartData.yValues"
              x-label="spirited"
              y-label="innovative"
              :is-drink-stats="true"
            ></scatter-chart>
            <div class="teaser-link">
              <router-link :to="{ name: 'Data' }">
                View stats for {{ cocktail!.liquor }} drinks
              </router-link>
            </div>
          </grid-box>
          <grid-box :width="10">
            <h2>{{ bar!.name }}</h2>
            {{ bar!.address }}
            <div class="placeholder-box"></div>
            <div class="teaser-link">
              <router-link :to="{ name: 'Bar', params: { id: bar!.id } }">
                View all drinks
              </router-link>
            </div>
          </grid-box>
        </layout-container>
      </grid-box>
    </layout-container>
  </div>

  <!-- modals -->

  <transition name="modal">
    <review-modal
      v-if="showReviewModal"
      :cocktailId="cocktail!.id"
      :cocktailName="cocktail!.name"
      :userId="2"
      @close="showReviewModal = false"
    />
  </transition>
  <transition name="modal">
    <lists-modal
      v-if="showListsModal"
      :cocktailId="cocktail!.id"
      :cocktailName="cocktail!.name"
      :userId="2"
      :lists="lists"
      :selectedLists="selectedLists"
      @close="showListsModal = false"
    />
  </transition>
</template>
