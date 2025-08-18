<template>
  <div class="house-card" @click="onCardClick">
    <div class="image-container">
      <img
        v-if="image && image.overviewImageUrl"
        :src="image.overviewImageUrl"
        alt="단지 이미지"
        class="gallery-img"
        @error="onImageError"
      />
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
  </div>
</template>

<script setup>
// Props
const props = defineProps({
  image: {
    type: Object,
    required: true,
    default: () => ({}),
  },
});

const emit = defineEmits(['card-click']);

// 이미지 로드 실패 시 대체 이미지 표시
const onImageError = (event) => {
  event.target.src = 'https://cdn2.colley.kr/item_300226_1_2_title_2.jpeg';
};

const onCardClick = () => {
  emit('card-click', props.image);
};
</script>

<style scoped>
.house-card {
  cursor: pointer;
}
.image-container {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  overflow: hidden;
  border-radius: 12px;
}

.gallery-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.house-card:hover .gallery-img {
  transform: scale(1.05);
}

/* 이미지 없음 플레이스홀더 */
.no-image-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  aspect-ratio: 1;
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