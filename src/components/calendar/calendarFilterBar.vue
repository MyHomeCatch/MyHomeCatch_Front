<template>
  <div class="filter-wrapper">
    <!-- 상단 탭 + 초기화 버튼 + 체크박스 -->
    <div class="filter-title">
      <span class="filter-title-text">검색 필터</span>
      <div class="button-group top">
        <!-- ✅ 내 조건 체크박스 -->
        <label class="checkbox-label">
          <input type="checkbox" @change="startSelfCheck" />
          지원 가능한 청약만 보기
        </label>
        <button class="reset-btn" @click="resetAll()">필터 초기화</button>
      </div>
    </div>

    <!-- 탭 메뉴 -->
    <div class="filter-tabs-row">
      <div class="filter-tabs">
        <button
          v-for="tab in tabOptions"
          :key="tab"
          class="filter-tab"
          :class="{ active: currentTab === tab }"
          @click="currentTab = tab"
        >
          {{ tab }}
        </button>
      </div>
    </div>

    <!-- 탭별 선택지 -->
    <div class="filter-content">
      <!-- 공고유형 -->
      <div v-if="currentTab === '공고유형'" class="filter-section">
        <div class="choices">
          <div
            v-for="code in typeOptions"
            :key="code"
            class="choice-block"
            :style="getTypeStyle(code)"
            @click="toggleOption('type', code)"
          >
            {{ calendarColorMap[code]?.label || '알 수 없음' }}
          </div>
        </div>
      </div>

      <!-- 공급지역 -->
      <div v-if="currentTab === '공급지역'" class="filter-section">
        <div class="choices">
          <div
            v-for="option in regionOptions"
            :key="option"
            class="choice-block"
            :class="{ selected: selectedChoice.region.includes(option) }"
            @click="toggleOption('region', option)"
          >
            {{ option }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useAuthStore } from '../../stores/auth';
import { useMyPageStore } from '@/stores/mypage';
import { calendarColorMap } from '@/assets/calendarColorMap.js';

const router = useRouter();
const emit = defineEmits(['update:filters']);

const currentTab = ref('공고유형');
const tabOptions = ['공고유형', '공급지역'];

const selectedChoice = ref({
  type: [],
  region: [],
});

watch(
  selectedChoice,
  (val) => {
    emit('update:filters', val);
  },
  { deep: true }
);

const typeOptions = ['05', '08', '40', '10', '07', '09', '48'];

const regionOptions = [
  '전체',
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
];

const getTypeStyle = (code) => {
  const isSelected = selectedChoice.value.type.includes(code);
  const color = calendarColorMap[code]?.color || '#ccc';

  return {
    backgroundColor: isSelected ? color : '#ffffff',
    border: `1px solid ${color}`,
    color: isSelected ? '#ffffff' : color,
    fontWeight: isSelected ? 'bold' : 'normal',
  };
};

const resetAll = () => {
  selectedChoice.value = {
    type: [],
    region: [],
  };
};

const toggleOption = (filterKey, option) => {
  const selectedArray = selectedChoice.value[filterKey];

  if (filterKey === 'region' && option === '전체') {
    if (selectedArray.includes('전체')) {
      selectedChoice.value.region = [];
    } else {
      selectedChoice.value.region = [...regionOptions];
    }
  } else {
    if (filterKey === 'region' && selectedArray.includes('전체')) {
      selectedChoice.value.region = selectedArray.filter(
        (item) => item !== '전체' && item !== option
      );
      return;
    }

    const index = selectedArray.indexOf(option);
    if (index === -1) {
      selectedArray.push(option);
    } else {
      selectedArray.splice(index, 1);
    }
  }
};

// 스토어
const myPageStore = useMyPageStore();
const { supportableList, householdInfoError } = storeToRefs(myPageStore);

// 지원 가능한 공고 보기
async function startSelfCheck(event) {
  const isChecked = event.target.checked;

  try {
    const authStore = useAuthStore();

    // 1. 로그인 안 된 경우
    if (!authStore.token) {
      const shouldLogin = window.confirm(
        '로그인이 필요한 서비스입니다. 로그인 하시겠습니까?'
      );
      if (shouldLogin) {
        router.push('/login');
      }
      return;
    }

    // 2. 로그인된 경우
    if (isChecked) {
      await myPageStore.getSupportableList(); // 리스트 호출

      if (householdInfoError.value) {
        const shouldSelfCheck = window.confirm(
          '지원 조건 확인을 위해 자가진단이 필요합니다. 자가진단 페이지로 이동할까요?'
        );
        if (shouldSelfCheck) router.push({ name: 'SelfCheck' });
        return;
      }

      // calendarColorMap 기반 label → code 매핑 객체 생성
      const labelToCodeMap = Object.entries(calendarColorMap).reduce(
        (acc, [code, { label }]) => {
          acc[label] = code;
          return acc;
        },
        {}
      );

      // supportableList에서 code 목록 추출
      const supportedCodes = supportableList.value
        .map((item) => {
          // "공공분양"은 "분양주택"으로 매핑
          const normalizedName =
            item.name === '공공분양' ? '분양주택' : item.name;
          return labelToCodeMap[normalizedName];
        })
        .filter(Boolean); // undefined 제거

      // 선택한 코드 저장
      selectedChoice.value.type = supportedCodes;
    } else {
      selectedChoice.value.type = [];
    }
  } catch (error) {
    console.error('자가진단 필터 처리 중 오류 발생:', error);
  }
}
</script>
