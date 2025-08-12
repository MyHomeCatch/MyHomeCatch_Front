<template>
  <div class="question-card">
    <div class="question-header">
      <span class="question-number">Q{{ index + 1 }}</span>
      <span class="question-title">
        <span v-if="question.required" class="required">*</span>
        {{ question.title }}
      </span>
    </div>
    <div v-if="question.type === 'radio'">
      <label
        v-for="(opt, i) in question.options"
        :key="i"
        class="option-block"
        :class="{ selected: localAnswer === opt }"
      >
        <input
          type="radio"
          :name="'q' + question.id"
          :value="opt"
          v-model="localAnswer"
          @change="emitAnswer"
        />
        <span class="checkmark" v-if="localAnswer === opt">✓</span>
        <span class="option-block-text">{{ opt }}</span>
      </label>
    </div>
    <div v-else-if="question.type === 'checkbox'">
      <label
        v-for="(opt, i) in question.options"
        :key="i"
        class="option-block"
        :class="{ selected: localAnswer && localAnswer.includes(opt) }"
      >
        <input
          type="checkbox"
          :value="opt"
          v-model="localAnswer"
          @change="emitAnswer"
        />
        <span class="checkmark" v-if="localAnswer && localAnswer.includes(opt)">✓</span>
        <span class="option-block-text">{{ opt }}</span>
      </label>
    </div>
    <div v-else-if="question.type === 'number'">
      <div v-for="(opt, i) in question.options" :key="i" class="number-input-row">
        <span class="number-label">{{ opt }}</span>
        <input
          type="number"
          min="0"
          v-model.number="localAnswer[i]"
          @input="emitAnswer"
          class="number-input styled-input"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
const props = defineProps({
  question: Object,
  answer: [String, Array, Number, Object],
  index: Number,
});
const emit = defineEmits(['answer']);

const localAnswer = ref(props.answer ?? (props.question.type === 'checkbox' ? [] : props.question.type === 'number' ? Array(props.question.options.length).fill(0) : ''));

watch(() => props.answer, (val) => {
  localAnswer.value = val ?? (props.question.type === 'checkbox' ? [] : props.question.type === 'number' ? Array(props.question.options.length).fill(0) : '');
});

function emitAnswer() {
  emit('answer', localAnswer.value);
}

// number 타입 드롭다운 상태 관리
const dropdownOpen = ref([false, false]);
function toggleDropdown(idx) {
  dropdownOpen.value = dropdownOpen.value.map((v, i) => i === idx ? !v : false);
}
</script>

<style scoped>
.question-card {
  background: #fffdfa;
  border-radius: 28px 28px 32px 32px/24px 24px 36px 36px;
  box-shadow: 0 8px 32px 0 rgba(180,160,120,0.13), 0 1.5px 0 #f3e9d2;
  padding: 32px 20px;
  width: 500px;
  min-height: 320px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  transition: box-shadow 0.2s;
  margin-top: 50px;
}
.question-card:hover {
  box-shadow: 0 12px 40px 0 rgba(180,160,120,0.18), 0 2px 0 #f3e9d2;
}
.question-header {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 10px;
}
.question-number {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #a6bfa0;
  color: #fff;
  font-size: 1.7rem;
  font-weight: 700;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px #eaf5e6;
}
.question-title {
  font-weight: bold;
  font-size: 1.15rem;
  letter-spacing: -0.5px;
}
.required {
  color: #e74c3c;
  margin-right: 4px;
}
.option-block {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
  font-size: 1.13rem;
  font-weight: 500;
  background: #f3f3f3;
  border-radius: 32px;
  min-height: 40px;
  padding: 0 28px 0 20px;
  cursor: pointer;
  user-select: none;
  box-shadow: 0 1.5px 6px 0 rgba(180,160,120,0.06);
  border: none;
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
  position: relative;
}
.option-block:last-child {
  margin-bottom: 0;
}
.option-block input {
  display: none;
}
.option-block .checkmark {
  font-size: 1.35rem;
  color: #4d6b4d;
  font-weight: bold;
  margin-right: 8px;
  margin-left: 2px;
}
.option-block.selected {
  background: #b7c7b7;
  color: #234123;
  font-weight: bold;
  box-shadow: 0 4px 16px 0 rgba(127,168,127,0.10);
}
.option-block.selected .option-block-text {
  color: #234123;
  font-weight: bold;
}
.option-block.selected .checkmark {
  color: #234123;
}
.option-block:hover {
  background: #eaf5e6;
}
.option-block-text {
  font-size: 1.13rem;
  font-weight: 500;
  letter-spacing: -0.2px;
}
.number-input-row {
  display: flex;
  align-items: center;
  gap: 18px;
  margin-bottom: 18px;
}
.number-label {
  font-size: 1.13rem;
  font-weight: 500;
  min-width: 60px;
}
.styled-input {
  width: 90px;
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid #b7c7b7;
  font-size: 1.13rem;
  background: #f8faf7;
  transition: border 0.2s, box-shadow 0.2s;
}
.styled-input:focus {
  border: 2px solid #7fa87f;
  outline: none;
  box-shadow: 0 0 0 2px #eaf5e6;
}
.number-dropdown-row {
  user-select: none;
}
.option-block.number-dropdown-row {
  position: relative;
  justify-content: space-between;
  align-items: center;
}
.number-dropdown {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  margin-top: -8px;
  margin-bottom: 10px;
}
.dropdown-arrow {
  margin-left: 12px;
  font-size: 1.1rem;
  color: #888;
  transition: transform 0.2s;
  position: absolute;
  right: 32px;
}
.dropdown-arrow.open {
  transform: rotate(180deg);
}
.number-select {
  font-size: 1.1rem;
  padding: 8px 16px;
  border-radius: 8px;
  border: 2px solid #b7c7b7;
  background: #f8faf7;
  color: #234123;
  margin-top: 2px;
  margin-right: 24px;
}
.number-select:focus {
  border: 2px solid #7fa87f;
  outline: none;
  box-shadow: 0 0 0 2px #eaf5e6;
}
.number-value {
  font-weight: bold;
  font-size: 1.15rem;
  margin-left: 12px;
  color: #234123;
}
.questions-row {
  display: flex;
  gap: 100px; /* 또는 기존 gap */
  margin-bottom: 56px;
  justify-content: center; /* 추가: 카드가 하나일 때 중앙 정렬 */
}
</style> 