<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import GridBox from '../components/GridBox.vue';
import CocktailBox from '../components/CocktailBox.vue';
import SearchBox from '../components/SearchBox.vue';

import AddEditListModal from './modals/AddEditListModal.vue';

import { mockCocktailData, mockListsData, mockListItemsData } from '../mocks.js';

const mockUserId = '2';

// unfort "withDefaults" doesn't seem to work with route params,
// so we do some bespoke redirection below
const props = defineProps<{
  id?: string;
}>();

let listId;
if (props.id === '' || props.id === undefined) {
  listId = mockListsData.find((list) => list.user_id === +mockUserId)!.id;
  useRouter().push({ name: 'List', params: { id: listId } });
} else {
  listId = +props.id;
}

const listInfo = mockListsData.find((list) => list.id === listId)!;

const listedItems = mockListItemsData.filter((listItem) => listItem.list_id === listId)!;

const cocktails = mockCocktailData.filter((cocktail) =>
  listedItems.some((item) => item.cocktail_id === cocktail.id),
);

let showCreateListModal = ref(false);

const deleteItemFromList = (cocktailId: number) => {
  console.log(cocktailId);
};
</script>

<template>
  <div id="browse">
    <context-menu>
      <div class="row-gap-1"></div>
      <div class="span-2 justify-left">
        <button class="primary" @click.stop="showCreateListModal = true">Create List</button>
      </div>
      <div class="span-2">
        <select>
          <option>Done and done</option>
        </select>
      </div>
      <div class="span-1">
        <!-- TODO: add confirmation modal -->
        <button class="secondary">Delete List</button>
      </div>
      <div class="span-1"></div>
      <search-box />
    </context-menu>
    <layout-container>
      <grid-box :width="3" :startCol="1" :applyBoxStyle="true" class="list-details-box">
        <h2>{{ listInfo.name }}</h2>
        <ul>
          <li>Created on {{ listInfo.created_at }}</li>
          <li>Last updated on {{ listInfo.updated_at }}</li>
        </ul>
        <h3>{{ listedItems.length }} items</h3>
      </grid-box>
      <cocktail-box
        v-for="cocktail in cocktails"
        :key="cocktail.id"
        :cocktail="cocktail"
        :addedToListDate="listedItems.find((item) => cocktail.id === item.cocktail_id)!.updated_at"
        :deleteCallback="deleteItemFromList"
      >
      </cocktail-box>
    </layout-container>
  </div>

  <!-- modals -->

  <transition name="modal">
    <add-edit-list-modal
      v-if="showCreateListModal"
      :userId="2"
      @close="showCreateListModal = false"
    />
  </transition>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/views/list.scss';
</style>
