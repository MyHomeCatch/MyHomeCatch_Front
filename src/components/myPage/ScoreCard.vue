<template>
  <div class="score-card">
    <div class="score-body">
      <p class="score-title">나의 청약 가점</p>
      <small class="score-date">📅 2025-07-18일 기준</small>
      <div class="score-value">{{ userInfo.additionalPoint }}점</div>
      <button class="score-button" @click="$emit('openModal')">
        가점 계산
      </button>
    </div>
  </div>
</template>

<script setup>
import { useMyPageStore } from '@/stores/mypage';
import { storeToRefs } from 'pinia';

const store = useMyPageStore();
const { userInfo } = storeToRefs(store);
</script>

<style scoped>
.score-card {
  width: 260px; /* 🔽 크기 줄임 */
  padding: 1rem; /* 🔽 패딩 소폭 축소 */
  border-radius: 14px;
  background-color: #f5eee6;
  box-shadow: 0 3px 8px rgba(0, 0, 0, 0.05);
  font-family: 'Pretendard', sans-serif;
  text-align: center;
}

.score-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-title {
  font-size: 0.88rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 0.2rem;
}

.score-date {
  font-size: 0.72rem;
  color: #888;
}

.score-value {
  font-size: 1.7rem; /* 🔽 약간 줄임 */
  font-weight: 700;
  color: #3d6650;
  margin: 0.7rem 0 1rem;
}

.score-button {
  padding: 0.35rem 1rem; /* 🔽 패딩 줄임 */
  font-size: 0.8rem;
  font-weight: 500;
  background-color: white;
  color: #3d6650;
  border: 1px solid #3d6650;
  border-radius: 10px;
  transition: all 0.2s ease-in-out;
}

.score-button:hover {
  background-color: #3d6650;
  color: #fff;
}
</style>
