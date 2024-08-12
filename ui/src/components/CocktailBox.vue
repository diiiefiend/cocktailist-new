<script setup lang="ts">
  import { CocktailBoxItem } from "../models";

  defineProps<{
    cocktail: CocktailBoxItem,
  }>();

  const hovered = false;
</script>

<template>
  <div
    class="cocktail-box"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
  >
    <router-link :to="'/cocktail/' + cocktail.id">
      <h3 :class="{ hovered }">
        {{ cocktail.name }}
      </h3>
      <ul
        class="details colored-by-type"
        :class="[hovered ? `hovered ${cocktail.type}` : cocktail.type]"
      >
        <li>{{ cocktail.bar }}</li>
        <li>{{ cocktail.rating }}</li>
        <li class="label">{{ cocktail.type }}</li>
      </ul>
    </router-link>
  </div>
</template>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  @import "../assets/styles/components/cocktail-box.scss";
</style>
