<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

import type { CocktailBoxItem, CocktailDetailItem, List, ListInfo, ListItem } from '../models';
import { deleteItemFromList, deleteList, getList, getLists } from '../api';
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

const isLoading = ref(true);
const errors: Ref<string[]> = ref([]);

const currentList: Ref<List | undefined> = ref(undefined);
const userLists: Ref<Array<List>> = ref([]);
const listInfo: Ref<ListInfo | null> = ref(null);
const currentFocusedItem: Ref<ListItem | null> = ref(null);

const showCreateListModal = ref(false);
const showDeleteItemConfirmationModal = ref(false);
const showDeleteListConfirmationModal = ref(false);
const isUserLoggedIn = authStore.checkIsUserLoggedIn();

async function fetchData(activeListId?: string) {
  errors.value = [];
  isLoading.value = true;

  try {
    userLists.value = await getLists();

    if (!activeListId) {
      currentList.value = userLists.value[0];
    } else {
      currentList.value = userLists.value.find((list) => list.id === +activeListId);
    }

    await getAndSetListData();
  } catch (err: any) {
    errors.value.push = err.toString();
  } finally {
    isLoading.value = false;
  }
}

async function getAndSetListData() {
  // MAYBE LATER: push id into router URL?
  listInfo.value = await getList(currentList.value!.id);
}

const onCreateCallback = (newListId: number) => {
  fetchData('' + newListId);
};

const onClickDeleteItem = (listItem: ListItem) => {
  currentFocusedItem.value = listItem;
  showDeleteItemConfirmationModal.value = true;
};

const submitDeleteItem = async () => {
  // TODO: finish this
  console.log(currentFocusedItem.value);

  await deleteItemFromList(currentFocusedItem.value!.id);

  showDeleteItemConfirmationModal.value = false;

  getAndSetListData();
};

const submitDeleteList = async () => {
  await deleteList(currentList.value!.id);

  showDeleteListConfirmationModal.value = false;

  fetchData();
};

onMounted(async () => {
  await fetchData(props.id);
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
        <select v-if="userLists.length" v-model="currentList" @change="getAndSetListData">
          <option v-for="list in userLists" :key="list.id" :value="list">{{ list.name }}</option>
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
          <h3>{{ listInfo!.listItems.length }} items</h3>
        </grid-box>
        <cocktail-box
          v-for="item in listInfo!.listItems"
          :key="item.listedCocktail.id"
          :cocktail="item.listedCocktail"
          :addedToListDate="item.updated_at"
          :list-item="item"
          :deleteListItemCallback="onClickDeleteItem"
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
      :on-submit-callback="onCreateCallback"
      @close="showCreateListModal = false"
    />
  </transition>

  <transition name="modal">
    <confirmation-modal
      v-if="showDeleteItemConfirmationModal"
      :title="'Delete Item'"
      :modal-text="`Are you sure you want to remove '${currentFocusedItem?.listedCocktail.name}' from the list?`"
      :submit-text="'Confirm'"
      :submit-fn="submitDeleteItem"
      @close="showDeleteItemConfirmationModal = false"
    />
  </transition>

  <transition name="modal">
    <confirmation-modal
      v-if="showDeleteListConfirmationModal"
      :title="'Delete List'"
      :modal-text="`Are you sure you want to delete the list '${currentList?.name}'?`"
      :submit-text="'Confirm'"
      :submit-fn="submitDeleteList"
      @close="showDeleteListConfirmationModal = false"
    />
  </transition>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/views/list.scss';
</style>
