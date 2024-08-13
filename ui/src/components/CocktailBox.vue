<script setup lang="ts">
import { type CocktailBoxItem } from '../models';
import { ref } from 'vue';

const props = defineProps<{
  cocktail: CocktailBoxItem;
}>();

const hovered = ref(false);
</script>

<template>
  <div class="cocktail-box" @mouseover="hovered = true" @mouseleave="hovered = false">
    <RouterLink :to="{ name: 'Cocktail', params: { id: props.cocktail.id } }">
      <h3 :class="{ hovered }">
        {{ props.cocktail.name }}
      </h3>
      <ul
        class="details colored-by-type"
        :class="[hovered ? `hovered ${props.cocktail.type}` : props.cocktail.type]"
      >
        <li>{{ props.cocktail.bar }}</li>
        <li>{{ props.cocktail.rating }}</li>
        <li class="label">{{ props.cocktail.type }}</li>
      </ul>
    </RouterLink>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/cocktail-box.scss';
</style>
