<script setup lang="ts">
import { type CocktailDetailItem } from '../models';

const props = defineProps<{
  cocktail: CocktailDetailItem;
  barId: number;
  barName: string;
}>();
</script>

<template>
  <div>
    <h1 class="colored-by-type" :class="props.cocktail.liquor">
      {{ props.cocktail.name }}
      <span class="type">
        <!-- eslint-disable-next-line -->
        (<a href="">{{ props.cocktail.liquor }}</a
        >)
      </span>
    </h1>
    <div class="cocktail-image">
      <img :src="props.cocktail.img_file_name" :alt="props.cocktail.name + ' image'" />
    </div>
    <h2>
      from
      <router-link :to="{ name: 'Bar', params: { id: props.barId } }">{{
        props.barName
      }}</router-link>
    </h2>
    <h2>Ingredients:</h2>
    <ul class="ingredients">
      <li v-for="ingredient in props.cocktail.ingredients.split(',')" :key="ingredient">
        {{ ingredient }}
      </li>
    </ul>
  </div>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/cocktail-detail.scss';
</style>
