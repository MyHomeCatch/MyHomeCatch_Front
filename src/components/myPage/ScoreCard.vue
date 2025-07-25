<template>
  <div class="card w-100 mt-4 text-center">
    <div class="card-body">
      <p class="mb-1 fw-bold">나의 청약 가점</p>
      <small class="text-muted">2025-07-18일 기준</small>
      <h2 class="my-3">{{ score }}점</h2>
      <button
        class="btn btn-outline-primary btn-sm"
        @click="$emit('openModal')"
      >
        가점 계산
      </button>
    </div>
  </div>
</template>

<script setup>
defineProps({ score: Number });
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;
}

.card:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.12); /* ✨ 마우스 호버 시 살짝 강조 */
}

.card-body {
  padding: 1rem 1.25rem;
}

.card h2 {
  font-weight: bold;
}
</style>
