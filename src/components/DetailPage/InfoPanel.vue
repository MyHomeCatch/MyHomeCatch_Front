<template>
  <div class="bg-light border rounded p-4">
    <h3 class="h6 fw-semibold text-center mb-3">
      지금까지 {{ viewCount }}명이 이 공고를 봤어요.
    </h3>

    <!-- 좋아요 섹션 -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <p class="mb-0 text-muted">
        이 공고를 좋아한 사람
        <span class="text-primary fw-semibold">{{ likeCount }}명</span>
      </p>
      <button @click="toggleLike" class="btn btn-outline-primary btn-sm">
        {{ isLiked ? '좋아요 취소' : '좋아요' }}
      </button>
    </div>
  </div>

  <div class="text-sm">정보항목 리스트</div>

  <!-- 버튼 -->
  <div class="mt-4 d-grid gap-2">
    <button class="btn btn-pink text-dark" style="background-color: #fbcfe8">
      공고 상세 바로가기
    </button>
    <button class="btn btn-light text-pink" style="background-color: #fce7f3">
      공고 PDF 다운로드
    </button>
  </div>
</template>

<script setup>
const viewCount = 123;
const likeCount = 2;

const toggleLike=() => {

};
</script>

<style scoped>
.info-item label {
  font-weight: 600;
  margin-right: 0.5rem;
}
</style>
