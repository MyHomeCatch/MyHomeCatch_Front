<template>
  <div style="min-width: 500px" class="map">
    <div class="category-button-wrapper">
      <button
        v-for="category in mapCategories"
        :key="category.code"
        :class="{
          'category-button': true,
          selected: selectedCategory === category.code,
        }"
        @click="handleCategoryClick(category.code)"
      >
        {{ category.name }}
      </button>
    </div>
    <div style="flex: 1; height: 800px">
      <KakaoMapViewer
        ref="mapViewerRef"
        :houses="houses"
        :selectedCategory="selectedCategory"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import KakaoMapViewer from '../KakaoMapViewer.vue';

// Props
const props = defineProps({
  houses: {
    type: Array,
    default: () => [],
  },
  selectedCategory: {
    type: String,
    default: '',
  },
});

// Emits
const emit = defineEmits(['category-change']);

// 지도 카테고리 설정
const mapCategories = [
  { code: 'MT1', name: '대형마트' },
  { code: 'CS2', name: '편의점' },
  { code: 'PS3', name: '어린이집' },
  { code: 'SC4', name: '학교' },
  { code: 'AC5', name: '학원' },
  { code: 'OL7', name: '주유소' },
  { code: 'SW8', name: '지하철역' },
  { code: 'BK9', name: '은행' },
  { code: 'PO3', name: '공공기관' },
  { code: 'HP8', name: '병원' },
  { code: 'PM9', name: '약국' },
  { code: 'CT1', name: '문화시설' },
];

// Refs
const mapViewerRef = ref(null);

// Methods
const moveMapToHouse = (house) => {
  if (mapViewerRef.value) {
    mapViewerRef.value.updateMapWithHouse(house);
  }
};

const handleCategoryClick = (categoryCode) => {
  emit('category-change', categoryCode);
};

// Expose methods to parent
defineExpose({
  moveMapToHouse,
});
</script>

<style scoped>
@media (max-width: 768px) {
  .map {
    display: none;
  }
}

.category-button-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 16px;
}

.category-button {
  background-color: #f0f0f0;
  color: #333;
  border: 1px solid #e0e0e0;
  padding: 8px 14px;
  border-radius: 6px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  white-space: nowrap;
}

.category-button:hover {
  background-color: #e5e5e5;
  border-color: #d0d0d0;
}

.category-button.selected {
  background-color: #ffe0e6;
  color: #ff385c;
  border-color: #ffcdd2;
  font-weight: 600;
}

.category-button:active {
  transform: translateY(1px);
}
</style>
