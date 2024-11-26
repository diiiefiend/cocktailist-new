<script setup lang="ts">
import { ref } from 'vue';

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

import { type ReviewItem } from '../models';
import { mockCocktailDetailData, mockReviewData, mockBarData, mockListsData } from '../mocks';

const props = defineProps<{
  id: string;
}>();

const reviews = mockReviewData;
const cocktail = props.id === '1' ? mockCocktailDetailData[0] : mockCocktailDetailData[1];
const bar = mockBarData.find((bar) => bar.id === cocktail.bar.id)!;
const scatterChartData = {
  xValues: mockReviewData.map((review: ReviewItem) => review.spiritedRating),
  yValues: mockReviewData.map((review: ReviewItem) => review.innovativeRating),
};
const lists = mockListsData;
const selectedLists = [mockListsData[1]];

const showReviewModal = ref(false);
const showListsModal = ref(false);
</script>

<template>
  <div id="cocktail-view">
    <context-menu>
      <div class="row-gap-1"></div>
      <div class="span-3 justify-left">
        <!-- TODO: if user is not logged in, these 2 buttons should be disabled (with a tooltip?) -->
        <!-- TODO: if a review exists, then this should say "edit review" -->
        <button class="primary" @click.stop="showReviewModal = true">Add Review</button>
        <button class="primary" @click.stop="showListsModal = true">Modify Lists</button>
      </div>
      <div class="span-2">
        Listed in: <a href="">{{ selectedLists.map((list) => list.name).join(', ') }}</a>
      </div>
      <div class="span-1 justify-right">
        <!-- TODO: if user is not logged in, this button should be disabled (with a tooltip?) -->
        <button class="secondary">Edit Entry</button>
      </div>
      <search-box />
    </context-menu>
    <layout-container>
      <!-- main content -->
      <grid-box :width="6" :startCol="1" :applyBoxStyle="false">
        <!-- grids in grids so the left and right content areas can flow independently--at least until there's native masonry -->
        <layout-container>
          <grid-box :width="10">
            <cocktail-detail :cocktail="cocktail"></cocktail-detail>
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
              :rating-value="cocktail.rating"
              :show-total="true"
              :total-ratings="cocktail.totalRatings"
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
              <a href="#!">View stats for {{ cocktail.type }} drinks</a>
            </div>
          </grid-box>
          <grid-box :width="10">
            <h2>{{ bar.name }}</h2>
            {{ bar.address }}
            <div class="placeholder-box"></div>
            <div class="teaser-link">
              <router-link :to="{ name: 'Bar', params: { id: cocktail.bar.id } }"
                >View all drinks</router-link
              >
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
      :cocktailId="cocktail.id"
      :cocktailName="cocktail.name"
      :userId="2"
      @close="showReviewModal = false"
    />
  </transition>
  <transition name="modal">
    <lists-modal
      v-if="showListsModal"
      :cocktailId="cocktail.id"
      :cocktailName="cocktail.name"
      :userId="2"
      :lists="lists"
      :selectedLists="selectedLists"
      @close="showListsModal = false"
    />
  </transition>
</template>
