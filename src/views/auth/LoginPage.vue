<template>
  <div>
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input type="email" v-model="email" required />
      <input
        type="password"
        v-model="password"
        placeholder="비밀번호"
        required
      />
      <button type="submit">Login</button>
    </form>
    <p v-if="errorMessage" class="error">{{ errorMessage }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../store/auth';

const email = ref('');
const password = ref('');
const errorMessage = ref('');
const authStore = useAuthStore();

const handleLogin = async () => {
  errorMessage.value = '';
  const success = await authStore.login({
    email: email.value,
    password: password.value,
  });
  if (success) {
    console.log('로그인 성공 token: ', authStore.token);
  }
  if (!success) errorMessage.value = '로그인 실패';
};
</script>
