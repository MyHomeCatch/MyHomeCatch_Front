<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import axios from 'axios'; // axios 임포트 추가

const authStore = useAuthStore();
const { user, token } = storeToRefs(authStore); // Pinia store에서 user와 token 가져오기

// 폼 상태
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');

// 에러 메시지 상태
const currentPasswordError = ref('');
const newPasswordError = ref(''); // 새 비밀번호 유효성 검사 오류
const confirmPasswordError = ref(''); // 새 비밀번호 확인 일치 오류
const generalMessage = ref(''); // API 통신 성공/실패 메시지

// 비밀번호 가시성 토글 상태 (각 필드별로 분리)
const showCurrentPassword = ref(false);
const showNewPassword = ref(false);
const showConfirmPassword = ref(false);

// 토큰 헤더 반환 함수
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

// 새 비밀번호와 확인 비밀번호 일치 여부 실시간 감시
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
  // 메시지 및 오류 초기화
  generalMessage.value = '';
  currentPasswordError.value = '';
  newPasswordError.value = '';
  confirmPasswordError.value = '';

  // 1. 필수 필드 검사
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

  // 2. 새 비밀번호와 확인 비밀번호 일치 검사
  if (newPassword.value !== confirmPassword.value) {
    confirmPasswordError.value = '새 비밀번호가 일치하지 않습니다.';
    return;
  }

  // 3. 비밀번호 강도 검사 (예시: 최소 8자)
  //   if (newPassword.value.length < 8) {
  //     newPasswordError.value = '새 비밀번호는 최소 8자 이상이어야 합니다.';
  //     return;
  //   }
  // TODO: 더 복잡한 비밀번호 강도 규칙 추가 (대문자, 숫자, 특수문자 포함 등)

  try {
    // API 요청을 위한 데이터
    const updateData = {
      email: user.value.email, // 현재 로그인된 사용자의 이메일 (백엔드 식별용)
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    };

    // Pinia 스토어의 resetPassword 액션 호출
    // authStore.resetPassword 액션이 currentPassword와 newPassword를 받도록 수정되어야 합니다.
    // 현재 auth.js Canvas의 resetPassword는 email, newPassword만 받습니다.
    // 따라서 auth.js의 resetPassword 액션을 수정하거나,
    // 아니면 여기서 직접 axios.put 또는 axios.patch를 사용해야 합니다.
    // 여기서는 직접 axios를 사용하는 방식으로 예시를 듭니다.
    // 만약 authStore를 통해 처리하고 싶다면, auth.js의 resetPassword 액션을 업데이트해야 합니다.
    const res = await axios.put(
      '/api/user/password-change',
      updateData,
      getAuthConfig()
    ); // 예시 엔드포인트

    if (res.status === 200) {
      generalMessage.value = '비밀번호가 성공적으로 변경되었습니다.';
      // 성공 시 입력 필드 초기화
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

    <!-- API 통신 메시지 표시 영역 -->
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

      <!-- 현재 비밀번호 -->
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

      <!-- 새 비밀번호 -->
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

      <!-- 새 비밀번호 확인 -->
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
