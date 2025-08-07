<template>
  <div
    class="house-card"
    :class="{ compact }"
    @click="onCardClick"
    :id="house.houseId"
  >
    <!-- 아파트 이미지 -->
    <div class="image-container">
      <img
        v-if="!house.overviewImageUrl"
        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop"
        alt="아파트 이미지"
        class="house-image"
      />
      <iframe
        v-else-if="house.overviewImageUrl.toLowerCase().endsWith('.pdf')"
        :src="house.overviewImageUrl"
        alt="아파트 이미지"
        class="house-image house-pdf-no-scroll"
      />
      <img
        v-else
        :src="house.overviewImageUrl"
        alt="아파트 이미지"
        class="house-image"
      />
      <div class="image-overlay">
        <div class="heart-icon" @click.stop="toggleFavorite">
          {{ localFavorite ? '♥' : '♡' }}
        </div>
      </div>
      <!-- 주택 타입 배지 -->
      <div class="housing-type-badge">무엇인가 적을곳</div>
    </div>

    <!-- 아파트 정보 -->
    <div class="house-info">
      <div class="location-info">
        <h3 class="house-name">{{ house.houseName }}</h3>
        <!-- <p class="address">{{ house.address }}</p> -->
        <div
          style="
            width: 100%;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
          "
        >
          <span class="region">
            {{ house.region }}
          </span>
          <span
            class="value notice-status"
            :class="getStatusClass(house.noticeStatus)"
          >
            {{ house.noticeStatus }}
          </span>
        </div>
        <span class="value">{{ house.noticeType }}</span>
        <div>
          <span class="value">{{ house.exclusiveArea }}</span>
          <span class="area-unit">m<sup>2</sup></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useMyPageStore } from '@/stores/mypage';

// Props
const props = defineProps({
  house: {
    type: Object,
    required: true,
  },

  compact: { type: Boolean, default: false }, // 마이페이지 사용

  isFavorite: { type: Boolean, default: false },
});

// Emits
const emit = defineEmits(['card-click', 'toggle-favorite']);

// 내부 상태로 따로 관리
const localFavorite = ref(props.isFavorite);

// // State
// const isFavorite = ref(false);

// Methods
const onCardClick = () => {
  emit('card-click', props.house);
};

// 즐겨찾기를 사용하기 위한 store
const store = useMyPageStore();

const toggleFavorite = async () => {
  const danziId = props.house.danziId;
  const prev = localFavorite.value;

  try {
    if (!prev) {
      await store.postBookmarks(danziId); // 즐겨찾기 등록
    } else {
      await store.deleteBookmarks(danziId); // 즐겨찾기 해제
    }

    // ✅ 성공 시 상태 반영
    localFavorite.value = !prev;

    emit('toggle-favorite', {
      houseId: danziId,
      isFavorite: localFavorite.value,
    });
  } catch (err) {
    console.error('즐겨찾기 처리 실패:', err);
    // 실패 시 상태 복원
    localFavorite.value = prev;
  }
};

const getStatusClass = (status) => {
  if (status === '접수중' || status === '진행중') return 'status-active';
  if (status === '마감' || status === '종료') return 'status-closed';
  return 'status-default';
};

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('ko-KR');
};
</script>

<style scoped>
.house-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%; /* 기본 그리드용 */
  max-width: 100%;
}

/* ✅ 캐러셀 전용 compact 모드 */
.house-card.compact {
  width: 180px;
  min-width: 180px;
  flex-shrink: 0;
  border-radius: 12px;
  overflow: hidden;
  background: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
}

.house-card.compact .image-container {
  aspect-ratio: 4 / 3;
  overflow: hidden;
}

.house-card.compact .house-image {
  object-fit: cover;
  width: 100%;
  height: 100%;
}

.house-card.compact .house-info {
  padding: 6px 8px;
}

.house-card.compact .house-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
  height: 18px;
}

.house-card.compact .value {
  font-size: 13px;
  color: #555;
}

.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  background: #f8f9fa;
}

.house-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.house-pdf-no-scroll {
  scrollbar-width: none;
  overflow: hidden;
  pointer-events: none;
}

.house-card:hover .house-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.house-card:hover .image-overlay {
  opacity: 1;
}

.heart-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #717171;
  transition: all 0.2s ease;
}

.heart-icon:hover {
  background: white;
  color: #ff385c;
  transform: scale(1.1);
}

.housing-type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.house-info {
  padding-top: 10px;
}

.location-info {
  margin-bottom: 16px;
}

.house-name {
  font-size: 15px;
  font-weight: 600;
  color: #222222;
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  height: 40px;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.address {
  font-size: 14px;
  color: #717171;
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.region {
  font-size: 14px;
  color: #717171;
  margin: 0;
  font-weight: 500;
}

.supply-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.supply-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.label {
  font-size: 13px;
  color: #717171;
  font-weight: 500;
}

.value {
  font-size: 14px;
  color: #222222;
  font-weight: 400;
}

.area-unit {
  font-size: 12px;
  font-weight: 400;
  color: #717171;
  margin-left: 2px;
}

.notice-status {
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background: #22c55e;
  color: white;
}

.status-closed {
  background: #ef4444;
  color: white;
}

.status-default {
  background: #64748b;
  color: white;
}

.date-info {
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}

.apply-date {
  font-size: 13px;
  color: #717171;
  font-weight: 500;
}

@media (max-width: 480px) {
  .house-info {
    padding: 16px;
  }

  .house-name {
    font-size: 16px;
  }

  .supply-info {
    padding: 10px;
  }

  .supply-detail {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
