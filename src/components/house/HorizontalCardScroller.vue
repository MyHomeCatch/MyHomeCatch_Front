<template>
  <div class="card-scroller-section">
    <!-- 섹션 헤더 -->
    <div class="section-header">
      <h2>{{ title }}</h2>
      <!-- 스크롤 버튼들 -->
      <div v-if="cards.length > 0" class="scroll-controls">
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

    <!-- 카드가 없는 경우 -->
    <div v-else-if="!loading && cards.length === 0" class="empty-state">
      <div class="empty-icon">{{ emptyConfig.icon }}</div>
      <h3 class="empty-title">{{ emptyConfig.title }}</h3>
      <p class="empty-description" v-html="emptyConfig.description"></p>
      <button
        v-if="emptyConfig.showButton"
        @click="$emit('empty-action')"
        class="action-button"
      >
        {{ emptyConfig.buttonText }}
      </button>
    </div>

    <!-- 카드 목록 -->
    <div v-else class="cards-container">
      <div ref="scrollContainer" class="cards-scroll" @scroll="handleScroll">
        <div class="cards-list">
          <div
            v-for="(card, index) in cards"
            :key="card[keyField] || index"
            class="card-item"
          >
            <HouseCard
              :house="card"
              :favorite-list="favoriteList"
              @card-click="handleCardClick"
              @toggle-favorite="handleToggleFavorite"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue';
import HouseCard from '../house/HouseCard.vue';

// Props
const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  cards: {
    type: Array,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  keyField: {
    type: String,
    default: 'houseId',
  },
  favoriteList: {
    type: Array,
    default: () => [],
  },
  emptyConfig: {
    type: Object,
    default: () => ({
      icon: '🔍',
      title: '표시할 항목이 없습니다',
      description: '조건을 변경하거나 나중에 다시 확인해보세요.',
      showButton: true,
      buttonText: '다시 찾아보기',
    }),
  },
});

// Emits
const emit = defineEmits(['card-click', 'toggle-favorite', 'empty-action']);

// Refs
const scrollContainer = ref(null);

// Scroll state
const canScrollLeft = ref(false);
const canScrollRight = ref(true);

// Event handlers
const handleCardClick = (house) => {
  emit('card-click', house);
};

const handleToggleFavorite = (data) => {
  emit('toggle-favorite', data);
};

// favoriteList 변경 감지 (디버깅용)
watch(
  () => props.favoriteList,
  (newList, oldList) => {
    // 필요시 디버깅용 로그
    // console.log('HorizontalCardScroller favoriteList 변경 감지:',
    //   `${oldList?.length || 0} -> ${newList?.length || 0}`);
  },
  { deep: true }
);

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

// Watch cards prop to update scroll buttons
watch(
  () => props.cards,
  async () => {
    await nextTick();
    updateScrollButtons();
  }
);
</script>

<style scoped>
.card-scroller-section {
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

.action-button {
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

.action-button:hover {
  background: #e31c5f;
  transform: translateY(-1px);
}

.cards-container {
  position: relative;
}

.cards-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
}

.cards-scroll::-webkit-scrollbar {
  display: none;
}

.cards-list {
  display: flex;
  gap: 16px;
  padding: 4px;
}

.card-item {
  position: relative;
  width: 200px;
  flex-shrink: 0;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .card-scroller-section {
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

  .card-item {
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
  .cards-list {
    gap: 12px;
  }

  .card-item {
    max-width: 160px;
  }

  .scroll-button {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }
}
</style>
