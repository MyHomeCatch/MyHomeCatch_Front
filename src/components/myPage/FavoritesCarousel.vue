<template>
  <div class="favorites-wrapper mx-auto" style="max-width: 820px">
    <h2 class="section-title mb-3">즐겨찾기</h2>
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
          :isFavorite="true"
          @card-click="onCardClick"
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

// const onToggleFavorite = ({ houseId, isFavorite }) => {
//   console.log('찜 상태 변경:', houseId, isFavorite);
// };
</script>

<style scoped>
.section-title {
  font-weight: 700;
  font-size: 1.25rem;
  padding-bottom: 0.8rem;
  margin: 0 1.2rem;
  margin-bottom: 1rem;
  color: #222;
  border-bottom: 1px solid #ddd;
}

/* ✅ 카드형 wrapper 스타일 */
.favorites-wrapper {
  background-color: #f9f9f9;
  border-radius: 14px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.03);
  padding: 2rem 1rem 1.5rem; /* 상단 패딩 강화 */
  position: relative;
  overflow: hidden;
  min-height: 230px;
}

/* ✅ 카드 리스트 (가로 스크롤) */
.d-flex {
  -ms-overflow-style: none;
  scrollbar-width: none;
  overflow-x: auto;
  display: flex;
  align-items: center; /* ✨ 카드 수직 정렬 */
  min-height: 160px; /* ✨ 카드 높이에 맞춤 */
  padding-bottom: 0.5rem;
  padding-left: 1rem;
  padding-right: 1rem;
  gap: 1rem;
  scroll-behavior: smooth;
}

.d-flex::-webkit-scrollbar {
  display: none;
}

/* ✅ 화살표 버튼 */
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
  z-index: 3;
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
  left: 8px; /* ✨ wrapper 내부로 정리 */
}
.carousel-arrow.end {
  right: 8px;
}
</style>
