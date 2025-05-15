<script setup lang="ts">
import { type CocktailBoxItem, type ListItem } from '../models';
import TrashIcon from './TrashIcon.vue';
import { ref } from 'vue';

const props = withDefaults(
  defineProps<{
    cocktail: CocktailBoxItem;
    addedToListDate?: string;
    listItem?: ListItem;
    deleteListItemCallback?: (listItem: ListItem) => void;
  }>(),
  {},
);

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
        <li>
          {{ props.cocktail.avg_rating }}
        </li>
        <li v-if="!!props.addedToListDate" class="list-info">
          Added on {{ props.addedToListDate }}
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
</style>
