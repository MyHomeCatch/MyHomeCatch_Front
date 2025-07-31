<template>
  <div
    class="bg-white border border-gray-300 rounded-xl p-4 max-w-md mx-auto"
    style="font-size: 0.9rem"
  >
    <!-- 조회수 (맨 위) -->
    <h3 class="text-center mb-4" style="font-weight: 600">
      지금까지 <span class="text-primary">123명</span>이 이 공고를 봤어요.
    </h3>

    <!-- 즐겨찾기와 접수상태 -->
    <div class="d-flex justify-content-between mb-3">
      <!-- 즐겨찾기: 둥근 테두리 -->
      <span
        class="px-3 py-1 rounded-pill"
        style="border: 1.5px solid #3b82f6; color: #3b82f6; font-weight: 600"
      >
        즐겨찾기: 5명
      </span>

      <!-- 접수상태: 상태별 색상 -->
      <span
        class="px-3 py-1 rounded-pill"
        :style="{ ...applyStatusStyle, fontWeight: '600' }"
      >
        {{ applyStatusText }}
      </span>
    </div>

    <!-- 분양 세대수 -->
    <div
      class="mb-3 d-flex justify-content-between px-3 py-1 border rounded"
      style="font-weight: 600"
    >
      <div>분양 세대수</div>
      <div>120 세대</div>
    </div>

    <!-- 정보 항목 리스트 -->
    <div class="border border-gray-300 rounded" style="overflow: hidden">
      <div
        class="d-flex justify-content-between px-3 py-2 border-bottom"
        style="background-color: #f9fafb"
      >
        <div style="font-weight: 600">주택유형</div>
        <div>아파트</div>
      </div>
      <div class="d-flex justify-content-between px-3 py-2 border-bottom">
        <div style="font-weight: 600">공급면적</div>
        <div>59 ~ 84㎡</div>
      </div>
      <div
        class="d-flex justify-content-between px-3 py-2 border-bottom"
        style="background-color: #f9fafb"
      >
        <div style="font-weight: 600">접수방법</div>
        <div>온라인 접수</div>
      </div>
      <div class="d-flex justify-content-between px-3 py-2 border-bottom">
        <div style="font-weight: 600">접수기간</div>
        <div>2025-08-01 ~ 2025-08-07</div>
      </div>
      <div
        class="d-flex justify-content-between px-3 py-2 border-bottom"
        style="background-color: #f9fafb"
      >
        <div style="font-weight: 600">서류 접수일</div>
        <div>2025-07-25 ~ 2025-07-30</div>
      </div>
      <div class="d-flex justify-content-between px-3 py-2 border-bottom">
        <div style="font-weight: 600">계약체결기간</div>
        <div>2025-08-15 ~ 2025-08-20</div>
      </div>
      <div
        class="d-flex justify-content-between px-3 py-2 border-bottom"
        style="background-color: #f9fafb"
      >
        <div style="font-weight: 600">당첨발표월</div>
        <div>2025-08</div>
      </div>
      <div class="d-flex justify-content-between px-3 py-2 border-bottom">
        <div style="font-weight: 600">당첨자서류제출기간</div>
        <div>2025-08-16 ~ 2025-08-22</div>
      </div>
      <div
        class="d-flex justify-content-between px-3 py-2 border-bottom"
        style="background-color: #f9fafb"
      >
        <div style="font-weight: 600">입주예정일</div>
        <div>2026-02</div>
      </div>
      <div class="d-flex justify-content-between px-3 py-2">
        <div style="font-weight: 600">난방</div>
        <div>지역난방</div>
      </div>
    </div>

    <!-- 좋아요 섹션 -->
    <div class="d-flex justify-content-between align-items-center my-4">
      <p class="mb-0 text-muted">
        이 공고를 좋아한 사람
        <span class="text-pink fw-bold">27명</span>
      </p>
      <button
        @click="toggleLike"
        class="btn btn-outline-pink btn-sm"
        style="border-radius: 50px"
      >
        {{ isLiked ? '좋아요 취소' : '좋아요' }}
      </button>
    </div>

    <!-- 버튼 -->
    <div class="d-grid gap-2">
      <button
        class="btn"
        style="
          background-color: #ff9898;
          color: white;
          border-radius: 50px;
          border: none;
        "
      >
        공고 상세 바로가기
      </button>
      <button
        class="btn"
        style="
          background-color: #ff9898;
          color: white;
          border-radius: 50px;
          border: none;
        "
      >
        공고 PDF 다운로드
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const isLiked = ref(false);

function toggleLike() {
  isLiked.value = !isLiked.value;
}

// 테스트용 접수상태 값 (아래 3가지 중 하나로 변경 가능)
const applyStatus = ref('접수중');
// '접수중', '접수마감', '공고중'

// 상태별 스타일 계산
const applyStatusStyle = computed(() => {
  switch (applyStatus.value) {
    case '접수중':
      return {
        backgroundColor: '#F6B9AE',
        borderColor: '#F6B9AE',
        color: '#7B3E32',
      };
    case '접수마감':
      return {
        backgroundColor: '#D9D9D9',
        borderColor: '#D9D9D9',
        color: '#4B4B4B',
      };
    case '공고중':
      return {
        backgroundColor: '#F7F0E0',
        borderColor: '#F7F0E0',
        color: '#736C4A',
      };
    default:
      return {
        backgroundColor: '#fff',
        borderColor: '#ccc',
        color: '#000',
      };
  }
});

// 접수상태 텍스트
const applyStatusText = computed(() => applyStatus.value);
</script>

<style scoped>
.text-pink {
  color: #e91e63;
}
.btn-outline-pink {
  border: 1px solid #e91e63;
  color: #e91e63;
}
.btn-outline-pink:hover {
  background-color: #fce4ec;
  color: #ad1457;
}
</style>
