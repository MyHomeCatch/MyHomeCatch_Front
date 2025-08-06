<template>
  <div class="image-gallery-wrapper">
    <!-- 이미지가 1개 이상 있을 경우 갤러리 표시 -->
    <div v-if="images && images.length > 0" class="image-gallery-container">
      <!-- 이미지 그리드 -->
      <div class="image-grid">
        <!-- 1. 좌측 메인 이미지 -->
        <div class="main-image-area">
          <img
            :src="images[0]"
            alt="대표 이미지"
            class="gallery-img"
            @error="onImageError"
          />
        </div>

        <!-- 2. 우측 썸네일 이미지 4개 -->
        <div class="thumbnail-grid-area">
          <div v-for="i in 4" :key="i" class="thumbnail-item">
            <!-- 이미지가 존재할 경우에만 렌더링 -->
            <img
              v-if="images[i]"
              :src="images[i]"
              :alt="`썸네일 이미지 ${i}`"
              class="gallery-img"
              @error="onImageError"
            />
            <!-- 이미지가 없으면 빈 공간 유지 -->
            <div v-else class="thumbnail-placeholder"></div>
          </div>
        </div>
      </div>

      <!-- 3. '사진 모두 보기' 버튼 (이미지가 5개 이상일 때만 표시) -->
      <div v-if="images.length > 5" class="show-all-button-wrapper">
        <button class="show-all-button">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            class="icon"
          >
            <path
              d="M3 11.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm-10-5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3zm5 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z"
            ></path>
          </svg>
          <span>사진 모두 보기</span>
        </button>
      </div>
    </div>

    <!-- 이미지가 없을 경우 플레이스홀더 표시 -->
    <div v-else class="no-image-placeholder">
      <div class="placeholder-content">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1"
          stroke-linecap="round"
          stroke-linejoin="round"
          class="placeholder-icon"
        >
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          <circle cx="8.5" cy="8.5" r="1.5"></circle>
          <polyline points="21 15 16 10 5 21"></polyline>
        </svg>
        <p>제공된 이미지가 없습니다.</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

// 부모 컴포넌트로부터 이미지 URL 배열을 받습니다.
defineProps({
  images: {
    type: Array,
    required: true,
    default: () => []
  }
});

// 이미지 로드 실패 시 대체 이미지 표시
const onImageError = (event) => {
  event.target.src = 'https://cdn2.colley.kr/item_300226_1_2_title_2.jpeg';
};
</script>

<style scoped>
.image-gallery-wrapper {
  width: 100%;
  max-width: 1120px;
  margin: 24px auto;
}

.image-gallery-container {
  position: relative;
  width: 100%;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
  width: 100%;
  /* 에어비앤비와 유사한 2:1 비율 유지 */
  aspect-ratio: 2 / 1;
  border-radius: 12px;
  overflow: hidden;
}

/* 좌측 메인 이미지 영역 */
.main-image-area {
  grid-column: span 2;
  grid-row: span 2;
}

/* 우측 썸네일 영역 */
.thumbnail-grid-area {
  grid-column: span 2;
  grid-row: span 2;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 8px;
}

.thumbnail-item, .thumbnail-placeholder {
  width: 100%;
  height: 100%;
  background-color: #f0f2f5; /* Placeholder background */
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  cursor: pointer;
  transition: filter 0.2s ease-in-out;
}

.gallery-img:hover {
  filter: brightness(0.9);
}

/* '사진 모두 보기' 버튼 */
.show-all-button-wrapper {
  position: absolute;
  bottom: 24px;
  right: 24px;
}

.show-all-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background-color: white;
  border: 1px solid #222;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.show-all-button:hover {
  transform: scale(1.03);
}

.show-all-button .icon {
  width: 16px;
  height: 16px;
}

/* 이미지 없음 플레이스홀더 */
.no-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 2 / 1;
  border-radius: 12px;
  background-color: #f0f2f5;
  border: 1px dashed #d1d5db;
}

.placeholder-content {
  text-align: center;
  color: #6b7280;
}

.placeholder-icon {
  margin-bottom: 16px;
  color: #9ca3af;
}
</style>