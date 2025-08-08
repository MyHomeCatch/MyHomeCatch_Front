<template>
  <div class="info-section py-3 mt-4">
    <h2 class="section-title mb-4">
      <router-link to="/profile/edit" class="text-decoration-none text-dark">
        내 정보 ✏️
      </router-link>
    </h2>
    <div class="row g-3">
      <div
        class="col-12 col-md-6"
        v-for="(item, index) in flattenedUserRows"
        :key="index"
      >
        <div class="d-flex gap-2">
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useMyPageStore } from '@/stores/mypage';
import { storeToRefs } from 'pinia';

const { userInfo } = storeToRefs(useMyPageStore());

const flattenedUserRows = computed(() => [
  { label: '닉네임', value: userInfo.value.nickname },
  { label: '이메일', value: userInfo.value.email },
  { label: '이름', value: userInfo.value.name },
  { label: '거주지', value: userInfo.value.residence },
]);
</script>

<style scoped>
/* 📦 info-section: 전체 박스 스타일 */
.info-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 1.5rem 1.5rem;
  border-radius: 14px;
  background-color: #f9f9f9; /* ✨ 연한 회색 배경 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03); /* ✨ 살짝의 그림자 */
  font-family: 'Pretendard', sans-serif;
}

/* 📝 section-title: 상단 타이틀 */
.section-title {
  font-weight: 700;
  font-size: 1.25rem;
  border-bottom: 1px solid #ddd;
  padding-bottom: 0.5rem;
  margin-bottom: 1.2rem;
  color: #222;
}

/* 🧾 label-value layout */
.label {
  font-weight: 600;
  width: 90px;
  min-width: 90px;
  color: #666;
  flex-shrink: 0;
}

.value {
  font-weight: 500;
  color: #222;
  word-break: break-word;
  flex-grow: 1;
  text-align: right;
}

/* 📏 행 구조용 d-flex 적용 (부트스트랩에 이미 있을 수도 있음) */
.d-flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.col-md-6 {
  padding-bottom: 0.8rem;
  border-bottom: 1px solid #eee;
}

/* ✅ 모바일 환경 여백 다듬기 */
@media (max-width: 767px) {
  .value {
    text-align: left;
    margin-top: 0.2rem;
  }

  .d-flex {
    flex-direction: column;
    align-items: flex-start;
  }

  .col-md-6 {
    border-bottom: 1px solid #eee;
    padding-bottom: 1rem;
  }
}
</style>
