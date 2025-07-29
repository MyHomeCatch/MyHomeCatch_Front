<template>
  <div class="self-check-container">
    <SelfCheckStartModal :visible="showStartModal" @start="startSelfCheck" @cancel="router.back()" />
    <div :class="['book-bg', { 'blurred': showStartModal }]">
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
          :isSubmitting="isSubmitting"
          @prev="goPrev"
          @next="goNext"
          @submit="submit"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import QuestionCard from '../../components/selfCheck/QuestionCard.vue';
import NavigationButtons from '../../components/selfCheck/NavigationButtons.vue';
import SelfCheckStartModal from '../../components/modals/SelfCheckStartModal.vue';
import selfCheckApi from '../../api/selfCheck.js';
import { useAuthStore } from '../../stores/auth';

const questions = [
  {
    id: 1,
    type: 'number',
    title: '현재 거주 기간을 입력해주세요.',
    subtext: '현재 주소지에서 거주한 기간을 월 단위로 입력해주세요.',
    options: [
      '거주 기간 (개월)',
    ],
    required: true,
  },
  {
    id: 2,
    type: 'radio',
    title: '무주택세대구성원인가요?',
    options: [
      '예',
      '아니오',
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
    title: '다음 중 해당되는 것을 골라주세요.',
    options: [
      '미혼',
      '기혼(외벌이)',
      '기혼(맞벌이)',
    ],
    required: true,
  },
  {
    id: 5,
    type: 'radio',
    title: '가구당 월 평균 소득을 선택해주세요.',
    subtext: '세대원 수에 따른 월 평균 소득 기준을 확인하여 선택해주세요.',
    options: [
      '월평균 소득 70% 이하',
      '월평균 소득 80% 이하',
      '월평균 소득 90% 이하',
      '월평균 소득 100% 이하',
      '월평균 소득 110% 이하',
      '월평균 소득 120% 이하',
      '월평균 소득 120% 초과',
    ],
    required: true,
  },
  {
    id: 6,
    type: 'radio',
    title: '총 자산 기준을 확인해주세요.',
    subtext: '총 자산 = 부동산 + 자동차 + 금융 + 기타 - 부채',
    options: [
      '총 자산 10,400만원 이하',
      '총 자산 25,400만원 이하',
      '총 자산 33,700만원 이하',
      '총 자산 33,700만원 초과',
    ],
    required: true,
  },
  {
    id: 7,
    type: 'radio',
    title: '자동차 기준을 확인해주세요.',
    options: [
      '자동차 없음',
      '자동차 3,803만원 이하',
      '자동차 3,803만원 초과',
    ],
    required: true,
  },
  {
    id: 8,
    type: 'radio',
    title: '부동산 기준을 확인해주세요.',
    options: [
      '부동산 없음',
      '부동산 21,550만원 이하',
      '부동산 21,550만원 초과',
    ],
    required: true,
  },
  {
    id: 9,
    type: 'radio',
    title: '청약 통장 가입기간 및 납입기간을 선택해주세요.',
    options: [
      '없음',
      '6개월 이상',
      '12개월 이상',
      '24개월 이상',
    ],
    required: true,
  },
  {
    id: 10,
    type: 'checkbox',
    title: '다음 중 해당되는 것을 모두 골라주세요.',
    options: [
      '철거민',
      '장애인',
      '다자녀 가구',
      '국가유공자',
      '영구임대퇴거자',
      '비닐간이공작물 거주자',
      '신혼부부',
      '한부모 가족',
      '무허가건축물 등에 입주한 세입자',
      '기관추천',
      '신생아',
      '생애최초',
      '노부모부양',
      '대학생 계층',
      '청년 계층',
      '고령자 계층',
      '주거급여수급자계층',
      '기초생활수급자',
      '위안부 피해자',
      '북한이탈주민',
      '아동복지시설 퇴소자',
      '고령 저소득자',
      '해당 없음',
    ],
    required: true,
  },
];

const answers = ref(Array(questions.length).fill(null));
const currentIndex = ref(0);
const lastIndex = Math.floor((questions.length - 1) / 2);
const showStartModal = ref(true);
const isSubmitting = ref(false);
const router = useRouter();

async function startSelfCheck() {
  try {
    // 토큰 상태 확인
    const authStore = useAuthStore();
    if (!authStore.token) {
      alert('로그인이 필요합니다. 로그인 후 다시 시도해주세요.');
      router.push('/login');
      return;
    }

    // 자가진단 시작 시 기존 진단 결과 초기화
    await selfCheckApi.initializeDiagnosis();
    
    showStartModal.value = false;
  } catch (error) {
    console.error('초기화 실패:', error);
    if (error.response?.status === 401) {
      alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
      router.push('/login');
    } else {
      alert('초기화 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
    showStartModal.value = false;
  }
}

watch(showStartModal, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});
onMounted(() => {
  if (showStartModal.value) document.body.style.overflow = 'hidden';
});
onUnmounted(() => {
  document.body.style.overflow = '';
});

const pageAllAnswered = computed(() => {
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

async function submit() {
  if (isSubmitting.value) return;
  
  isSubmitting.value = true;
  
  const diagnosisData = {
    residencePeriod: Number(answers.value[0]),
    isHomeless: answers.value[1],
    houseHoldMembers: Array.isArray(answers.value[2]) ? answers.value[2].join(',') : String(answers.value[2]),
    maritalStatus: answers.value[3],
    monthlyIncome: answers.value[4],
    totalAssets: answers.value[5],
    carValue: answers.value[6],
    realEstateValue: answers.value[7],
    subscriptionPeriod: answers.value[8],
    targetGroups: Array.isArray(answers.value[9]) ? answers.value[9] : [answers.value[9]],
  };

  try {
    const houseTypes = ['국민임대', '행복주택', '공공임대', '09공공임대'];
    const apiCalls = [
      selfCheckApi.getKookminDiagnosis(diagnosisData),
      selfCheckApi.getHengBokDiagnosis(diagnosisData),
      selfCheckApi.getGongGongDiagnosis(diagnosisData),
      selfCheckApi.get09Diagnosis(diagnosisData)
    ];
    
    const results = [];
    for (let i = 0; i < apiCalls.length; i++) {
      try {
        const result = await apiCalls[i];
        results.push({ status: 'fulfilled', value: result });
        
        // 각 API 호출 후 잠시 대기 (데이터베이스 저장 확인용)
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (error) {
        console.error(`${houseTypes[i]} 진단 실패:`, error);
        results.push({ status: 'rejected', reason: error });
      }
    }

    // 3. 결과 정리
    const qualifiedHouses = [];
    const failedHouses = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const qualified = result.value.qualified;
        if (typeof qualified === 'string' && 
            (!qualified.includes('불가능'))) {
          qualifiedHouses.push(`${houseTypes[index]} (${qualified})`);
        } else {
          failedHouses.push(`${houseTypes[index]} (${qualified})`);
        }
      } else if (result.status === 'rejected') {
        failedHouses.push(`${houseTypes[index]} (오류)`);
      } else {
        failedHouses.push(houseTypes[index]);
      }
    });

    // 4. 결과 표시
    let message = '';
    if (qualifiedHouses.length > 0) {
      message += `✅ 자격 요건을 충족하는 주택:\n${qualifiedHouses.join('\n')}\n\n`;
    }
    if (failedHouses.length > 0) {
      message += `❌ 자격 요건을 충족하지 못하는 주택:\n${failedHouses.join('\n')}`;
    }
    
    if (qualifiedHouses.length === 0) {
      message = '모든 주택 유형에서 자격 요건을 충족하지 못합니다.';
    }

    message += '\n\n진단 결과가 데이터베이스에 저장되었습니다.';
    alert(message);
  } catch (error) {
    console.error('전송 실패:', error);
    if (error.response?.status === 401) {
      alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
      router.push('/login');
    } else {
      alert('서버 연결에 실패했습니다. 백엔드 서버가 실행 중인지 확인해주세요.');
    }
  } finally {
    isSubmitting.value = false;
  }
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
.modal-backdrop {
  position: fixed;
  z-index: 2000;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}
.start-modal {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.13);
  padding: 48px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}
.start-modal h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 12px;
}
.start-btn {
  font-size: 1.15rem;
  background: #a6bfa0;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 48px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.start-btn:hover {
  background: #7fa87f;
}
.blurred {
  filter: blur(6px) grayscale(10%);
  pointer-events: none;
  user-select: none;
}
</style> 