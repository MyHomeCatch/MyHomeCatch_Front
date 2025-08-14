<template>
  <div class="map-page-house-card" @click="onCardClick" :id="house.houseId">
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
      <div class="image-overlay" :class="{ 'show-always': localIsFavorited }">
        <!-- 지도 이동 버튼 -->
        <div
          v-if="showMapButton"
          class="map-icon"
          @click.stop="onMapClick"
          title="지도에서 보기"
        >
          <i class="bi bi-geo-alt"></i>
        </div>
        <div
          class="bookmark-icon"
          :class="{ favorited: localIsFavorited }"
          @click.stop="toggleFavorite"
          :disabled="favoriteLoading"
        >
          <!-- <span  class="loading-spinner">⏳</span> -->
          <i v-if="favoriteLoading" class="bi bi-bookmark-fill"></i>
          <i v-else-if="!localIsFavorited" class="bi bi-bookmark"></i>
          <i v-else class="bi bi-bookmark-fill"></i>
        </div>
      </div>
      <!-- 주택 타입 배지 -->
      <!-- <div class="housing-type-badge">{{ house.noticeType || '주택' }}</div> -->
    </div>

    <!-- 아파트 정보 -->
    <div class="house-info">
      <div class="location-info">
        <h3 class="house-name">{{ house.houseName }}</h3>
        <div class="house-details">
          <span class="region">{{ house.region }}</span>
          <span
            class="value notice-status"
            :class="getStatusClass(house.noticeStatus)"
          >
            {{ house.noticeStatus }}
          </span>
        </div>
        <span class="value notice-type">{{ house.noticeType }}</span>
        <div class="area-info">
          <span class="value">{{ house.exclusiveArea }}</span>
          <span class="area-unit">m<sup>2</sup></span>
        </div>
        <div class="ai-summary">
          <span class="value">{{ aiSummary }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth';
import { addBookmark, removeBookmark } from '../../api/bookmardApi';

// Props
const props = defineProps({
  house: {
    type: Object,
    required: true,
  },
  favoriteList: {
    type: Array,
    default: () => [],
  },
  showMapButton: {
    type: Boolean,
    default: false,
  },
  aiSummary: {
    type: String,
    default: '',
  },
});

// Emits
const emit = defineEmits(['card-click', 'toggle-favorite']);

// Router
const router = useRouter();

// State
const favoriteLoading = ref(false);
const localIsFavorited = ref(false);
const auth = useAuthStore();

// favoriteList prop 기반으로 초기 상태 설정
const checkIfFavorited = () => {
  if (!props.favoriteList || !Array.isArray(props.favoriteList)) {
    return false;
  }

  const result = props.favoriteList.some((fav) => {
    return fav.danziId == props.house.danziId;
  });

  return result;
};

// favoriteList가 변경될 때만 로컬 상태 업데이트
watch(
  () => props.favoriteList,
  (newFavoriteList, oldFavoriteList) => {
    const newIsFavorited = checkIfFavorited();
    if (localIsFavorited.value !== newIsFavorited) {
      localIsFavorited.value = newIsFavorited;
    }
  },
  {
    deep: true,
    immediate: true,
  }
);

// danziId 변경 시에도 확인
watch(
  () => props.house.danziId,
  (newDanziId, oldDanziId) => {
    if (newDanziId !== oldDanziId) {
      localIsFavorited.value = checkIfFavorited();
    }
  },
  { immediate: true }
);

// Methods
const onCardClick = () => {
  // 디테일 페이지로 이동
  //   const houseId = props.house.houseId || props.house.danziId;
  //   if (houseId) {
  //     router.push({ name: 'DetailPage', params: { id: houseId } });
  //   }
  emit('card-click', props.house);
};

// const onMapClick = () => {
//   // 지도 이동을 위해 card-click 이벤트 발생
//   emit('card-click', props.house);
// };

const toggleFavorite = async () => {
  if (!auth.isLoggedIn) {
    alert('로그인이 필요합니다.');
    return;
  }

  favoriteLoading.value = true;
  const wasBookmarked = localIsFavorited.value;

  // 낙관적 업데이트
  localIsFavorited.value = !wasBookmarked;

  try {
    const bookmarkData = {
      userId: auth.user.id,
      danziId: props.house.danziId,
    };

    let response;

    if (wasBookmarked) {
      response = await removeBookmark(bookmarkData, auth.token);
    } else {
      response = await addBookmark(bookmarkData, auth.token);
    }

    // 부모 컴포넌트에 변경사항 알림
    emit('toggle-favorite', {
      danziId: props.house.danziId,
      houseId: props.house.houseId,
      isFavorited: !wasBookmarked,
      action: wasBookmarked ? 'remove' : 'add',
      success: true,
    });
  } catch (error) {
    console.error('즐겨찾기 처리 오류:', error);

    if (error.response?.status === 401) {
      alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
    }
  } finally {
    favoriteLoading.value = false;
  }
};

const getStatusClass = (status) => {
  if (status === '접수중' || status === '진행중' || status === '공고중')
    return 'status-active';
  if (status === '마감' || status === '종료' || status === '접수마감')
    return 'status-closed';
  return 'status-default';
};
</script>

<style scoped>
.map-page-house-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  background: #ffffff;
  border: 1px solid #e8e8e8;
}

.map-page-house-card:hover {
  transform: translateY(-4px);
  border-color: #d0d0d0;
}

.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
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

.map-page-house-card:hover .house-image {
  transform: scale(1.05);
}

.image-overlay {
  position: absolute;
  top: 12px;
  right: 12px;
  opacity: 0;
  transition: opacity 0.3s ease;
  display: flex;
  gap: 8px;
  align-items: flex-start;
  justify-content: flex-end;
}

/* 호버 시 표시 */
.map-page-house-card:hover .image-overlay {
  opacity: 1;
}

/* 북마크가 되어있으면 항상 표시 */
.image-overlay.show-always {
  opacity: 1;
}

/* 지도 버튼이 없을 때 북마크 버튼 위치 조정 */
.image-overlay:not(:has(.map-icon)) {
  justify-content: flex-end;
}

.image-overlay:not(:has(.map-icon)) .bookmark-icon {
  margin-left: auto;
}

/* 지도 버튼은 호버 시에만 표시 */
.map-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #2c3e50;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  opacity: 0;
}

.map-page-house-card:hover .map-icon {
  opacity: 1;
}

.map-icon:hover {
  background: white;
  color: #3498db;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.bookmark-icon {
  width: 32px;
  height: 32px;
  background: rgba(255, 255, 255, 0.95);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: #2c3e50;
  transition: all 0.2s ease;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bookmark-icon:hover {
  background: white;
  color: #e74c3c;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.bookmark-icon.favorited {
  color: #e74c3c;
  background: rgba(255, 255, 255, 0.95);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.bookmark-icon.favorited:hover {
  color: #c0392b;
  background: white;
  transform: scale(1.1);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.bookmark-icon:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.housing-type-badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: rgba(166, 191, 160, 0.9);
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  backdrop-filter: blur(4px);
}

.house-info {
  padding: 12px 16px;
  background: #ffffff;
}

.location-info {
  margin-bottom: 12px;
}

.house-name {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0 0 8px 0;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  height: 40px;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.house-details {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
}

.region,
.notice-type,
.area-info {
  margin-bottom: 4px; /* ✅ 각 줄 간격 */
}

.region {
  font-size: 14px;
  color: #2c3e50;
  margin: 0;
  font-weight: 600;
}

.value {
  font-size: 14px;
  color: #34495e;
  font-weight: 500;
}

.notice-type {
  display: block;
  margin-bottom: 4px;
  color: #5d6d7e;
  font-weight: 600;
}

.area-info {
  display: flex;
  align-items: baseline;
  padding-bottom: 4px;
}

.area-unit {
  font-size: 12px;
  font-weight: 500;
  color: #5d6d7e;
  margin-left: 2px;
}

.notice-status {
  padding: 4px 8px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background: #3498db;
  color: white;
}

.status-closed {
  background: #e74c3c;
  color: white;
}

.status-default {
  background: #95a5a6;
  color: white;
}

@media (max-width: 480px) {
  .house-info {
    padding: 12px;
  }

  .house-name {
    font-size: 16px;
  }

  .house-details {
    flex-direction: column;
    align-items: flex-start;
    gap: 4px;
  }
}
</style>
