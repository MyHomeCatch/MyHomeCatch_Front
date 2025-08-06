<template>
  <div class="recommended-section">
    <!-- 섹션 헤더 -->
    <div class="section-header">
      <h2>지원 가능한 맞춤공고</h2>
      <!-- 스크롤 버튼들 -->
      <div v-if="houses.length > 0" class="scroll-controls">
        <button
          @click="scrollLeft"
          :disabled="!canScrollLeft"
          class="scroll-button scroll-left"
          aria-label="왼쪽으로 스크롤"
        >
          ←
        </button>
        <button
          @click="scrollRight"
          :disabled="!canScrollRight"
          class="scroll-button scroll-right"
          aria-label="오른쪽으로 스크롤"
        >
          →
        </button>
      </div>
    </div>

    <!-- 로딩 상태 -->
    <div v-if="loading" class="loading-container">
      <div class="loading-skeleton">
        <div v-for="n in 10" :key="n" class="skeleton-card"></div>
      </div>
    </div>

    <!-- 추천 주택이 없는 경우 -->
    <div v-else-if="!loading && houses.length === 0" class="empty-state">
      <div class="empty-icon">🔍</div>
      <h3 class="empty-title">추천할 주택이 없습니다</h3>
      <p class="empty-description">
        현재 회원님의 조건에 맞는 주택이 없어요.<br />
        조건을 조정하시거나 나중에 다시 확인해보세요.
      </p>
      <button @click="$emit('refresh')" class="refresh-button">
        다시 찾아보기
      </button>
    </div>

    <!-- 추천 주택 목록 -->
    <div v-else class="houses-container">
      <div ref="scrollContainer" class="houses-scroll" @scroll="handleScroll">
        <div class="houses-list">
          <div
            v-for="(house, index) in houses"
            :key="house.houseId || index"
            class="house-item"
          >
            <HouseCard
              :house="house"
              @card-click="$emit('card-click', $event)"
              @toggle-favorite="$emit('toggle-favorite', $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';
import HouseCard from './HouseCard.vue';

// Props
const props = defineProps({
  houses: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  recommendationQuery: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits([
  'card-click',
  'toggle-favorite',
  'refresh',
  'go-to-search',
]);

// Refs
const scrollContainer = ref(null);

// Scroll state
const canScrollLeft = ref(false);
const canScrollRight = ref(true);

// Methods
const handleScroll = () => {
  updateScrollButtons();
};

const updateScrollButtons = () => {
  if (!scrollContainer.value) return;

  const { scrollLeft, scrollWidth, clientWidth } = scrollContainer.value;
  canScrollLeft.value = scrollLeft > 0;
  canScrollRight.value = scrollLeft < scrollWidth - clientWidth - 1;
};

const scrollLeft = () => {
  if (!scrollContainer.value) return;
  const cardWidth = 220;
  scrollContainer.value.scrollBy({
    left: -cardWidth * 2,
    behavior: 'smooth',
  });
};

const scrollRight = () => {
  if (!scrollContainer.value) return;
  const cardWidth = 220;
  scrollContainer.value.scrollBy({
    left: cardWidth * 2,
    behavior: 'smooth',
  });
};

// Watch houses prop to update scroll buttons
watch(
  () => props.houses,
  async () => {
    await nextTick();
    updateScrollButtons();
  }
);
</script>

<style scoped>
.recommended-section {
  background: white;
  padding: 4px 0 4px 0;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #222222;
}

.scroll-controls {
  display: flex;
  gap: 8px;
}

.scroll-button {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  background: white;
  color: #717171;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.scroll-button:hover:not(:disabled) {
  border-color: #ff385c;
  color: #ff385c;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.scroll-button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
  box-shadow: none;
}

.scroll-button:active:not(:disabled) {
  transform: translateY(0);
}

.header-content {
  flex: 1;
}

.section-title {
  font-size: 24px;
  font-weight: 700;
  color: #222222;
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.icon {
  font-size: 28px;
}

.section-subtitle {
  font-size: 16px;
  color: #717171;
  margin: 0;
}

.loading-container {
  width: 100%;
}

.loading-skeleton {
  display: flex;
  gap: 16px;
  overflow: hidden;
}

.skeleton-card {
  min-width: 200px;
  max-width: 210px;
  aspect-ratio: 0.8;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
}

@keyframes loading {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-title {
  font-size: 20px;
  font-weight: 600;
  color: #222222;
  margin: 0 0 12px 0;
}

.empty-description {
  font-size: 16px;
  color: #717171;
  line-height: 1.5;
  margin: 0 0 24px 0;
}

.refresh-button {
  background: #ff385c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.refresh-button:hover {
  background: #e31c5f;
  transform: translateY(-1px);
}

.houses-container {
  position: relative;
}

.houses-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
}

.houses-scroll::-webkit-scrollbar {
  display: none;
}

.houses-list {
  display: flex;
  gap: 16px;
  padding: 4px;
}

.house-item {
  position: relative;
  width: 200px;
  flex-shrink: 0;
}

.recommendation-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: linear-gradient(135deg, #ff385c, #e31c5f);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 11px;
  font-weight: 600;
  box-shadow: 0 2px 4px rgba(255, 56, 92, 0.3);
  z-index: 10;
}

.badge-text {
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

.view-more {
  margin-top: 24px;
  text-align: center;
  padding-top: 20px;
  border-top: 1px solid #e0e0e0;
}

.view-more-link {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  color: #ff385c;
  text-decoration: none;
  font-size: 16px;
  font-weight: 600;
  padding: 12px 24px;
  border: 2px solid #ff385c;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.view-more-link:hover {
  background: #ff385c;
  color: white;
  transform: translateY(-1px);
}

.arrow {
  font-size: 18px;
  transition: transform 0.2s ease;
}

.view-more-link:hover .arrow {
  transform: translateX(4px);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .recommended-section {
    padding: 16px;
    margin-bottom: 24px;
  }

  .section-header {
    flex-direction: column;
    gap: 16px;
    align-items: flex-start;
  }

  .scroll-controls {
    align-self: center;
  }

  .section-header h2 {
    font-size: 18px;
  }

  .house-item {
    max-width: 180px;
  }

  .empty-state {
    padding: 40px 16px;
  }

  .empty-icon {
    font-size: 48px;
  }

  .empty-title {
    font-size: 18px;
  }

  .empty-description {
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .houses-list {
    gap: 12px;
  }

  .house-item {
    max-width: 160px;
  }

  .scroll-button {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
}
</style>
