<template>
  <div class="filter-wrapper">
    <!-- 필터 제목 & 펼치기 버튼 -->
    <div class="filter-header" @click="isExpanded = !isExpanded">
      <div class="filter-title">검색 필터</div>
      <span v-if="isExpanded">접기</span>
      <span v-else>펼치기</span>
    </div>

    <!-- 필터 내용: 펼쳤을 때만 표시 -->
    <div v-if="isExpanded">
      <!-- 공급 유형 -->
      <div class="filter-section">
        <div class="filter-label-row">
          <div class="filter-label">공급 유형</div>
        </div>
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

      <!-- 공급 지역 -->
      <div class="filter-section">
        <div class="filter-label">공급 지역</div>
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

      <!-- 본인 대상 + 초기화 버튼 -->
      <div class="filter-section">
        <div class="filter-label">본인 대상</div>
        <div class="choice-search-row">
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
          <div class="button-group">
            <button class="reset-btn" @click="resetAll()">필터 초기화</button>
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

const isExpanded = ref(false);

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
      selectedChoice.value.region = [];
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
