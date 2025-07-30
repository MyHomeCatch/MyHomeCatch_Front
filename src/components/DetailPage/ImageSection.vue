<template>
  <!-- tailwind 변경하면 오류 -->
  <div class="image-gallery-container">
    <!-- 이미지 그리드 -->
    <div class="image-grid">
      <!-- 1. 좌측 메인 이미지 -->
      <div class="main-image-area">
        <img
          v-if="images.length > 0"
          :src="images[0]"
          alt="대표 이미지"
          class="gallery-img"
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
          />
        </div>
      </div>
    </div>

    <!-- 3. '사진 모두 보기' 버튼 -->
    <div class="show-all-button-wrapper">
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
</template>

<script setup>
import { ref } from 'vue';

// DB에서 가져올 이미지 데이터라고 가정합니다. (최소 5개)
const images = ref([
  'https://cdn2.colley.kr/item_300226_1_2_title_2.jpeg',
  'https://image.cine21.com/resize/cine21/still/2005/1121/M0020066_focus52804[H800-].jpg',
  'https://image.cine21.com/resize/cine21/still/2005/1121/M0020067_focus52805[H800-].jpg',
  'https://thumbnail.laftel.net/items/full/983c3293-6b63-400a-ac3c-96b9b4d84335.jpg?webp=0&w=760&c=0%2C388%2C1024%2C963',
  'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTQ4OTYxNjQzMDQwNzk3OTYx/original/e2b3190f-524b-4be2-a0b9-ff6410d77404.jpeg?im_w=1200',
  'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTQ4OTYxNjQzMDQwNzk3OTYx/original/5d37a42a-878a-4c4e-828c-1caff6d2b6d2.jpeg?im_w=720',
  'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTQ4OTYxNjQzMDQwNzk3OTYx/original/492e5739-1d8b-4401-8c5e-c1c071e4ca89.jpeg?im_w=720',
  'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTQ4OTYxNjQzMDQwNzk3OTYx/original/a766cd4b-00c3-41d3-a866-9badded83026.jpeg?im_w=720',
  'https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6OTQ4OTYxNjQzMDQwNzk3OTYx/original/1dde1b8e-2ddc-46d5-af52-cde5b411e7ad.jpeg?im_w=720',
]);
</script>

<style scoped>
.image-gallery-container {
  position: relative;
  width: 100%;
  max-width: 1120px;
  margin: 24px auto;
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

.thumbnail-item {
  width: 100%;
  height: 100%;
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
</style>
