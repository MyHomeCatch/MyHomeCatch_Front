<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';
import axios from 'axios';

const authStore = useAuthStore();
const { user, token } = storeToRefs(authStore);

const router = useRouter(); // ✅ router 객체 생성

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
  // ✅ async 키워드 추가
  errorMessage.value = ''; // 에러 메시지 초기화

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
    // 사용자가 '취소'를 눌렀을 경우, 탈퇴 절차 중단
    return;
  }

  console.log('회원 탈퇴 요청 직전 user.value.email:', user.value.email);
  console.log('회원 탈퇴 요청 직전 password.value:', password.value);

  try {
    // Pinia 스토어의 withdrawUser 액션 호출
    const result = await authStore.withdrawUser({
      email: user.value.email,
      currentPassword: password.value,
    });

    if (result.success) {
      alert(result.message || '회원 탈퇴가 완료되었습니다.');
      router.push('/byeComplete'); // 탈퇴 성공 시 완료 페이지로 이동
    } else {
      // 실패 메시지는 authStore.errorMessage에 이미 설정되어 있음
      errorMessage.value = result.message || '회원 탈퇴에 실패했습니다.';
    }
  } catch (error) {
    // authStore.withdrawUser에서 이미 에러 처리 및 메시지 설정
    // 여기서는 추가적인 에러 처리 로직이 필요 없을 수 있음
    console.error('회원 탈퇴 실패 (컴포넌트 레벨 catch):', error);
    errorMessage.value =
      authStore.errorMessage || '회원 탈퇴 중 알 수 없는 오류가 발생했습니다.';
  }
};

// 동의 체크박스가 true로 바뀌면 에러 메시지 제거
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
  <div>
    <h4 class="fw-bold mb-3 text-danger">회원 탈퇴</h4>

    <p class="text-muted">
      회원 탈퇴를 진행하려면 비밀번호를 입력하고, 동의 항목을 체크하세요.
    </p>

    <!-- 비밀번호 입력란 -->
    <div class="mb-3 position-relative">
      <label class="form-label">비밀번호 확인</label>
      <input
        :type="showPassword ? 'text' : 'password'"
        class="form-control pe-5"
        v-model="password"
        placeholder="현재 비밀번호 입력"
      />
      <i
        :class="showPassword ? 'bi bi-eye' : 'bi bi-eye-slash'"
        class="position-absolute end-0 me-3 text-secondary"
        style="
          top: 55%;
          transform: translateY(-5%);
          cursor: pointer;
          position: absolute;
        "
        @click="showPassword = !showPassword"
      ></i>
    </div>

    <!-- 동의 체크박스 -->
    <div class="form-check mb-3">
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

    <!-- 에러 메시지 -->
    <div v-if="errorMessage" class="text-danger small mb-3">
      {{ errorMessage }}
    </div>

    <!-- 버튼 영역 -->
    <div class="mt-4">
      <button class="btn btn-secondary me-2" @click="cancel">취소</button>
      <button class="btn btn-danger" @click="deleteAccount">회원 탈퇴</button>
    </div>
  </div>
</template>
