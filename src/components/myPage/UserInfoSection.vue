<script setup>
import { computed } from 'vue';
import { useMyPageStore } from '@/stores/mypage';
import { storeToRefs } from 'pinia';

const { userInfo } = storeToRefs(useMyPageStore());

const infoRows = computed(() => [
  [
    { label: '이름', value: userInfo.value.name },
    { label: '이메일', value: userInfo.value.email },
  ],
  [
    { label: '닉네임', value: userInfo.value.nickname },
    { label: '거주지', value: userInfo.value.residence },
  ],
]);
</script>

<template>
  <div class="info-section py-3 mt-4">
    <h4 class="section-title mb-4">내 정보 ✏️</h4>
    <div class="info-table">
      <div class="info-row" v-for="(row, rowIndex) in infoRows" :key="rowIndex">
        <div class="info-col" v-for="(item, colIndex) in row" :key="colIndex">
          <div class="label">{{ item.label }}</div>
          <div class="value">{{ item.value }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 스타일은 그대로 유지 */
.info-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 2rem;
}
.section-title {
  font-weight: 700;
  font-size: 1.25rem;
  border-bottom: 1px solid #ccc;
  padding-bottom: 0.5rem;
}
.info-table {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}
.info-row {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}
.info-col {
  display: flex;
  gap: 0.5rem;
  min-width: 45%;
}
.label {
  font-weight: 600;
  width: 90px;
  color: #666;
}
.value {
  font-weight: 500;
  color: #222;
  word-break: break-word;
}
</style>
