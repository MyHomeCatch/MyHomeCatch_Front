<template>
  <div class="house-card" @click="onCardClick" :id="house.houseId">
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
      <div class="housing-type-badge">{{ house.noticeType || '주택' }}</div>
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
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { ref, computed, watch } from 'vue';
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
});

// Emits
const emit = defineEmits(['card-click', 'toggle-favorite']);

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
  emit('card-click', props.house);
};

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
.house-card {
  border-radius: 16px;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
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

/* 호버 시 표시 */
.house-card:hover .image-overlay {
  opacity: 1;
}

/* 북마크가 되어있으면 항상 표시 */
.image-overlay.show-always {
  opacity: 1;
}

.bookmark-icon {
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
  cursor: pointer;
  user-select: none;
}

.bookmark-icon:hover {
  background: white;
  color: #ff385c;
  transform: scale(1.1);
}

.bookmark-icon.favorited {
  color: #ff385c;
}

.bookmark-icon.favorited:hover {
  color: #e31c5f;
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

.house-details {
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 4px;
}

.region {
  font-size: 14px;
  color: #717171;
  margin: 0;
  font-weight: 500;
}

.value {
  font-size: 14px;
  color: #222222;
  font-weight: 400;
}

.notice-type {
  display: block;
  margin-bottom: 4px;
}

.area-info {
  display: flex;
  align-items: baseline;
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

@media (max-width: 480px) {
  .house-info {
    padding: 16px;
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
