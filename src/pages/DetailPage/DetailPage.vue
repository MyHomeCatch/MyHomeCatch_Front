<template>
  <main class="container py-4">
    <div
      class="d-flex justify-content-between align-items-start position-relative"
    >
      <div>
        <h1 class="h3 fw-bold text-dark">디에이치클래스트</h1>
        <p class="text-muted mt-1">서울 서초구 반포동 810</p>
      </div>
      <button
        id="likeButton"
        class="like-btn btn d-flex align-items-center px-3 py-1 gap-2 not-liked"
        onclick="toggleLike()"
      >
        <i class="fa-solid fa-heart"></i>
        <span id="likeText">찜</span>
      </button>
    </div>
  </main>

  <!-- 이미지 및 정보 -->
  <ImageSection />

  <div class="container px-4 py-5">
    <div class="row">
      <!-- 좌측 콘텐츠 영역 -->
      <div class="col-12 col-lg-7">
        <DetailMap />
      </div>
    </div>

    <!-- 우측 패널 영역 -->
    <div class="col-12 col-lg-5 offset-lg-7">
      <InfoPanel />
    </div>
  </div>

  <!-- 게시판 -->
  <Comments />
</template>

<script setup>
import { ref } from 'vue';
import ImageSection from '@/components/DetailPage/ImageSection.vue';
import InfoPanel from '../../components/DetailPage/InfoPanel.vue';
import Comments from '@/components/DetailPage/Comments.vue';
import DetailMap from '@/components/DetailPage/DetailMap.vue';

const isLiked = ref(false);
const viewCount = ref(127);
const likeCount = ref(2);

const thumbnails = ref([
  '단지 배치도',
  '단지전경도',
  '지역위치도',
  '토지이용계획도',
]);

const toggleLike = () => {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
};
</script>

<style scope>
.like-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}
.liked {
  background-color: #db2777;
  color: white;
  border: none;
}
.not-liked {
  background-color: #fce7f3;
  color: #db2777;
  border: 1px solid #db2777;
}
.not-liked:hover {
  background-color: #fbcfe8;
}
</style>
