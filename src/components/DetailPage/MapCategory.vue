<template>
  <div class="category-button-wrapper">
    <button
      v-for="(category, index) in categories"
      :key="index"
      :class="{
        'category-button': true,
        selected: selectedCategory === category.code,
      }"
      @click="$emit('update:selectedCategory', category.code)"
    >
      {{ category.label }}
    </button>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  selectedCategory: String,
});

const emits = defineEmits(['update:selectedCategory']);

const categories = [
  { code: 'MT1', label: '대형마트' },
  { code: 'CS2', label: '편의점' },
  { code: 'PS3', label: '어린이집' },
  { code: 'SC4', label: '학교' },
  { code: 'AC5', label: '학원' },
  { code: 'OL7', label: '주유소' },
  { code: 'SW8', label: '지하철역' },
  { code: 'BK9', label: '은행' },
  { code: 'PO3', label: '공공기관' },
  { code: 'HP8', label: '병원' },
  { code: 'PM9', label: '약국' },
  { code: 'CT1', label: '문화시설' },
];
</script>

<style scoped>
.category-button-wrapper {
  display: flex;
  flex-wrap: nowrap; /* 한 줄 유지 */
  gap: 6px;
  margin-bottom: 16px;
  background: transparent; /* 배경 없애기 */
  overflow-x: auto; /* 가로 스크롤 생김 */
  padding-bottom: 4px; /* 스크롤 공간 확보용 약간 여백 */
  -webkit-overflow-scrolling: touch; /* iOS 부드러운 스크롤 */
  scrollbar-width: thin; /* 얇게 */
  scrollbar-color: #86a788 white;
}

.category-button {
  background-color: white; /* 원래 버튼 배경 */
  color: #333;
  border: none;
  padding: 8px 14px;
  border-radius: 1.5rem;
  font-size: 14px;
  font-weight: bolder;
  cursor: pointer;
  white-space: nowrap;
  transition: all 0.2s ease-in-out;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.category-button:hover {
  background-color: #f5f5f5;
  border-color: #bbb;
}

.category-button.selected {
  background-color: #86a788;
  color: white;
  border-color: #86a788;
  font-weight: 600;
}

.category-button:active {
  transform: translateY(1px);
}
</style>
