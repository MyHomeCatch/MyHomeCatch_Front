<script setup>
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
</script>

<template>
  <div class="container mt-5">
    <h2>마이페이지</h2>
    <div class="card p-3 mt-3">
      <p><strong>이름:</strong> {{ user.name }}</p>
      <p><strong>닉네임:</strong> {{ user.nickname }}</p>
      <p><strong>이메일:</strong> {{ user.email }}</p>
      <p><strong>생일:</strong> {{ user.birthday }}</p>
      <p><strong>주소:</strong> {{ user.address }}</p>
    </div>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
}
</style>
