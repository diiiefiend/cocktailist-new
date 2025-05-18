<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

import type { BarDetails, CocktailItem, List, ReviewItem } from '../models';
import {
  deleteReview,
  getCocktail,
  getCocktailReviews,
  getListItemsForCocktail,
  getLists,
} from '../api';
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
import ListsModal from './modals/AddCocktailToListsModal.vue';
import AddEditCocktailModal from './modals/AddEditCocktailModal.vue';
import ConfirmationModal from './modals/ConfirmationModal.vue';

const props = defineProps<{
  id: string;
}>();

const authStore = useAuthStore();

const isLoading = ref(true);
const error = ref(null);
const isUserLoggedIn = authStore.checkIsUserLoggedIn();
const hasReview = ref(false);

const cocktail: Ref<null | CocktailItem> = ref(null);
const bar: Ref<null | BarDetails> = ref(null);
const lists: Ref<Array<List>> = ref([]);
const selectedLists: Ref<Array<List>> = ref([]);
const reviews: Ref<Array<ReviewItem>> = ref([]);
const scatterChartData: Ref<{ xValues: Array<number>; yValues: Array<number> }> = ref({
  xValues: [],
  yValues: [],
});
const existingReview: Ref<ReviewItem | undefined> = ref(undefined);
// currently this should always be equiv to existingReview, if both are set. but keeping them as separate values in case we ever allow multiple reviews
const activeReview: Ref<ReviewItem | null> = ref(null);

const showReviewModal = ref(false);
const showListsModal = ref(false);
const showEditCocktailModal = ref(false);
const showDeleteReviewConfirmationModal = ref(false);

const fetchReviewData = async () => {
  reviews.value = await getCocktailReviews(props.id);
  // TODO: this is not re-rendering without a refresh
  scatterChartData.value = {
    xValues: reviews.value.map((review: ReviewItem) => review.scale_spirited),
    yValues: reviews.value.map((review: ReviewItem) => review.scale_composition),
  };

  if (reviews.value) {
    existingReview.value = reviews.value.find((review) => review.user_id === +authStore.userId);
    hasReview.value = !!existingReview.value;
  }
};

async function fetchData() {
  error.value = null;
  isLoading.value = true;

  try {
    cocktail.value = await getCocktail(props.id);
    bar.value = cocktail.value!.bar;
    lists.value = await getLists();
    selectedLists.value = await getListItemsForCocktail(props.id);

    await fetchReviewData();
  } catch (err: any) {
    error.value = err.toString();
  } finally {
    isLoading.value = false;
  }
}

function onSelectedListSubmit(updatedSelectedLists: List[]) {
  selectedLists.value = updatedSelectedLists;
}

async function onEntryUpdate() {
  cocktail.value = await getCocktail(props.id);
  // TODO: the image is not re-rendering without a refresh
}

async function onReviewSubmit() {
  await fetchReviewData();
}

function onDeleteReviewClick(review: ReviewItem) {
  showDeleteReviewConfirmationModal.value = true;
  activeReview.value = review;
}

async function submitDeleteReview() {
  console.log(activeReview.value);
  await deleteReview(activeReview.value!.id);

  showDeleteReviewConfirmationModal.value = false;
  await fetchReviewData();
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
        <button class="primary" @click.stop="showReviewModal = true" :disabled="!isUserLoggedIn">
          {{ hasReview ? 'Edit Review' : 'Add Review' }}
        </button>
        <button class="primary" @click.stop="showListsModal = true" :disabled="!isUserLoggedIn">
          Modify Lists
        </button>
      </div>
      <div class="span-2">
        <span v-if="isUserLoggedIn && selectedLists.length">
          Listed in:
          <router-link
            class="selected-list-item"
            v-for="list in selectedLists"
            :to="{ name: 'List', params: { id: list.id } }"
            :key="list.id"
          >
            {{ list.name }}
          </router-link>
        </span>
      </div>
      <div class="span-1 justify-right">
        <button
          class="secondary"
          :disabled="!isUserLoggedIn"
          @click.stop="showEditCocktailModal = true"
        >
          Edit Entry
        </button>
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
            <review-list
              :reviews="reviews"
              :deleteReviewCallback="onDeleteReviewClick"
            ></review-list>
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
      :userId="+authStore.userId"
      :existingReview="existingReview"
      :onSubmitCallback="onReviewSubmit"
      @close="showReviewModal = false"
    />
  </transition>
  <transition name="modal">
    <lists-modal
      v-if="showListsModal"
      :cocktailId="cocktail!.id"
      :cocktailName="cocktail!.name"
      :userId="+authStore.userId"
      :lists="lists"
      :selectedLists="selectedLists"
      :onSubmitCallback="onSelectedListSubmit"
      @close="showListsModal = false"
    />
  </transition>
  <transition name="modal">
    <add-edit-cocktail-modal
      v-if="showEditCocktailModal"
      :existingCocktailInfo="cocktail"
      :userId="+authStore.userId"
      :allBars="[bar]"
      :onSubmitCallback="onEntryUpdate"
      @close="showEditCocktailModal = false"
    />
  </transition>
  <transition name="modal">
    <confirmation-modal
      v-if="showDeleteReviewConfirmationModal"
      :title="'Delete Review'"
      :modal-text="`Are you sure you want to delete your review?`"
      :submit-text="'Confirm'"
      :submit-fn="submitDeleteReview"
      @close="showDeleteReviewConfirmationModal = false"
    />
  </transition>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/views/cocktail.scss';
</style>
