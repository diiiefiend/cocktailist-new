<script setup lang="ts">
import { ref, type Ref } from 'vue';
import router from '../router/index.js';

const props = defineProps<{
  onSubmitCallback?: any;
}>();

const searchTerm: Ref<null | string> = ref(null);

async function submitSearch() {
  if (searchTerm.value) {
    if (props.onSubmitCallback) {
      // means we're already on the Search Results page
      props.onSubmitCallback(searchTerm.value);
    } else {
      router.push({
        name: 'Search Results',
        query: { searchTerm: searchTerm.value },
      });
    }
  }
}
</script>

<template>
  <!-- this is meant to be used within the Context Menu -->
  <div class="span-3 justify-right">
    <input id="search" v-model="searchTerm" placeholder="I have something in mind" />
  </div>
  <div class="span-1 justify-right">
    <button class="secondary" @click.stop="submitSearch">Search</button>
  </div>
</template>

<style scoped lang="scss"></style>
