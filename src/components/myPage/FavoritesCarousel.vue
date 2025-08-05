<template>
  <h3 class="section-title mb-3">즐겨찾기</h3>
  <div class="favorites-wrapper mx-auto" style="max-width: 820px">
    <div class="position-relative">
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
        <HouseCard
          v-for="(item, i) in items"
          :key="i"
          :house="item"
          :compact="true"
          @card-click="onCardClick"
          @toggle-favorite="onToggleFavorite"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import HouseCard from '../house/HouseCard.vue';

defineProps({ items: Array });
const scrollContainer = ref(null);

const scrollLeft = () =>
  scrollContainer.value.scrollBy({ left: -196, behavior: 'smooth' });
const scrollRight = () =>
  scrollContainer.value.scrollBy({ left: 196, behavior: 'smooth' });

// Optional: 이벤트 핸들링
const onCardClick = (house) => {
  console.log('카드 클릭:', house);
};

const onToggleFavorite = ({ houseId, isFavorite }) => {
  console.log('찜 상태 변경:', houseId, isFavorite);
};
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
  width: 36px;
  height: 36px;
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
  cursor: pointer;
}

.carousel-arrow:hover {
  background-color: #f0f0f0;
}
.carousel-arrow.start {
  left: -20px; /* 기존 -12px → 더 왼쪽으로 */
}

.carousel-arrow.end {
  right: -20px; /* 더 오른쪽으로 */
}

.section-title {
  font-weight: 700;
  font-size: 1.25rem;
  margin: 0 3rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}
</style>
