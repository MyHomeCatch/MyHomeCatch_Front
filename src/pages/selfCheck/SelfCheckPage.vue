<template>
  <div class="self-check-container">
    <div class="book-bg">
      <div class="questions-row">
        <QuestionCard
          v-if="questions[currentIndex * 2]"
          :question="questions[currentIndex * 2]"
          :answer="answers[currentIndex * 2]"
          @answer="onAnswer(currentIndex * 2, $event)"
          :index="currentIndex * 2"
        />
        <QuestionCard
          v-if="questions[currentIndex * 2 + 1]"
          :question="questions[currentIndex * 2 + 1]"
          :answer="answers[currentIndex * 2 + 1]"
          @answer="onAnswer(currentIndex * 2 + 1, $event)"
          :index="currentIndex * 2 + 1"
        />
        <div v-else class="question-card placeholder-card" style="visibility: hidden;"></div>
      </div>
      <div class="nav-btns-row">
        <NavigationButtons
          :isFirst="currentIndex === 0"
          :isLast="currentIndex === lastIndex"
          :allAnswered="pageAllAnswered"
          @prev="goPrev"
          @next="goNext"
          @submit="submit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import QuestionCard from '../../components/selfCheck/QuestionCard.vue';
import NavigationButtons from '../../components/selfCheck/NavigationButtons.vue';

// 예시 질문 데이터
const questions = [
  {
    id: 1,
    type: 'radio',
    title: '본인을 포함한 세대구성원이 현재 주택을 소유 중인가요?',
    options: [
      '본인이 주택 소유중',
      '본인은 무주택자, 본인 외 다른 세대원이 주택 소유중',
      '본인 포함 모두 무주택자',
    ],
    required: true,
  },
  {
    id: 2,
    type: 'radio',
    title: '다음 중 해당되는 것을 골라주세요.',
    options: [
      '미혼',
      '기혼 (맞벌이)',
      '기혼 (외벌이)',
    ],
    required: true,
  },
  {
    id: 3,
    type: 'number',
    title: '세대원 수와 자녀 수를 입력해주세요.',
    subtext: '세대원 수 = 본인 + 배우자 + 동일한 주민등록본에 등재된 직계존속(부모·조부모)과 직계비속(자녀·손자녀)',
    options: [
      '세대원 수 (본인 포함)',
      '자녀 수 (태아 포함)',
    ],
    required: true,
  },
  {
    id: 4,
    type: 'radio',
    title: '세대 전체가 보유하고 있는 총 자산이 얼마인가요?',
    subtext: '총 자산 = 부동산 + 자동차 + 금융 + 기타 - 부채',
    options: [
      '1억 원 이하',
      '2억 7,300만원 이하',
      '3억 원 이하',
    ],
    required: true,
  },
  {
    id: 5,
    type: 'radio',
    title: '세대 전체가 보유하고 있는 총 자산이 얼마인가요?',
    subtext: '총 자산 = 부동산 + 자동차 + 금융 + 기타 - 부채',
    options: [
      '1억 원 이하',
      '2억 7,300만원 이하',
      '3억 원 이하',
      '3억 2,800만원 이하',
      '3억 4,500만원 이하',
      '3억 8,000만원 이하',
      '4억 1,400만원 이하',
      '4억 1,400만원 초과',
      '몰라',
    ],
    required: true,
  },
  {
    id: 6,
    type: 'radio',
    title: '세대구성원이 보유하고 있는 가장 비싼 차량 가격은 얼마인가요?',
    options: [
      '없음',
      '3,708만원 이하',
      '4,079만원 이하',
      '4,450만원 이하',
      '4,450만원 초과',
      '몰라',
    ],
    required: true,
    subtext: '보험개발원 > 차량기준가격 조회',
    subtextLink: 'https://www.kidi.or.kr/auto/aut_0101.do',
  },
  {
    id: 7,
    type: 'radio',
    title: '청약 통장이 있나요?',
    options: [
      '있음',
      '없음',
    ],
    required: true,
  },
  {
    id: 8,
    type: 'checkbox',
    title: '다음 중 해당되는 것을 모두 골라주세요.',
    options: [
      '청년(만 19세 ~ 39세) 또는 사회초년생',
      '대학생 또는 취업준비생',
      '신혼부부(7년 이내 혼인)',
      '예비 신혼부부',
      '한부모 가족(만 6세 이하 자녀)',
      '보호대상 한부모 가족',
      '주거급여 수급자(차상위계층)',
      '해당 없음',
    ],
    required: true,
  },
];

const answers = ref(Array(questions.length).fill(null));
const currentIndex = ref(0);
const lastIndex = Math.floor((questions.length - 1) / 2);

const pageAllAnswered = computed(() => {
  // 현재 페이지(2개) 모두 답변했는지 체크
  const idx = currentIndex.value * 2;
  return [0, 1].every(i => {
    const q = questions[idx + i];
    if (!q) return true;
    return answers.value[idx + i] !== null && answers.value[idx + i] !== undefined && answers.value[idx + i] !== '';
  });
});

function onAnswer(idx, value) {
  answers.value[idx] = value;
}
function goPrev() {
  if (currentIndex.value > 0) currentIndex.value--;
}
function goNext() {
  if (currentIndex.value < lastIndex) currentIndex.value++;
}
function submit() {
  // 결과 처리 로직
  console.log('선택된 답변:', answers.value);
}
</script>

<style scoped>
.self-check-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: linear-gradient(120deg, #f8f6f1 0%, #f3e9d2 100%);
  padding-bottom: 120px;
  padding-top: 40px;
}
.book-bg {
  position: relative;
  z-index: 1;
  background: #fffdfa;
  border-radius: 64px;
  padding: 32px 20px 24px 20px;
  margin: 24px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 1200px;
  max-width: 1400px;
  min-height: 900px;
  overflow: visible;
}
.book-bg::before {
  content: "";
  position: absolute;
  top: 0; bottom: 0; left: 50%;
  width: 48px;
  transform: translateX(-50%);
  background: radial-gradient(ellipse at center, rgba(180,160,120,0.10) 0%, rgba(180,160,120,0.03) 60%, transparent 100%);
  z-index: 1;
  pointer-events: none;
}
.book-bg::after {
  content: "";
  position: absolute;
  top: 0; bottom: 0; left: 0; right: 0;
  background: none;
  z-index: 1;
  pointer-events: none;
}
.questions-row {
  display: flex;
  gap: 100px;
  margin-bottom: 56px;
  justify-content: center;
  min-width: 1100px;
}
.placeholder-card {
  width: 500px;
  min-height: 320px;
  background: transparent;
  box-shadow: none;
}
.number-slider-row {
  user-select: none;
}
.number-slider-dropdown {
  margin: 8px 0 18px 0;
  padding: 12px 0 0 0;
  display: flex;
  flex-direction: column;
  align-items: stretch;
}
.slider {
  width: 100%;
  accent-color: #7fa87f;
  height: 4px;
}
.slider-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.95rem;
  color: #888;
  margin-top: 2px;
}
.number-value {
  font-weight: bold;
  font-size: 1.15rem;
  margin-left: 12px;
  color: #234123;
}
.nav-btns-row {
  width: 100%;
  display: flex;
  justify-content: center;
  margin-top: 40px;
}
</style> 