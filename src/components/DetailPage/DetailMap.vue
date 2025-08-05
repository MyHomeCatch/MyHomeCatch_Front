<script setup>
import {defineProps} from 'vue';
import KakaoMapViewer from "@/components/KakaoMapViewer.vue";

const props = defineProps({
  initialLat: { type: Number, default: 33.450701 },
  initialLng: { type: Number, default: 126.570667 },
  houses: { type: Array, default: () => [] }, // LH 단지 데이터 (DTO 형태)
  selectedCategory: { type: String, default: '' }, // 선택된 주변시설 카테고리
});
</script>

<template>
<div style="width: 100%; height: 500px">
  <KakaoMapViewer
    :initialLat="props.initialLat"
    :initialLng="props.initialLng"
    :houses="props.houses"
    :selectedCategory="props.selectedCategory"
    />
</div>
</template>

<style scoped>

</style>