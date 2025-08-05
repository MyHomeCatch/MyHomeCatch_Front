<template>
  <div class="filter-wrapper">
    <!-- 상단 탭 + 초기화 버튼 -->
    <div class="filter-title">
      <span class="filter-title-text">검색 필터</span>
      <div class="button-group top">
        <button class="reset-btn" @click="resetAll()">필터 초기화</button>
      </div>
    </div>
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

      <!-- 본인대상 -->
      <div v-if="currentTab === '본인대상'" class="filter-section">
        <div class="choices no-wrap">
          <div
            v-for="option in mineOptions"
            :key="option"
            class="choice-block"
            :class="{ selected: selectedChoice.mine.includes(option) }"
            @click="toggleOption('mine', option)"
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
import { calendarColorMap } from '@/assets/calendarColorMap.js';

const emit = defineEmits(['update:filters']);

// 기본 선택 탭: 공고유형
const currentTab = ref('공고유형');

const tabOptions = ['공고유형', '공급지역', '본인대상'];

const selectedChoice = ref({
  type: [],
  region: [],
  mine: [],
});

watch(
  selectedChoice,
  (val) => {
    emit('update:filters', val);
  },
  { deep: true }
);

// 필터 옵션
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

const mineOptions = ['1순위', '우선공급'];

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
    mine: [],
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
      // ✅ '전체'가 선택된 상태에서 다른 지역 클릭 시:
      // '전체'와 클릭한 지역을 제거 (나머지 유지)
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
</script>
