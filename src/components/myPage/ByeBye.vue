<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);

const password = ref('');
const confirm = ref(false);
const errorMessage = ref('');

const deleteAccount = () => {
  if (!confirm.value) {
    errorMessage.value = '계정 삭제에 동의해주세요.';
    return;
  }

  // TODO: 실제 회원탈퇴 API 연동
  alert('회원 탈퇴가 완료되었습니다.');
  // 예시: authStore.logout(); router.push('/');
};

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

    <div class="mb-3">
      <label class="form-label">비밀번호 확인</label>
      <input
        type="password"
        class="form-control"
        v-model="password"
        placeholder="현재 비밀번호 입력"
      />
    </div>

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

    <div v-if="errorMessage" class="text-danger small mb-3">
      {{ errorMessage }}
    </div>

    <div class="mt-4">
      <button class="btn btn-secondary me-2" @click="cancel">취소</button>
      <button class="btn btn-danger" @click="deleteAccount">회원 탈퇴</button>
    </div>
  </div>
</template>
