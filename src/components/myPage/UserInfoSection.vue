<template>
  <div class="info-section py-3 mt-4">
    <h4 class="section-title mb-4">내 정보 ✏️</h4>
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
