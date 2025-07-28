<script setup>
import { ref, watch } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router'; // ✅ router import

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const router = useRouter(); // ✅ router 객체 생성

const password = ref('');
const confirm = ref(false);
const errorMessage = ref('');
const showPassword = ref(false);

const deleteAccount = () => {
  if (!confirm.value) {
    errorMessage.value = '계정 삭제에 동의해주세요.';
    return;
  }

  // TODO: 실제 회원탈퇴 API 연동
  alert('회원 탈퇴가 완료되었습니다.');

  // ✅ 탈퇴 성공 시 완료 페이지로 이동
  router.push('/byeComplete');
};

// ✅ 체크박스가 true로 바뀌면 에러 메시지 제거
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
