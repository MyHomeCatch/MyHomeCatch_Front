<template>
  <div class="card-scroller-section">
    <!-- 섹션 헤더 -->
    <div class="section-header">
      <h2>{{ title }}</h2>
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
      <div
        class="scroll-button scroll-left"
        @click="scrollLeft"
        :class="{ disabled: !canScrollLeft }"
      >
        ←
      </div>
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
      <div
        class="scroll-button scroll-right"
        @click="scrollRight"
        :class="{ disabled: !canScrollRight }"
      >
        →
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
  background: white;
  margin: 20px 0;
  border-radius: 24px;
  padding: 20px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  /* margin-left: 5%; */
}

.section-header h2 {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
}

.scroll-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid #e0e0e0;
  background: white;
  color: #666;
  font-size: 18px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
  z-index: 10;
}

.scroll-button:hover:not(.disabled) {
  border-color: #667eea;
  color: #667eea;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(102, 126, 234, 0.2);
}

.scroll-button.disabled {
  opacity: 0.3;
  cursor: not-allowed;
  box-shadow: none;
}

.scroll-button:active:not(.disabled) {
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
  background: linear-gradient(90deg, #f5f5f5 25%, #e5e5e5 50%, #f5f5f5 75%);
  background-size: 200% 100%;
  animation: loading 1.5s infinite;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
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
  padding: 50px 20px;
  background: white;
  border-radius: 16px;
  margin: 20px 0;
  border: 1px solid #e0e0e0;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
  filter: grayscale(0.3);
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 8px 0;
}

.empty-description {
  font-size: 14px;
  color: #666;
  line-height: 1.4;
  margin: 0 0 20px 0;
}

.action-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.action-button:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(102, 126, 234, 0.4);
}

.action-button:active {
  transform: translateY(0);
}

.cards-container {
  position: relative;
  display: flex;
  align-items: center;
  gap: 16px;
}

.cards-scroll {
  overflow-x: auto;
  overflow-y: hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  scroll-behavior: smooth;
  flex-grow: 1;
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
@media (max-width: 1024px) {
  .section-header h2 {
    font-size: 18px;
  }

  .empty-state {
    padding: 40px 16px;
  }
}

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

  .scroll-button {
    width: 36px;
    height: 36px;
    font-size: 16px;
  }

  .empty-state {
    padding: 35px 16px;
    margin: 16px 0;
  }

  .empty-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  .empty-title {
    font-size: 16px;
  }

  .empty-description {
    font-size: 13px;
    margin-bottom: 16px;
  }

  .action-button {
    padding: 10px 20px;
    font-size: 13px;
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

  .empty-state {
    padding: 30px 12px;
    border-radius: 12px;
  }

  .empty-icon {
    font-size: 36px;
    margin-bottom: 10px;
  }

  .empty-title {
    font-size: 15px;
  }

  .empty-description {
    font-size: 12px;
    margin-bottom: 14px;
  }

  .action-button {
    padding: 10px 18px;
    font-size: 12px;
    border-radius: 8px;
  }
}
</style>
