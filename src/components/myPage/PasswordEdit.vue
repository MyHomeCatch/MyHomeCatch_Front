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
  <div>
    <h4 class="fw-bold mb-3">비밀번호 변경</h4>

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

    <!-- 현재 비밀번호 -->
    <div class="mb-3 position-relative">
      <label class="form-label">현재 비밀번호</label>
      <input
        :type="showCurrentPassword ? 'text' : 'password'"
        class="form-control pe-5"
        v-model="currentPassword"
        @input="currentPasswordError = ''"
      />
      <i
        :class="showCurrentPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"
        class="position-absolute end-0 me-3 text-secondary"
        style="
          top: 50%; /* 부모 div의 중앙에 오도록 조정 */
          transform: translateY(-50%); /* 정확한 수직 중앙 정렬 */
          cursor: pointer;
          z-index: 10; /* 입력 필드 위에 표시되도록 z-index 설정 */
        "
        @click="showCurrentPassword = !showCurrentPassword"
      ></i>
      <div v-if="currentPasswordError" class="text-danger small mt-1">
        {{ currentPasswordError }}
      </div>
    </div>

    <!-- 새 비밀번호 -->
    <div class="mb-3 position-relative">
      <label class="form-label">새 비밀번호</label>
      <input
        :type="showNewPassword ? 'text' : 'password'"
        class="form-control pe-5"
        v-model="newPassword"
        @input="newPasswordError = ''"
      />
      <i
        :class="showNewPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"
        class="position-absolute end-0 me-3 text-secondary"
        style="
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          z-index: 10;
        "
        @click="showNewPassword = !showNewPassword"
      ></i>
      <div v-if="newPasswordError" class="text-danger small mt-1">
        {{ newPasswordError }}
      </div>
    </div>

    <!-- 새 비밀번호 확인 -->
    <div class="mb-3 position-relative">
      <label class="form-label">새 비밀번호 확인</label>
      <input
        :type="showConfirmPassword ? 'text' : 'password'"
        class="form-control pe-5"
        v-model="confirmPassword"
        @input="confirmPasswordError = ''"
      />
      <i
        :class="showConfirmPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"
        class="position-absolute end-0 me-3 text-secondary"
        style="
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
          z-index: 10;
        "
        @click="showConfirmPassword = !showConfirmPassword"
      ></i>
      <div v-if="confirmPasswordError" class="text-danger small mt-1">
        {{ confirmPasswordError }}
      </div>
    </div>

    <div class="mt-4">
      <button class="btn btn-secondary me-2" @click="cancel">취소</button>
      <button class="btn btn-primary" @click="updatePassword">변경</button>
    </div>
  </div>
</template>
