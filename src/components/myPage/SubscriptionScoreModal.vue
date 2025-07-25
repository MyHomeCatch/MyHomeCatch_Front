<template>
  <div class="modal-backdrop">
    <div class="modal-box">
      <h4 class="fw-bold mb-4">청약가점 계산</h4>

      <div
        v-for="(question, index) in questions"
        :key="index"
        class="d-flex align-items-start mb-3"
      >
        <div class="q-icon me-3">
          <div class="circle-icon">{{ 'Q' + (index + 1) }}</div>
        </div>
        <div class="flex-grow-1">
          <label :for="'select' + index" class="form-label fw-semibold">{{
            question.label
          }}</label>
          <select
            class="form-select"
            :id="'select' + index"
            v-model="question.selected"
          >
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
        <button class="btn btn-success">계산</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue';

const questions = reactive([
  {
    label: '무주택 기간',
    selected: '',
    options: ['1년 미만', '1~2년', '2~3년', '3년 이상'],
  },
  {
    label: '부양가족 수',
    selected: '',
    options: ['0명', '1명', '2명', '3명 이상'],
  },
  {
    label: '청약통장 가입기간',
    selected: '',
    options: ['가입안함', '1년 미만', '1~2년', '2년 이상'],
  },
  //   {
  //     label: '무주택 기간을 선택해주세요',
  //     selected: '',
  //     options: ['1년 미만', '1~3년', '3년 이상'],
  //   },
]);
</script>

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
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.circle-icon {
  width: 32px;
  height: 32px;
  background-color: #a3e635; /* lime-400 */
  color: white;
  font-weight: bold;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
