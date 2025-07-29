<template>
  <div class="score-card">
    <div class="score-body">
      <p class="score-title">나의 청약 가점</p>
      <small class="score-date">📅 2025-07-18일 기준</small>
      <div class="score-value">{{ score }}점</div>
      <button class="score-button" @click="$emit('openModal')">
        가점 계산
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ score: Number });
</script>

<style scoped>
.score-card {
  width: 320px;
  padding: 1.2rem;
  border-radius: 16px;
  background-color: #f5eee6;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  font-family: 'Pretendard', sans-serif;
  text-align: center;
}

.score-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.score-title {
  font-size: 0.92rem;
  font-weight: 600;
  color: #444;
  margin-bottom: 0.2rem;
}

.score-date {
  font-size: 0.75rem;
  color: #888;
}

.score-value {
  font-size: 2rem; /* ✅ 조금 더 작게 */
  font-weight: 700;
  color: #3d6650;
  margin: 0.8rem 0;
}

.score-button {
  padding: 0.4rem 1.1rem;
  font-size: 0.85rem;
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
