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
  <div id="app">
    <DefaultLayout>
      <RouterView />
    </DefaultLayout>
  </div>
</template>

<style scoped>
#app {
  background-image: url('@/assets/images/background1.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-attachment: fixed;
  background-position: center;
  min-height: 100vh;
}
</style>
