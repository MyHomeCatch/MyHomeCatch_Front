<template>
  <div class="pdf-summary-wrapper">
    <button class="close-btn" @click="$emit('close')">✕</button>
    <!-- 요약 내용 보여주기 -->
    <div>
      <h3>공고 요약</h3>
      <p>{{ summaryData || '요약 내용이 없습니다.' }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  summaryData: String,
});
</script>

<style scoped>
.pdf-summary-wrapper {
  width: 350px;
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
  padding: 16px;
  box-sizing: border-box;
  position: fixed;
  top: 20px;
  right: 20px;
  height: calc(100vh - 40px);
  overflow-y: auto;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.15);
  animation: slideIn 0.3s ease forwards;
  z-index: 1000;
}

.close-btn {
  position: absolute;
  top: 12px;
  right: 12px;
  background: transparent;
  border: none;
  font-size: 20px;
  cursor: pointer;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(100%);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}
</style>
