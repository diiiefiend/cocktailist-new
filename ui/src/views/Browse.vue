<script setup lang="ts">
import { ref } from 'vue';

import { mockBarData, mockCocktailData } from '../mocks.js';
import { DRINK_TYPES } from '../models.js';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import CocktailBox from '../components/CocktailBox.vue';
import SearchBox from '../components/SearchBox.vue';
import AddEditCocktailModal from './modals/AddEditCocktailModal.vue';

const cocktails = mockCocktailData;
const allBars = mockBarData;

let showAddCocktailModal = ref(false);
</script>

<template>
  <div id="browse">
    <context-menu>
      <div class="row-gap-1"></div>
      <div class="span-2 justify-left">
        <!-- TODO: disable this button if user isn't logged in -->
        <button class="primary" @click.stop="showAddCocktailModal = true">Add Cocktail</button>
      </div>
      <div class="span-2">
        <select>
          <option>All bars</option>
          <option v-for="bar in allBars" :key="bar.id" :value="bar.id">{{ bar.name }}</option>
        </select>
      </div>
      <div class="span-2">
        <select>
          <option>All spirits</option>
          <option v-for="type in DRINK_TYPES" :key="type" :value="type">{{ type }}</option>
        </select>
      </div>
      <search-box />
    </context-menu>
    <layout-container>
      <cocktail-box v-for="cocktail in cocktails" :key="cocktail.id" :cocktail="cocktail">
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
