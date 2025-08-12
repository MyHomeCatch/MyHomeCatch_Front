<script setup>
import { ref, onMounted } from 'vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

const isLoading = ref(true);

onMounted(async () => {
  // 예시: 2초 후 로딩 종료
  await new Promise((resolve) => setTimeout(resolve, 2000));
  isLoading.value = false;
});
</script>

<template>
  <div>
    <LoadingSpinner v-if="isLoading" />
    <div v-else>
      <!-- 실제 컨텐츠 -->
      <h1>페이지 본문입니다</h1>
    </div>
  </div>
</template>
