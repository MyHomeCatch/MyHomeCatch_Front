<script setup>
import { ref, computed, defineAsyncComponent } from 'vue';

const buttons = [
  { name: '1. 청약 기본 이해', color: '#FFBCBC' },
  { name: '2. 사전 준비 단계', color: '#FFF9BC' },
  { name: '3. 청약 정보 탐색', color: '#FFBCBC' },
  { name: '4. 청약 자격 판단 및 유형 선택', color: '#FFFDEA' },
  { name: '5. 청약 신청', color: '#D0DCCA' },
  { name: '6. 청약 후 절차', color: '#FFBCBC' },
  { name: '7. 유의사항', color: '#FFF9BC' },
  { name: '8. 자주묻는 질문 리스트 (FAQ)', color: '#FFFDEA' },
];

const activeIndex = ref(0);

const chunkedButtons = computed(() => {
  const chunks = [];
  for (let i = 0; i < buttons.length; i += 4) {
    chunks.push(buttons.slice(i, i + 4));
  }
  return chunks;
});

const activeComponent = computed(() => {
  const guideNumber = activeIndex.value + 1;
  return defineAsyncComponent(() => import(`../../components/statics_prolog/Guide${guideNumber}.vue`));
});
</script>

<template>
  <div class="container">
    <div
      v-for="(rowButtons, rowIndex) in chunkedButtons"
      :key="rowIndex"
      class="button-row"
    >
      <div class="bus-route-buttons">
        <button
          v-for="(btn, idx) in rowButtons"
          :key="btn.name"
          :class="['route-btn', { active: activeIndex === rowIndex * 4 + idx }]"
          @click="activeIndex = rowIndex * 4 + idx"
          :style="{ backgroundColor: btn.color }"
        >
          {{ btn.name }}
        </button>
      </div>
      <!-- 각 줄마다 아래 노선선 -->
      <div class="route-line"></div>
    </div>

    <div class="content-area">
      <component :is="activeComponent"></component>
    </div>
  </div>
</template>

<style scoped>
.container {
  width: 100%;
  max-width: 1000px;
  margin: 40px auto;
  padding: 0 20px;
  font-family: Arial, sans-serif;
  box-sizing: border-box;
}

.button-row {
  margin-bottom: 60px;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center; /* 버튼 행 중앙 정렬 */
}

/* 버튼 행 */
.bus-route-buttons {
  display: flex;
  justify-content: center;
  gap: clamp(20px, 8vw, 150px); /* 반응형 간격 */
  position: relative;
  z-index: 1;
}

/* 버튼 스타일 */
.bus-route-buttons > button {
  flex-grow: 1;
  min-width: 80px;
  max-width: 150px;
  height: 90px;
  padding: 10px 15px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
  color: #333;
  transition: background-color 0.3s ease, filter 0.2s ease;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* 마우스 오버 시 배경색 밝게 */
.bus-route-buttons > button:hover {
  filter: brightness(110%);
}

/* 클릭 시 배경색 어둡게 */
.bus-route-buttons > button:active {
  filter: brightness(85%);
}

/* 활성화(선택된) 버튼 강조 */
.route-btn.active {
  outline: none;
  box-shadow: 0 0 8px #0066ff;
}

/* 노선 */
.route-line {
  position: absolute;
  top: 50%;
  transform: translateY(-50%) translateX(-50%);
  left: 50%;
  width: 90%;
  max-width: none;
  height: 3px;
  background-color: #777777;
  border-radius: 8px;
  /* box-shadow: 0 0 5px #000000aa; */
  z-index: 0;
}
</style>
