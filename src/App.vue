<script setup>
import { watch } from 'vue';
import { useAuthStore } from './stores/auth';
import { RouterView } from 'vue-router';
import DefaultLayout from './components/DefaultLayout.vue';

const authStore = useAuthStore();

watch(
  () => authStore.token,
  async (newToken) => {
    if (newToken) {
      console.log('토큰 변경 감지, fetchUserInfo 호출');
      await authStore.fetchUserInfo();
    }
  },
  { immediate: true }
);
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<style scoped></style>
