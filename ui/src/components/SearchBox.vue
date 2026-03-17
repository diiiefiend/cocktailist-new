<script setup lang="ts">
import { ref } from 'vue';
import router from '../router/index.js';

const props = defineProps<{
  onSubmitCallback?: any;
}>();

const searchTerm: Ref<null | string> = ref(null);

async function submitSearch() {
  if (searchTerm.value) {
    // navigate to "search" page and pass along searchTerm as prop
    console.log(searchTerm.value);

    if (props.onSubmitCallback) {
      props.onSubmitCallback(searchTerm.value);
    } else {
      router.push(`/search?searchTerm=${searchTerm.value}`);
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
