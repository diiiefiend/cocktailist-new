<script setup lang="ts">
import { onMounted, ref, type Ref } from 'vue';

import router from '../router';
import { logout } from '../api';
import { useAuthStore } from '../stores/auth';

import ContextMenu from '../components/ContextMenu.vue';
import LayoutContainer from '../components/LayoutContainer.vue';
import GridBox from '../components/GridBox.vue';

const authStore = useAuthStore();
let isUserLoggedIn = authStore.checkIsUserLoggedIn();

const errors: Ref<string[]> = ref([]);

async function onLogout() {
  try {
    await logout();

    authStore.$patch((state) => {
      state.isUserLoggedIn = false;
      state.username = null;
    });

    router.push('/');
  } catch (e) {
    // @ts-ignore
    errors.value.push(e);
  }
}

onMounted(() => {
  if (!isUserLoggedIn) {
    router.push('/login');
  }
});
</script>

<template>
  <div v-if="isUserLoggedIn">
    <context-menu>
      <div class="row-gap-1"></div>
      <div class="span-2 justify-left">
        <button class="primary" @click="onLogout">Logout</button>
      </div>
    </context-menu>
    <layout-container>
      <grid-box :width="6" :startCol="3" :applyBoxStyle="true" class="bar-details-box">
        <h1>Account</h1>
        <p>TODO</p>
      </grid-box>
    </layout-container>
  </div>
</template>
