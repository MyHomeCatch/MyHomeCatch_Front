<script setup>
import { ref } from 'vue';
import { useAuthStore } from '../../stores/auth';
import { useRouter } from 'vue-router';

const router = useRouter();
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
  if (!success) errorMessage.value = '로그인 실패';
};

const goToSignUp = () => {
  router.push('/join');
};
</script>

<template>
  <div class="auth-bg">
    <div class="auth-card">
      <div class="auth-card-bar"></div>
      <h2 class="auth-title">LOG IN</h2>
      <form @submit.prevent="handleLogin">
        <div class="auth-input-group">
          <label>Email</label>
          <input type="email" v-model="email" required autocomplete="username" />
        </div>
        <div class="auth-input-group">
          <label>Password</label>
          <input type="password" v-model="password" required autocomplete="current-password" />
        </div>
        <div class="auth-divider">
          <span>Social LogIn</span>
        </div>
        <div class="auth-social-row">
          <button type="button" class="auth-social-btn">
            <span class="icon-google"></span> Google
          </button>
          <button type="button" class="auth-social-btn">
            <span class="icon-kakao"></span> Kakao
          </button>
        </div>
        <div class="auth-forgot">
          <a href="#">Forgot Password</a>
        </div>
        <button type="submit" class="auth-submit">Log In</button>
        <div v-if="errorMessage" class="auth-error">{{ errorMessage }}</div>
      </form>
    </div>
    <div class="auth-side">
      <p>Don't have an account?</p>
      <button class="auth-side-btn" @click="goToSignUp">Sign Up</button>
    </div>
  </div>
</template>

<style scoped>
.auth-bg {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafbfa;
  gap: 40px;
}
.auth-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.12);
  width: 400px;
  padding: 40px 36px 32px 36px;
  position: relative;
  display: flex;
  flex-direction: column;
}
.auth-card-bar {
  height: 10px;
  width: 100%;
  background: #8ab191;
  border-radius: 8px 8px 0 0;
  position: absolute;
  top: 0; left: 0;
}
.auth-title {
  color: #7a9c7e;
  font-weight: bold;
  font-size: 2rem;
  margin: 32px 0 32px 0;
  letter-spacing: 1px;
}
.auth-input-group {
  margin-bottom: 24px;
}
.auth-input-group label {
  display: block;
  color: #888;
  font-size: 1.1rem;
  margin-bottom: 6px;
}
.auth-input-group input {
  width: 100%;
  border: none;
  border-bottom: 2px solid #e0e0e0;
  font-size: 1.1rem;
  padding: 8px 0;
  outline: none;
  background: transparent;
  color: #444;
  transition: border-color 0.2s;
}
.auth-input-group input:focus {
  border-bottom: 2px solid #8ab191;
}
.auth-divider {
  display: flex;
  align-items: center;
  margin: 28px 0 16px 0;
  color: #aaa;
  font-size: 1rem;
}
.auth-divider::before,
.auth-divider::after {
  content: "";
  flex: 1;
  height: 1px;
  background: #e0e0e0;
  margin: 0 10px;
}
.auth-social-row {
  display: flex;
  gap: 12px;
  margin-bottom: 10px;
}
.auth-social-btn {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: #f5f5f5;
  border: none;
  border-radius: 8px;
  padding: 8px 0;
  font-size: 1rem;
  color: #444;
  cursor: pointer;
  transition: box-shadow 0.15s;
  box-shadow: 0 1px 2px rgba(0,0,0,0.04);
}
.auth-social-btn:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}
.icon-google {
  width: 20px; height: 20px; display: inline-block;
  background: url('https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg') no-repeat center/contain;
}
.icon-kakao {
  width: 20px; height: 20px; display: inline-block;
  background: url('https://developers.kakao.com/assets/img/about/logos/kakaolink/kakaolink_btn_medium.png') no-repeat center/contain;
  border-radius: 50%;
  background-color: #fee500;
  border: 1px solid #e0e0e0;
}
.auth-forgot {
  margin: 8px 0 18px 0;
  text-align: left;
}
.auth-forgot a {
  color: #888;
  font-size: 0.98rem;
  text-decoration: none;
}
.auth-submit {
  width: 100%;
  background: #8ab191;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 0;
  font-size: 1.15rem;
  font-weight: bold;
  margin-top: 8px;
  box-shadow: 0 2px 8px rgba(138,177,145,0.08);
  transition: background 0.2s;
}
.auth-submit:hover {
  background: #7a9c7e;
}
.auth-error {
  color: #d32f2f;
  margin-top: 10px;
  text-align: center;
}
.auth-side {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.08);
  width: 300px;
  height: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.auth-side p {
  color: #888;
  font-size: 1.15rem;
  margin-bottom: 18px;
}
.auth-side-btn {
  background: #fff;
  color: #888;
  border: none;
  border-radius: 24px;
  padding: 10px 32px;
  font-size: 1.1rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  transition: background 0.15s, color 0.15s;
  cursor: pointer;
}
.auth-side-btn:hover {
  background: #8ab191;
  color: #fff;
}
@media (max-width: 900px) {
  .auth-bg { flex-direction: column; gap: 20px; }
  .auth-side { width: 90vw; height: 120px; }
}
</style>