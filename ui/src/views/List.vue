<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRouter } from 'vue-router';

import type { CocktailDetailItem, List, ListItem } from '../models';
import { getList, getLists } from '../api';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import GridBox from '../components/GridBox.vue';
import CocktailBox from '../components/CocktailBox.vue';
import SearchBox from '../components/SearchBox.vue';

import AddEditListModal from './modals/AddEditListModal.vue';

// unfort "withDefaults" doesn't seem to work with route params,
// so we do some bespoke redirection below
const props = defineProps<{
  id?: string;
}>();

let isLoading = ref(true);
let error = ref(null);

let userLists: Ref<null | List> = ref(null);
let listInfo: Ref<null | ListInfo> = ref(null);
let cocktails: Ref<null | CocktailDetailItem> = ref(null);

let showCreateListModal = ref(false);

async function fetchData() {
  error.value = null;
  isLoading.value = true;

  try {
    userLists.value = await getLists();

    let listId;
    if (props.id === '' || props.id === undefined) {
      listId = userLists.value[0].id;
      useRouter().push({ name: 'List', params: { id: listId } });
    } else {
      listId = props.id;
    }

    listInfo.value = await getList(listId);
    cocktails.value = listInfo.value.listItems.map((item: ListItem) => {
      return item.listedCocktail;
    });
  } catch (err: any) {
    error.value = err.toString();
  } finally {
    isLoading.value = false;
  }
}

onMounted(async () => {
  await fetchData();
});

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
        <select v-if="userLists">
          <option v-for="list in userLists" :key="list.id" :value="list.id">{{ list.name }}</option>
        </select>
      </div>
      <div class="span-1">
        <!-- TODO: add confirmation modal -->
        <button class="secondary">Delete List</button>
      </div>
      <div class="span-1"></div>
      <search-box />
    </context-menu>
    <div v-if="isLoading">LOADING</div>
    <layout-container v-else>
      <grid-box :width="3" :startCol="1" :applyBoxStyle="true" class="list-details-box">
        <h2>{{ listInfo.name }}</h2>
        <ul>
          <li>Created on {{ listInfo.created_at }}</li>
          <li>Last updated on {{ listInfo.updated_at }}</li>
        </ul>
        <h3>{{ cocktails.length }} items</h3>
      </grid-box>
      <cocktail-box
        v-for="cocktail in cocktails"
        :key="cocktail.id"
        :cocktail="cocktail"
        :addedToListDate="
          listInfo.listItems.find((item: ListItem) => cocktail.id === item.cocktail_id)!.updated_at
        "
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
