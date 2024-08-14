<script setup lang="ts">
import { ref } from 'vue';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import GridBox from '../components/GridBox.vue';
import CocktailDetail from '../components/CocktailDetail.vue';
import ReviewList from '../components/ReviewList.vue';
import RatingItem from '../components/RatingItem.vue';
import ScatterChart from '../components/ScatterChart.vue';

import ReviewModal from './modals/ReviewModal.vue';

import { type ReviewItem } from '../models';
import { mockCocktailDetailData, mockReviewData, mockBarData } from '../mocks';

const props = defineProps<{
  id: string;
}>();

const reviews = mockReviewData;
const cocktail = props.id === '1' ? mockCocktailDetailData[0] : mockCocktailDetailData[1];
const bar = mockBarData.find((bar) => bar.id === cocktail.bar.id)!;
const scatterChartData = {
  xValues: mockReviewData.map((review: ReviewItem) => review.spiritedRating),
  yValues: mockReviewData.map((review: ReviewItem) => review.innovationRating),
};

const showReviewModal = ref(false);
</script>

<template>
  <div id="cocktail-view">
    <context-menu>
      <div class="row-gap-1"></div>
      <div class="span-3 justify-left">
        <button class="primary" @click.stop="showReviewModal = true">Add Review</button>
        <button class="primary">Modify Lists</button>
      </div>
      <div class="span-4">Listed in: <a href="">Done and Done</a></div>
      <div class="span-2 justify-right emerald">Last updated: 09.04.2020</div>
      <div class="span-1 justify-right">
        <button class="secondary">Edit Entry</button>
      </div>
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
      :userId="2"
      @close="showReviewModal = false"
    />
  </transition>
</template>
