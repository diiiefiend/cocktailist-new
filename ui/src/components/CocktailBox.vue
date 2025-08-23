<script setup lang="ts">
import { computed, ref } from 'vue';

import TrashIcon from './TrashIcon.vue';
import { DATE_FORMATTING } from '../utils';
import { type CocktailItem, type ListItem } from '../models';

const props = withDefaults(
  defineProps<{
    cocktail: CocktailItem;
    addedToListDate?: string;
    listItem?: ListItem;
    deleteListItemCallback?: (listItem: ListItem) => void;
  }>(),
  {},
);

const boxImage = computed(() => {
  return `url(${props.cocktail.imgUrl})`;
});

const hovered = ref(false);
</script>

<template>
  <div class="cocktail-box" @mouseover="hovered = true" @mouseleave="hovered = false">
    <router-link :to="{ name: 'Cocktail', params: { id: props.cocktail.id } }">
      <h3 :class="{ hovered }">
        {{ props.cocktail.name }}
      </h3>
      <ul
        class="details colored-by-type"
        :class="[hovered ? `hovered ${props.cocktail.liquor}` : props.cocktail.liquor]"
      >
        <li>{{ props.cocktail.bar ? props.cocktail.bar.name : '' }}</li>
        <li v-if="props.cocktail.avg_rating && props.cocktail.avg_rating > -1" class="rating">
          rated {{ props.cocktail.avg_rating }}
        </li>
        <li v-if="!!props.addedToListDate" class="list-info">
          Added on {{ new Date(props.addedToListDate).toLocaleString('en-US', DATE_FORMATTING) }}
        </li>
        <li class="label">{{ props.cocktail.liquor }}</li>
      </ul>
    </router-link>
    <button
      v-if="!!props.deleteListItemCallback && props.listItem"
      class="delete-button"
      @click.stop="props.deleteListItemCallback(props.listItem)"
    >
      <trash-icon />
    </button>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/cocktail-box.scss';

.cocktail-box {
  background-image: v-bind(boxImage);
  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  box-shadow: inset 0 0 0 2000px rgba(255, 255, 255, 0.8);
}
</style>
