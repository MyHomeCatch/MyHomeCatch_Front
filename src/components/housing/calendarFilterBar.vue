<template>
  <div class="filter-wrapper">
    <!-- 상단 버튼 -->
    <div class="filter-box">
      <div
        class="cal-button"
        :class="{ active: active === 'type' }"
        @click="toggle('type')"
      >
        공급 유형
      </div>
      <div
        class="cal-button"
        :class="{ active: active === 'region' }"
        @click="toggle('region')"
      >
        공급 지역
      </div>
      <div
        class="cal-button"
        :class="{ active: active === 'mine' }"
        @click="toggle('mine')"
      >
        본인 대상
      </div>
      <button class="search-btn" @click="searchHandler">검색</button>
    </div>

    <!-- 선택지 영역 -->
    <div v-if="active === 'type'" class="choices">
      <div
        v-for="option in typeOptions"
        :key="option"
        class="choice-block"
        :class="{ selected: selectedChoice.type.includes(option) }"
        @click="toggleOption('type', option)"
      >
        {{ option }}
      </div>
    </div>
    <div v-if="active === 'region'" class="choices">
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
    <div v-if="active === 'mine'" class="choices">
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
</template>

<script setup>
import { ref } from 'vue';

const active = ref(null);
// 각 필터별 선택 값 배열로 관리
const selectedChoice = ref({
  type: [],
  region: [],
  mine: [],
});

const toggle = (key) => {
  active.value = active.value === key ? null : key;
};

// 선택 항목 추가/제거 토글 함수
const toggleOption = (filterKey, option) => {
  const selectedArray = selectedChoice.value[filterKey];

  if (filterKey === 'region' && option === '전체') {
    if (selectedArray.includes('전체')) {
      // 이미 전체가 선택되어있으면 전체 해제
      selectedChoice.value.region = [];
    } else {
      // 전체가 선택되면 모든 지역 선택
      // 전체 포함해서 모두 추가
      selectedChoice.value.region = [...regionOptions];
    }
  } else {
    // 전체가 선택되어있으면, 개별 옵션 클릭 시 전체 해제
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

const typeOptions = ['일반공급', '특별공급'];
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
</script>
