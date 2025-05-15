<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

import type { CocktailDetailItem, List, ListInfo, ListItem } from '../models';
import { getList, getLists } from '../api';
import { useAuthStore } from '../stores/auth';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import GridBox from '../components/GridBox.vue';
import CocktailBox from '../components/CocktailBox.vue';
import SearchBox from '../components/SearchBox.vue';

import AddEditListModal from './modals/CreateListModal.vue';
import ConfirmationModal from './modals/ConfirmationModal.vue';

// unfort "withDefaults" doesn't seem to work with route params,
// so we do some bespoke redirection below
const props = defineProps<{
  id?: string;
}>();

const authStore = useAuthStore();

let isLoading = ref(true);
let errors: Ref<string[]> = ref([]);

let currentListId: Ref<string | null> = ref(null);
let userLists: Ref<Array<List>> = ref([]);
let listInfo: Ref<ListInfo | null> = ref(null);
let cocktails: Ref<Array<CocktailDetailItem>> = ref([]);
let currentFocusedItemId: Ref<number | null> = ref(null);

let showCreateListModal = ref(false);
let showDeleteItemConfirmationModal = ref(false);
let showDeleteListConfirmationModal = ref(false);
let isUserLoggedIn = authStore.checkIsUserLoggedIn();

async function fetchData() {
  errors.value = [];
  isLoading.value = true;

  try {
    userLists.value = await getLists();

    let listId: string;
    if (props.id === '' || props.id === undefined) {
      listId = '' + userLists.value[0].id;
    } else {
      listId = props.id;
    }

    currentListId.value = listId;

    await getAndSetListData();
  } catch (err: any) {
    errors.value.push = err.toString();
  } finally {
    isLoading.value = false;
  }
}

async function getAndSetListData() {
  // maybe update route to reflect list id?
  listInfo.value = await getList(currentListId.value!);
  cocktails.value = listInfo.value!.listItems.map((item: ListItem) => {
    return item.listedCocktail;
  });
}

const onClickDeleteItem = (cocktailId: number) => {
  // TODO: finish this
  console.log(cocktailId);
  currentFocusedItemId.value = cocktailId;
  showDeleteItemConfirmationModal.value = true;
};

const deleteItemFromList = () => {
  // TODO: finish this
  console.log(currentFocusedItemId.value);
};

const deleteList = () => {
  // TODO: finish this
  console.log(currentListId);
};

onMounted(async () => {
  await fetchData();
});
</script>

<template>
  <div id="browse">
    <context-menu>
      <div class="row-gap-1"></div>
      <div class="span-2 justify-left">
        <button
          class="primary"
          @click.stop="showCreateListModal = true"
          :disabled="!isUserLoggedIn"
        >
          Create List
        </button>
      </div>
      <div class="span-2">
        <select v-if="userLists.length" v-model="currentListId" @change="getAndSetListData">
          <option v-for="list in userLists" :key="list.id" :value="list.id">{{ list.name }}</option>
        </select>
      </div>
      <div class="span-1">
        <!-- TODO: add confirmation modal -->
        <button
          class="secondary"
          :disabled="!isUserLoggedIn"
          @click.stop="showDeleteListConfirmationModal = true"
        >
          Delete List
        </button>
      </div>
      <div class="span-1"></div>
      <search-box />
    </context-menu>
    <div v-if="!isUserLoggedIn">
      <layout-container>
        <grid-box :width="6" :startCol="3" :applyBoxStyle="true" class="bar-details-box">
          <p>Requires an account. Please <a href="#">log in</a>.</p>
        </grid-box>
      </layout-container>
    </div>
    <div v-else>
      <div v-if="isLoading">LOADING</div>
      <layout-container v-else>
        <grid-box :width="4" :startCol="1" :applyBoxStyle="true" class="list-details-box">
          <h2>{{ listInfo!.name }}</h2>
          <ul>
            <li>Created on {{ listInfo!.created_at }}</li>
            <li>Last updated on {{ listInfo!.updated_at }}</li>
          </ul>
          <h3>{{ cocktails.length }} items</h3>
        </grid-box>
        <cocktail-box
          v-for="cocktail in cocktails"
          :key="cocktail.id"
          :cocktail="cocktail"
          :addedToListDate="
            listInfo!.listItems.find((item: ListItem) => cocktail.id === item.cocktail_id)!
              .updated_at
          "
          :deleteCallback="onClickDeleteItem"
        >
        </cocktail-box>
      </layout-container>
    </div>
  </div>

  <!-- modals -->

  <transition name="modal">
    <add-edit-list-modal
      v-if="showCreateListModal"
      :userId="+authStore.userId"
      @close="showCreateListModal = false"
    />
  </transition>

  <transition name="modal">
    <confirmation-modal
      v-if="showDeleteItemConfirmationModal"
      :title="'Delete Item'"
      :modal-text="`Are you sure you want to remove ${currentFocusedItemId} from the list?`"
      :submit-text="'Confirm'"
      :submit-fn="deleteItemFromList"
      @close="showDeleteItemConfirmationModal = false"
    />
  </transition>

  <transition name="modal">
    <confirmation-modal
      v-if="showDeleteListConfirmationModal"
      :title="'Delete List'"
      :modal-text="`Are you sure you want to delete the list ${currentListId}?`"
      :submit-text="'Confirm'"
      :submit-fn="deleteList"
      @close="showDeleteListConfirmationModal = false"
    />
  </transition>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/views/list.scss';
</style>
