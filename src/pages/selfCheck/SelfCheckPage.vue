<template>
  <div class="self-check-container">
    <LoadingSpinner v-if="isSubmitting"/>
    <SelfCheckStartModal :visible="showStartModal" @start="startSelfCheck" @cancel="router.back()" />
    <SelfCheckResultModal 
      :visible="showResultModal" 
      :qualifiedHouses="qualifiedHouses" 
      :failedHouses="failedHouses"
      @confirm="onResultConfirm" 
    />
    <div :class="['book-bg', { 'blurred': showStartModal || showResultModal }]">
      <div class="questions-row">
        <QuestionCard
          v-if="questions[baseIndex]"
          :question="questions[baseIndex]"
          :answer="answers[baseIndex]"
          @answer="onAnswer(baseIndex, $event)"
          :index="baseIndex"
        />
        <QuestionCard
          v-if="!isSinglePerPage && questions[baseIndex + 1]"
          :question="questions[baseIndex + 1]"
          :answer="answers[baseIndex + 1]"
          @answer="onAnswer(baseIndex + 1, $event)"
          :index="baseIndex + 1"
        />
        <div v-else-if="!isSinglePerPage" class="question-card placeholder-card" style="visibility: hidden;"></div>
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
import { ref, computed, watch, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import QuestionCard from '../../components/selfCheck/QuestionCard.vue';
import NavigationButtons from '../../components/selfCheck/NavigationButtons.vue';
import SelfCheckStartModal from '../../components/modals/SelfCheckStartModal.vue';
import SelfCheckResultModal from '../../components/modals/SelfCheckResultModal.vue';
import LoadingSpinner from '../../components/ui/LoadingSpinner.vue';

import selfCheckApi from '../../api/selfCheck.js';
import { useAuthStore } from '../../stores/auth';
import authApi from '../../api/auth';

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
      '무허가건축물에 입주한 세입자',
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

// Responsive: 2문항 → 1문항 전환 기준
const isSinglePerPage = ref(false);
function updateResponsive() {
  // 기준 해상도는 필요 시 조정 (예: 1024)
  isSinglePerPage.value = window.innerWidth <= 1024;
}

onMounted(() => {
  updateResponsive();
  window.addEventListener('resize', updateResponsive);
});
onUnmounted(() => {
  window.removeEventListener('resize', updateResponsive);
});

const questionsPerPage = computed(() => (isSinglePerPage.value ? 1 : 2));
const baseIndex = computed(() => currentIndex.value * questionsPerPage.value);
const lastIndex = computed(() => Math.floor((questions.length - 1) / questionsPerPage.value));
const showStartModal = ref(true);
const showResultModal = ref(false);
const isSubmitting = ref(false);
const qualifiedHouses = ref([]);
const failedHouses = ref([]);
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

    // 토큰 유효성 확인을 위해 간단한 API 호출 시도
    try {
      await selfCheckApi.initializeDiagnosis();
      console.log('✅ 토큰 유효성 확인 성공');
    } catch (error) {
      if (error.response?.status === 401) {
        console.log('🔄 토큰 만료 감지, 갱신 시도...');
        // 토큰 갱신 시도
        try {
          await authApi.refreshToken();
          console.log('✅ 토큰 갱신 성공');
          // 갱신 후 다시 시도
          await selfCheckApi.initializeDiagnosis();
          console.log('✅ 갱신된 토큰으로 유효성 확인 성공');
        } catch (refreshError) {
          console.error('❌ 토큰 갱신 실패:', refreshError);
          alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
          router.push('/login');
          return;
        }
      } else {
        throw error;
      }
    }
    
    showStartModal.value = false;
  } catch (error) {
    console.error('자가진단 시작 실패:', error);

    if (error.response?.status === 401) {
      alert('로그인이 만료되었습니다. 다시 로그인해주세요.');
      router.push('/login');
    } else {
      alert('자가진단 시작 중 오류가 발생했습니다. 다시 시도해주세요.');
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

watch(showResultModal, (val) => {
  if (val) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
});

function onResultConfirm() {
  showResultModal.value = false;
  router.push('/');
}
onMounted(() => {
  if (showStartModal.value) document.body.style.overflow = 'hidden';
});
onUnmounted(() => {
  document.body.style.overflow = '';
});

const pageAllAnswered = computed(() => {
  const start = baseIndex.value;
  return Array.from({ length: questionsPerPage.value }, (_, i) => i).every(i => {
    const q = questions[start + i];
    if (!q) return true;
    const ans = answers.value[start + i];
    return ans !== null && ans !== undefined && ans !== '';
  });
});

function onAnswer(idx, value) {
  answers.value[idx] = value;
}
function goPrev() {
  if (currentIndex.value > 0) currentIndex.value--;
}
function goNext() {
  if (currentIndex.value < lastIndex.value) currentIndex.value++;
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
    // 1. 기존 자가진단 결과 삭제
    console.log('기존 자가진단 결과 삭제 중...');
    await selfCheckApi.initializeDiagnosis();
    console.log('기존 자가진단 결과 삭제 완료');

    // 2. 기존 진단 내용 삭제
    console.log('기존 진단 내용 삭제 중...');
    await selfCheckApi.deleteContent();
    console.log('기존 진단 내용 삭제 완료');

    // 2. 진단 실행
    const houseTypes = ['국민임대', '행복주택', '공공임대', '영구임대'];
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
        await new Promise(resolve => setTimeout(resolve, 200));
      } catch (error) {
        console.error(`${houseTypes[i]} 진단 실패:`, error);
        results.push({ status: 'rejected', reason: error });
      }
    }

    // 3. 진단 내용 저장
    console.log('진단 내용 저장 중...');
    await selfCheckApi.saveContent(diagnosisData);
    console.log('진단 내용 저장 완료');

    // 4. 결과 정리
    const tempQualifiedHouses = [];
    const tempFailedHouses = [];

    results.forEach((result, index) => {
      if (result.status === 'fulfilled') {
        const qualified = result.value.qualified;
        if (typeof qualified === 'string' && 
            (!qualified.includes('불가능'))) {
          tempQualifiedHouses.push(`${houseTypes[index]} (${qualified})`);
        } else {
          tempFailedHouses.push(`${houseTypes[index]} (${qualified})`);
        }
      } else if (result.status === 'rejected') {
        tempFailedHouses.push(`${houseTypes[index]} (오류)`);
      } else {
        tempFailedHouses.push(houseTypes[index]);
      }
    });

    // 5. 결과 모달에 데이터 설정 및 표시
    qualifiedHouses.value = tempQualifiedHouses;
    failedHouses.value = tempFailedHouses;
    showResultModal.value = true;
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
  width: 100%;
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
  gap: clamp(48px, 10vw, 200px);
  margin-bottom: 56px;
  justify-content: center;
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
  margin-top: 80px;
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

@media (max-width: 1280px) {
  .book-bg {
    border-radius: 48px;
    padding: 24px 16px 24px 16px;
  }
}

@media (max-width: 1024px) {
  .self-check-container {
    padding-top: 12px;
    padding-bottom: 40px;
  }
  .book-bg {
    border-radius: 28px;
    padding: 12px 10px 128px 10px; /* extra bottom padding to clear absolute buttons */
    min-height: 720px;
    background: #ffffff;
  }
  .book-bg::before,
  .book-bg::after {
    content: none;
    display: none;
  }
  .questions-row {
    width: 100%;
    gap: 8px;
    margin-bottom: 8px;
  }
  .nav-btns-row {
    width: 100%;
    margin-top: 0;
  }
}

@media (max-width: 768px) {
  .book-bg {
    padding: 10px 8px 128px 8px;
    min-height: 640px;
  }
  .questions-row {
    margin-bottom: 6px;
  }
}
</style> 