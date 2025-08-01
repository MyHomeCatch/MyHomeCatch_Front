<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import axios from 'axios';

const authStore = useAuthStore();
const { user, token } = storeToRefs(authStore);

const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

const currentPasswordError = ref('');
const newPasswordError = ref('');
const confirmPasswordError = ref('');
const generalMessage = ref('');

const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

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

watch([newPassword, confirmPassword], () => {
  if (
    newPassword.value &&
    confirmPassword.value &&
    newPassword.value !== confirmPassword.value
  ) {
    confirmPasswordError.value = '새 비밀번호가 일치하지 않습니다.';
  } else {
    confirmPasswordError.value = '';
  }
});

const updatePassword = async () => {
  generalMessage.value = '';
  currentPasswordError.value = '';
  newPasswordError.value = '';
  confirmPasswordError.value = '';

  if (!currentPassword.value) {
    currentPasswordError.value = '현재 비밀번호를 입력해주세요.';
    return;
  }
  if (!newPassword.value) {
    newPasswordError.value = '새 비밀번호를 입력해주세요.';
    return;
  }
  if (!confirmPassword.value) {
    confirmPasswordError.value = '새 비밀번호 확인을 입력해주세요.';
    return;
  }

  if (newPassword.value !== confirmPassword.value) {
    confirmPasswordError.value = '새 비밀번호가 일치하지 않습니다.';
    return;
  }

  // 3. 비밀번호 강도 검사 (예시: 최소 8자)
  //   if (newPassword.value.length < 8) {
  //     newPasswordError.value = '새 비밀번호는 최소 8자 이상이어야 합니다.';
  //     return;
  //   }

  try {
    const updateData = {
      email: user.value.email,
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    };

    const res = await axios.put(
      '/api/api/user/password-change',
      updateData,
      getAuthConfig()
    );

    if (res.status === 200) {
      generalMessage.value = '비밀번호가 성공적으로 변경되었습니다.';
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
    } else {
      generalMessage.value = '비밀번호 변경에 실패했습니다. 다시 시도해주세요.';
    }
  } catch (err) {
    console.error('비밀번호 변경 실패:', err);
    if (err.response && err.response.data) {
      const errorMessage = err.response.data.message || err.response.data;
      if (errorMessage.includes('현재 비밀번호가 일치하지 않습니다.')) {
        currentPasswordError.value = errorMessage;
      } else if (
        errorMessage.includes('새 비밀번호는 현재 비밀번호와 달라야 합니다.')
      ) {
        newPasswordError.value = errorMessage;
      } else {
        generalMessage.value = `비밀번호 변경 실패: ${errorMessage}`;
      }
    } else {
      generalMessage.value = '비밀번호 변경 중 오류가 발생했습니다.';
    }
  }
};

const cancel = () => {
  history.back();
};
</script>

<template>
  <div class="password-form-container">
    <h4 class="form-title">비밀번호 변경</h4>

    <div
      v-if="generalMessage"
      :class="{
        'alert alert-success': generalMessage.includes('성공'),
        'alert alert-danger': generalMessage.includes('실패'),
      }"
      role="alert"
    >
      {{ generalMessage }}
    </div>

    <div class="form-section">
      <h5 class="section-title">비밀번호 변경</h5>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">현재 비밀번호</label>
          <div class="password-input-container">
            <input
              :type="showCurrentPassword ? 'text' : 'password'"
              class="form-control"
              v-model="currentPassword"
              @input="currentPasswordError = ''"
              placeholder="현재 비밀번호를 입력하세요"
            />
            <i
              :class="showCurrentPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"
              class="password-toggle"
              @click="showCurrentPassword = !showCurrentPassword"
            ></i>
          </div>
          <div v-if="currentPasswordError" class="text-danger small mt-1">
            {{ currentPasswordError }}
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">새 비밀번호</label>
          <div class="password-input-container">
            <input
              :type="showNewPassword ? 'text' : 'password'"
              class="form-control"
              v-model="newPassword"
              @input="newPasswordError = ''"
              placeholder="새 비밀번호를 입력하세요"
            />
            <i
              :class="showNewPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"
              class="password-toggle"
              @click="showNewPassword = !showNewPassword"
            ></i>
          </div>
          <div v-if="newPasswordError" class="text-danger small mt-1">
            {{ newPasswordError }}
          </div>
        </div>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label class="form-label">새 비밀번호 확인</label>
          <div class="password-input-container">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              class="form-control"
              v-model="confirmPassword"
              @input="confirmPasswordError = ''"
              placeholder="새 비밀번호를 다시 입력하세요"
            />
            <i
              :class="showConfirmPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"
              class="password-toggle"
              @click="showConfirmPassword = !showConfirmPassword"
            ></i>
          </div>
          <div v-if="confirmPasswordError" class="text-danger small mt-1">
            {{ confirmPasswordError }}
          </div>
        </div>
      </div>
    </div>

    <div class="form-actions">
      <button class="btn btn-secondary cancel-btn" @click="cancel">취소</button>
      <button class="btn btn-success update-btn" @click="updatePassword">
        변경
      </button>
    </div>
  </div>
</template>

<style scoped>
.password-form-container {
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
  background: linear-gradient(90deg, #86a788, #6b8a6d);
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
  border-color: #86a788;
  color: #86a788;
}

.cancel-btn:hover {
  background-color: #f8f9fa;
  border-color: #6b8a6d;
  color: #6b8a6d;
}

.update-btn {
  padding: 0.75rem 3rem;
  border-radius: 6px;
  font-weight: 500;
  background-color: #86a788;
  border-color: #86a788;
  min-width: 140px;
}

.update-btn:hover {
  background-color: #6b8a6d;
  border-color: #6b8a6d;
}

.alert {
  border-radius: 6px;
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .form-section {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .cancel-btn,
  .update-btn {
    width: 100%;
  }
}
</style>
