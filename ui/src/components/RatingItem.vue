<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    ratingValue: number;
    showTotal?: boolean;
    totalRatings?: number;
    showDivider?: boolean;
  }>(),
  {
    showTotal: false,
    totalRatings: 0,
    showDivider: false,
  },
);

const img = '/images/rating-full.png';
const flourishImg = '/images/deco-flourish.jpg';

const fullValue = Math.floor(props.ratingValue);
const partialValueWidth = Math.floor(18 * (props.ratingValue % 1));

// @Component
// export default class Rating extends Vue {
//   @Prop() private ratingValue!: number;
//   @Prop({ default: false }) private showTotal!: boolean;
//   @Prop({ default: 0 }) private totalRatings!: number;
//   @Prop({ default: false }) private showDivider!: boolean;

//   img = '/images/rating-full.png';
//   flourishImg = '/images/deco-flourish.jpg';

//   fullValue = Math.floor(this.ratingValue);
//   partialValueWidth = Math.floor(18 * (this.ratingValue % 1));
// }
</script>

<template>
  <div :class="{ centered: props.showTotal }">
    <div class="rating">
      <img :src="img" v-for="val in fullValue" :key="val" alt="*" />

      <span class="partial" :style="{ width: partialValueWidth + 'px' }">
        <img :src="img" alt="*" />
      </span>
    </div>
    <p v-if="props.showTotal">(based on {{ props.totalRatings }} reviews)</p>
    <img class="divider" v-if="props.showDivider" :src="flourishImg" alt="" />
  </div>
</template>

<!-- Add 'scoped' attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '../assets/styles/components/rating.scss';
</style>
