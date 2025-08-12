<script setup>
import { reactive } from 'vue';

import { useMyPageStore } from '@/stores/mypage';
import { useAuthStore } from '@/stores/auth';
import { storeToRefs } from 'pinia';

const store = useMyPageStore();
const { userInfo } = storeToRefs(store);

const authStore = useAuthStore();
const { token } = storeToRefs(authStore);

const emit = defineEmits(['close', 'calculated']);

const questions = reactive([
  {
    label: '무주택 기간',
    selected: '',
    options: [
      '30세 미만 미혼 무주택자 (0점)',
      '1년 미만 (2점)',
      '1년 이상 ~ 2년 미만 (4점)',
      '2년 이상 ~ 3년 미만 (6점)',
      '3년 이상 ~ 4년 미만 (8점)',
      '4년 이상 ~ 5년 미만 (10점)',
      '5년 이상 ~ 6년 미만 (12점)',
      '6년 이상 ~ 7년 미만 (14점)',
      '7년 이상 ~ 8년 미만 (16점)',
      '8년 이상 ~ 9년 미만 (18점)',
      '9년 이상 ~ 10년 미만 (20점)',
      '10년 이상 ~ 11년 미만 (22점)',
      '11년 이상 ~ 12년 미만 (24점)',
      '12년 이상 ~ 13년 미만 (26점)',
      '13년 이상 ~ 14년 미만 (28점)',
      '14년 이상 ~ 15년 미만 (30점)',
      '15년 이상 (32점)',
    ],
  },
  {
    label: '부양가족 수',
    selected: '',
    options: [
      '0명 (5점)',
      '1명 (10점)',
      '2명 (15점)',
      '3명 (20점)',
      '4명 (25점)',
      '5명 (30점)',
      '6명 이상 (35점)',
    ],
  },
  {
    label: '청약통장 가입기간',
    selected: '',
    options: [
      '가입 안 함 (0점)',
      '6개월 미만 (1점)',
      '6개월 이상 ~ 1년 미만 (2점)',
      '1년 이상 ~ 2년 미만 (3점)',
      '2년 이상 ~ 3년 미만 (4점)',
      '3년 이상 ~ 4년 미만 (5점)',
      '4년 이상 ~ 5년 미만 (6점)',
      '5년 이상 ~ 6년 미만 (7점)',
      '6년 이상 ~ 7년 미만 (8점)',
      '7년 이상 ~ 8년 미만 (9점)',
      '8년 이상 ~ 9년 미만 (10점)',
      '9년 이상 ~ 10년 미만 (11점)',
      '10년 이상 ~ 11년 미만 (12점)',
      '11년 이상 ~ 12년 미만 (13점)',
      '12년 이상 ~ 13년 미만 (14점)',
      '13년 이상 ~ 14년 미만 (15점)',
      '14년 이상 ~ 15년 미만 (16점)',
      '15년 이상 (17점)',
    ],
  },
]);

function extractScore(text) {
  const match = text.match(/\((\d+)점\)/);
  return match ? parseInt(match[1]) : 0;
}

function calculateScore() {
  const isAllSelected = questions.every((q) => q.selected !== '');

  if (!isAllSelected) {
    alert('모든 항목을 선택해주세요.');
    return;
  }

  // 🔥 총점 계산 (number 보장)
  const total = questions.reduce((sum, q) => {
    const score = extractScore(q.selected);
    return sum + (typeof score === 'number' ? score : 0); // 혹시라도 예외 방지
  }, 0);

  console.log('🔥 최종 점수(total):', total, typeof total); // number여야 함

  // ✅ 점수 업데이트 (number 값 보장)
  store.updateAdditionalPoint(total);

  emit('close');
}

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
</script>

<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <h4 class="fw-bold mb-4">청약가점 계산</h4>

      <div
        v-for="(question, index) in questions"
        :key="index"
        class="mb-4 d-flex align-items-start"
      >
        <!-- 🔵 Q1, Q2 아이콘 -->
        <div
          class="me-3 rounded-circle bg-success text-white d-flex justify-content-center align-items-center"
          style="width: 36px; height: 36px; font-weight: bold"
        >
          Q{{ index + 1 }}
        </div>

        <div class="flex-grow-1">
          <label class="form-label fw-semibold">{{ question.label }}</label>
          <select class="form-select" v-model="question.selected">
            <option disabled value="">-- 선택해주세요 --</option>
            <option v-for="(opt, i) in question.options" :key="i" :value="opt">
              {{ opt }}
            </option>
          </select>
        </div>
      </div>

      <div class="text-end mt-4">
        <button class="btn btn-outline-secondary me-2" @click="$emit('close')">
          취소
        </button>
        <button class="btn btn-success" @click="calculateScore">계산</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
  z-index: 1050;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-box {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

select.form-select {
  padding-left: 0.75rem;
}
</style>
