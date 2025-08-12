<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import axios from 'axios';

const authStore = useAuthStore();
const { user, token } = storeToRefs(authStore);

const router = useRouter();

const password = ref('');
const confirm = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);

const getAuthConfig = () => {
  if (token.value) {
    return {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    };
  }
  return {};
};

const deleteAccount = async () => {
  errorMessage.value = '';

  if (!password.value) {
    errorMessage.value = '비밀번호를 입력해주세요.';
    return;
  }

  if (!confirm.value) {
    errorMessage.value = '계정 삭제에 동의해주세요.';
    return;
  }

  const isConfirmed = window.confirm(
    '정말로 회원 탈퇴하시겠습니까? 탈퇴 후에는 계정을 복구할 수 없습니다.'
  );
  if (!isConfirmed) {
    return;
  }

  console.log('회원 탈퇴 요청 직전 user.value.email:', user.value.email);
  console.log('회원 탈퇴 요청 직전 password.value:', password.value);

  try {
    const result = await authStore.withdrawUser({
      email: user.value.email,
      currentPassword: password.value,
    });

    if (result.success) {
      alert(result.message || '회원 탈퇴가 완료되었습니다.');
      router.push('/byeComplete');
    } else {
      errorMessage.value = result.message || '회원 탈퇴에 실패했습니다.';
    }
  } catch (error) {
    console.error('회원 탈퇴 실패 (컴포넌트 레벨 catch):', error);
    errorMessage.value =
      authStore.errorMessage || '회원 탈퇴 중 알 수 없는 오류가 발생했습니다.';
  }
};

watch(confirm, (newVal) => {
  if (newVal) {
    errorMessage.value = '';
  }
});

const cancel = () => {
  history.back();
};
</script>

<template>
  <div class="withdrawal-form-container">
    <h4 class="form-title">회원 탈퇴</h4>

    <div class="form-section">
      <h5 class="section-title">회원 탈퇴</h5>

      <p class="withdrawal-notice">
        회원 탈퇴를 진행하려면 비밀번호를 입력하고, 동의 항목을 체크하세요.
      </p>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">비밀번호 확인</label>
          <div class="password-input-container">
            <input
              :type="showPassword ? 'text' : 'password'"
              class="form-control"
              v-model="password"
              placeholder="현재 비밀번호 입력"
            />
            <i
              :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"
              class="password-toggle"
              @click="showPassword = !showPassword"
            ></i>
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <div class="form-check">
            <input
              class="form-check-input"
              type="checkbox"
              id="confirmDelete"
              v-model="confirm"
            />
            <label class="form-check-label" for="confirmDelete">
              계정 삭제에 동의합니다.
            </label>
          </div>
        </div>
      </div>

      <div v-if="errorMessage" class="text-danger small mt-2">
        {{ errorMessage }}
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary cancel-btn" @click="cancel">취소</button>
      <button class="btn btn-danger withdrawal-btn" @click="deleteAccount">
        회원 탈퇴
      </button>
    </div>
  </div>
</template>

<style scoped>
.withdrawal-form-container {
  max-width: 100%;
}

.form-title {
  font-weight: 700;
  margin-bottom: 2rem;
  color: #2c3e50;
  font-size: 1.8rem;
  position: relative;
  padding-bottom: 0.5rem;
}

.form-title::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 60px;
  height: 3px;
  background: linear-gradient(90deg, #dc3545, #c82333);
  border-radius: 2px;
}

.form-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.section-title {
  font-weight: bold;
  margin-bottom: 1.5rem;
  color: #495057;
  font-size: 1.4rem;
}

.withdrawal-notice {
  color: #6c757d;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
  line-height: 1.5;
}

.form-row {
  margin-bottom: 1.5rem;
}

.form-group {
  width: 100%;
}

.form-label {
  font-weight: 500;
  color: #495057;
  margin-bottom: 0.5rem;
  display: block;
}

.form-control {
  border: 1px solid #ced4da;
  border-radius: 6px;
  padding: 0.75rem;
  font-size: 0.95rem;
  transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
}

.form-control:focus {
  border-color: #007bff;
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.password-input-container {
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  color: #6c757d;
  z-index: 10;
}

.password-toggle:hover {
  color: #495057;
}

.form-check {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.form-check-input {
  width: 1.2rem;
  height: 1.2rem;
  margin: 0;
}

.form-check-label {
  font-weight: 500;
  color: #495057;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
}

.cancel-btn {
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-weight: 500;
  background-color: white;
  border-color: #dc3545;
  color: #dc3545;
}

.cancel-btn:hover {
  background-color: #f8f9fa;
  border-color: #c82333;
  color: #c82333;
}

.withdrawal-btn {
  padding: 0.75rem 2rem;
  border-radius: 6px;
  font-weight: 500;
  background-color: #dc3545;
  border-color: #dc3545;
}

.withdrawal-btn:hover {
  background-color: #c82333;
  border-color: #bd2130;
}

@media (max-width: 768px) {
  .form-section {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .withdrawal-btn {
    width: 100%;
  }
}
</style>
