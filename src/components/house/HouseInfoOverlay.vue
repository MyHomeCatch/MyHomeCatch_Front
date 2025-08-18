<template>
  <div class="airbnb-custom-overlay">
    <button class="close-button" @click="$emit('close')">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
        <path
          d="M9 3L3 9M3 3L9 9"
          stroke="currentColor"
          stroke-width="1.5"
          stroke-linecap="round"
        />
      </svg>
    </button>

    <div class="overlay-content">
      <div class="house-info">
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
        </div>

        <h3 class="house-name">{{ house.houseName }}</h3>
        <div class="house-actions">
          <button class="action-btn" @click="handleDetailView">
            자세히 보기
          </button>
        </div>
      </div>
    </div>

    <div class="overlay-arrow"></div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const props = defineProps({
  house: {
    type: Object,
    required: true,
  },
});

defineEmits(['close']);

const router = useRouter();

const handleDetailView = () => {
  // 이젠 localSotrage 안씀
  // localStorage.setItem('currentHouseCard', JSON.stringify(props.house));
  const houseId = props.house.houseId || props.house.danziId;
  console.log('자세히 보기 클릭', houseId);
  if (houseId) {
    router.push({ name: 'DetailPage', params: { id: houseId } });
  } else {
    console.error('House ID is missing');
  }
};
</script>

<style scoped>
.airbnb-custom-overlay {
  position: relative;
  background: #fffdfa;
  border-radius: 16px;
  box-shadow: 0 8px 28px rgba(166, 191, 160, 0.2),
    0 0 1px rgba(166, 191, 160, 0.1), 0 2px 4px rgba(166, 191, 160, 0.15);
  border: 1px solid #eaf5e6;
  min-width: 190px;
  max-width: 220px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
    'Helvetica Neue', sans-serif;
  overflow: hidden;
  transform: translateY(-12px);
  animation: overlaySlideIn 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backdrop-filter: blur(10px);
}

.house-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 8px;
}

.close-button {
  position: absolute;
  top: 12px;
  right: 12px;
  width: 32px;
  height: 32px;
  border: none;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  color: #4d6b4d;
  box-shadow: 0 2px 8px rgba(166, 191, 160, 0.2);
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  backdrop-filter: blur(10px);
}

.close-button:hover {
  background: rgba(255, 255, 255, 1);
  transform: scale(1.1);
  box-shadow: 0 4px 16px rgba(166, 191, 160, 0.3);
  color: #234123;
}

.close-button:active {
  transform: scale(0.95);
}

.overlay-content {
  padding: 12px 12px 10px;
}

.house-info {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.house-name {
  font-size: 15px;
  font-weight: 600;
  color: #234123;
  line-height: 1.3;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.house-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.25s cubic-bezier(0.25, 0.46, 0.45, 0.94);
  background: #4caf50;
  color: #f9fff9ff;
  border: none;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.action-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(166, 191, 160, 0.4);
}

.heart-icon {
  transition: all 0.2s ease;
}

.action-btn.secondary:hover .heart-icon {
  fill: #a6bfa0;
}

.house-extra-info {
  display: flex;
  justify-content: space-between;
  padding: 12px 0 0;
  border-top: 1px solid #eaf5e6;
  margin-top: 4px;
}

.price-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.price-label {
  font-size: 12px;
  color: #7fa87f;
  font-weight: 500;
}

.price-value {
  font-size: 14px;
  color: #234123;
  font-weight: 700;
}

/* 말풍선 화살표 */
.overlay-arrow {
  position: absolute;
  bottom: -12px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-right: 12px solid transparent;
  border-top: 12px solid #fffdfa;
  filter: drop-shadow(0 4px 6px rgba(166, 191, 160, 0.2));
}

.overlay-arrow::before {
  content: '';
  position: absolute;
  bottom: 1px;
  left: -13px;
  width: 0;
  height: 0;
  border-left: 13px solid transparent;
  border-right: 13px solid transparent;
  border-top: 13px solid #eaf5e6;
}

/* 반응형 */
@media (max-width: 480px) {
  .airbnb-custom-overlay {
    min-width: 280px;
    max-width: 320px;
  }

  .overlay-content {
    padding: 10px 10px 8px;
  }

  .house-name {
    font-size: 20px;
  }

  .house-actions {
    flex-direction: column;
    gap: 8px;
  }
}
</style>
