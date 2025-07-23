<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '../../stores/auth';

const props = defineProps({
  show: Boolean,
});
const emit = defineEmits(['close']);
const authStore = useAuthStore();

const step = ref('email'); // 'email' | 'verify' | 'reset' | 'done'
const email = ref('');
const code = ref('');
const codeSent = ref(false);
const codeVerified = ref(false);
const newPassword = ref('');
const confirmPassword = ref('');
const message = ref('');
const loading = ref(false);

watch(() => props.show, (val) => {
  if (!val) resetAll();
});

function resetAll() {
  step.value = 'email';
  email.value = '';
  code.value = '';
  codeSent.value = false;
  codeVerified.value = false;
  newPassword.value = '';
  confirmPassword.value = '';
  message.value = '';
  loading.value = false;
}

async function sendCode() {
  loading.value = true;
  message.value = '';
  try {
    await authStore.sendEmail(email.value);
    codeSent.value = true;
    step.value = 'verify';
    message.value = '인증번호가 전송되었습니다.';
  } catch (e) {
    message.value = '이메일 전송에 실패했습니다.';
  } finally {
    loading.value = false;
  }
}

async function verifyCode() {
  loading.value = true;
  message.value = '';
  try {
    await authStore.checkEmailCode(email.value, code.value);
    if (authStore.emailVerified) {
      codeVerified.value = true;
      step.value = 'reset';
      message.value = '이메일 인증 성공!';
    } else {
      message.value = '인증번호가 올바르지 않습니다.';
    }
  } catch (e) {
    message.value = '인증에 실패했습니다.';
  } finally {
    loading.value = false;
  }
}

async function resetPassword() {
  if (!newPassword.value || newPassword.value !== confirmPassword.value) {
    message.value = '비밀번호가 일치하지 않습니다.';
    return;
  }
  loading.value = true;
  message.value = '';
  try {
    const data = await authStore.resetPassword({
      email: email.value,
      newPassword: newPassword.value,
    });
    if (data.success) {
      step.value = 'done';
      message.value = '비밀번호가 성공적으로 변경되었습니다.';
    } else {
      message.value = data.message || '비밀번호 변경에 실패했습니다.';
    }
  } catch (e) {
    message.value = '비밀번호 변경 요청에 실패했습니다.';
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('close')">&times;</button>
      <div class="modal-title">비밀번호 재설정</div>
      <div v-if="step === 'email'">
        <input v-model="email" type="email" placeholder="이메일 입력" style="width:100%;margin-bottom:8px;" />
        <button class="modal-btn" @click="sendCode" :disabled="loading || !email">이메일 인증 보내기</button>
      </div>
      <div v-else-if="step === 'verify'">
        <input v-model="code" type="text" placeholder="인증번호 입력" style="width:100%;margin-bottom:8px;" />
        <button class="modal-btn" @click="verifyCode" :disabled="loading || !code">인증 확인</button>
      </div>
      <div v-else-if="step === 'reset'">
        <input v-model="newPassword" type="password" placeholder="새 비밀번호 입력" style="width:100%;margin-bottom:8px;" />
        <input v-model="confirmPassword" type="password" placeholder="비밀번호 확인" style="width:100%;margin-bottom:8px;" />
        <button class="modal-btn" @click="resetPassword" :disabled="loading || !newPassword || !confirmPassword">비밀번호 변경</button>
      </div>
      <div v-else-if="step === 'done'">
        <div style="color:#8ab191;font-weight:bold;">{{ message }}</div>
        <button class="modal-btn" @click="$emit('close')">닫기</button>
      </div>
      <div v-if="message && step !== 'done'" style="margin-top:12px;color:#d32f2f;">{{ message }}</div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.25);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
}
.modal-content {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0,0,0,0.18);
  padding: 28px 24px 20px 24px;
  min-width: 320px;
  max-width: 440px;
  max-height: 80vh;
  overflow-y: auto;
  position: relative;
  animation: modal-fade-in 0.2s;
}
.modal-title {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 18px;
  text-align: center;
  color: #4a6c4f;
}
.modal-btn {
  width: 100%;
  box-sizing: border-box;
  text-align: center;
  padding: 10px 0;
  margin: 0;
  border-radius: 8px;
  border: 1.5px solid #8ab191;
  background: #f5f8f6;
  color: #4a6c4f;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.15s, color 0.15s;
  min-width: 0;
  margin-bottom: 8px;
}
.modal-btn:hover {
  background: #e0ede3;
  color: #2d4d36;
  border-color: #4a6c4f;
}
.modal-close {
  position: absolute;
  top: 14px;
  right: 18px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #b0b0b0;
  cursor: pointer;
  transition: color 0.15s;
  z-index: 10;
}
.modal-close:hover {
  color: #4a6c4f;
}
</style> 