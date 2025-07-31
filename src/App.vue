<script setup>
import { onMounted } from 'vue';
import { useAuthStore } from './stores/auth';
import { RouterView } from 'vue-router';
import DefaultLayout from './components/DefaultLayout.vue';
import AccountMenuGroup from './components/menu/AccountMenuGroup.vue';
const authStore = useAuthStore();

onMounted(async () => {
  if (authStore.token) {
    console.log('App.vue: 토큰 존재, fetchUserInfo 호출');
    await authStore.fetchUserInfo();
  }
});
</script>

<template>
  <DefaultLayout>
    <RouterView />
  </DefaultLayout>
</template>

<style scoped></style>
