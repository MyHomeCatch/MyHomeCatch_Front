<template>
  <div
    class="position-relative mx-auto"
    style="max-width: 820px; overflow: visible"
  >
    <button class="carousel-arrow start" @click="scrollLeft">
      <i class="bi bi-chevron-left"></i>
    </button>
    <button class="carousel-arrow end" @click="scrollRight">
      <i class="bi bi-chevron-right"></i>
    </button>

    <div
      class="d-flex px-4 gap-3"
      ref="scrollContainer"
      style="scroll-behavior: smooth; overflow-x: auto"
    >
      <FavoritesCard v-for="(item, i) in items" :key="i" :item="item" />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import FavoritesCard from './FavoritesCard.vue';
defineProps({ items: Array });
const scrollContainer = ref(null);
const scrollLeft = () =>
  scrollContainer.value.scrollBy({ left: -196, behavior: 'smooth' });
const scrollRight = () =>
  scrollContainer.value.scrollBy({ left: 196, behavior: 'smooth' });
</script>

<style scoped>
.d-flex::-webkit-scrollbar {
  display: none;
}
.d-flex {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

/* 화살표 */
.carousel-arrow {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 34px;
  height: 34px;
  border: none;
  background-color: white;
  border-radius: 50%;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  color: #333;
  z-index: 2;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}
.carousel-arrow:hover {
  background-color: #f0f0f0;
}
.carousel-arrow.start {
  left: -12px;
}
.carousel-arrow.end {
  right: -12px;
}
</style>
