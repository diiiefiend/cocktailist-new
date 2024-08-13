<script setup lang="ts">
import { type CocktailDetailItem } from '../models';

const props = defineProps<{
  cocktail: CocktailDetailItem;
}>();
</script>

<template>
  <div>
    <h1 class="colored-by-type" :class="props.cocktail.type">
      {{ props.cocktail.name }}
      <span class="type">
        <!-- eslint-disable-next-line -->
        (<a href="">{{ props.cocktail.type }}</a
        >)
      </span>
    </h1>
    <div class="cocktail-image">
      <img :src="props.cocktail.imgUrl" :alt="props.cocktail.name + ' image'" />
    </div>
    <h2>
      from <a href="">{{ props.cocktail.bar }}</a>
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
