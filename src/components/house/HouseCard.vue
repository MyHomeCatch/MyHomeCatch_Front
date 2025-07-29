<template>
  <div class="house-card" @click="onCardClick">
    <!-- 아파트 이미지 -->
    <div class="image-container">
      <img
        v-if="house.overviewImageUrl"
        :src="house.overviewImageUrl"
        alt="아파트 이미지"
        class="house-image"
      />
      <img
        v-else
        src="https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&h=250&fit=crop"
        alt="아파트 이미지"
        class="house-image"
      />
      <div class="image-overlay">
        <div class="heart-icon" @click.stop="toggleFavorite">
          {{ isFavorite ? '♥' : '♡' }}
        </div>
      </div>
      <!-- 주택 타입 배지 -->
      <div class="housing-type-badge">무엇인가 적을곳</div>
    </div>

    <!-- 아파트 정보 -->
    <div class="house-info">
      <div class="location-info">
        <h3 class="house-name">{{ house.houseName }}</h3>
        <p class="address">{{ house.address }}</p>
        <p class="region">{{ house.region }}</p>
      </div>

      <div class="supply-info">
        <div class="supply-detail">
          <span class="label">
            {{ house.housingType === 'housing' ? '분양세대' : '임대세대' }}
          </span>
          <span class="value">{{ house.totalHouseCount }}세대</span>
        </div>
        <div class="supply-detail">
          <span class="label">공고유형</span>
          <span class="value">{{ house.noticeType }}</span>
        </div>
        <div class="supply-detail">
          <span class="label">공고상태</span>
          <span
            class="value notice-status"
            :class="getStatusClass(house.noticeStatus)"
          >
            {{ house.noticeStatus }}
          </span>
        </div>
        <div class="supply-detail">
          <span class="label">적용면적</span>
          <div>
            <span class="value">{{ house.exclusiveArea }}</span>
            <span class="area-unit">m<sup>2</sup></span>
          </div>
        </div>
      </div>

      <div class="date-info">
        <span class="apply-date">
          공고일: {{ formatDate(house.noticeStartDate) }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// Props
const props = defineProps({
  house: {
    type: Object,
    required: true,
  },
});

// Emits
const emit = defineEmits(['card-click', 'toggle-favorite']);

// State
const isFavorite = ref(false);

// Methods
const onCardClick = () => {
  emit('card-click', props.house);
};

const toggleFavorite = () => {
  isFavorite.value = !isFavorite.value;
  emit('toggle-favorite', {
    houseId: props.house.houseId,
    isFavorite: isFavorite.value,
  });
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
}

.image-container {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: #f8f9fa;
}

.house-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
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
  padding: 20px;
}

.location-info {
  margin-bottom: 16px;
}

.house-name {
  font-size: 18px;
  font-weight: 600;
  color: #222222;
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
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
  font-weight: 600;
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
