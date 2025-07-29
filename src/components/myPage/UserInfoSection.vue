<script setup>
import { computed } from 'vue';

const props = defineProps({
  userInfo: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      nickname: '',
      email: '',
      residence: '',
      preferredRegions: [],
      hasSubscriptionAccount: '',
    }),
  },
});

const infoRows = computed(() => [
  [
    { label: '이름', value: props.userInfo.name },
    { label: '거주지', value: props.userInfo.residence },
  ],
  [
    { label: '닉네임', value: props.userInfo.nickname },
    { label: '선호 지역', value: props.userInfo.preferredRegions.join(', ') },
  ],
  [
    { label: '이메일', value: props.userInfo.email },
    { label: '청약통장', value: props.userInfo.hasSubscriptionAccount },
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
.info-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 1rem 2rem;
  background-color: transparent;
  border-color: #e0e0e0 !important;
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
