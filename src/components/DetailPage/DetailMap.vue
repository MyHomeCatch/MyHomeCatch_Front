<template>
  <div :class="['map-container', { 'shift-left': showSummary }]">
    <KakaoMapViewer
      v-if="coordinate.lat && coordinate.lng"
      :initialLat="coordinate.lat"
      :initialLng="coordinate.lng"
      :houses="houses"
      :selectedCategory="selectedCategory"
    />
    <div v-else-if="loading" class="map-placeholder">
      <LoadingSpinner />
    </div>
    <div v-else class="map-placeholder">
      <p>지도의 위치를 찾을 수 없습니다.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, computed } from 'vue';
import KakaoMapViewer from '@/components/KakaoMapViewer.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';

const props = defineProps({
  houses: Array,
  selectedCategory: String,
  address: String,
  showSummary: Boolean,
});

const loading = ref(true);
const coordinate = ref({ lat: 33.450701, lng: 126.570667 });
const geocoder = ref(null);

const hasValidCoordinate = computed(
  () => !!coordinate.value.lat && !!coordinate.value.lng
);

const searchAddress = () => {
  if (!geocoder.value || !props.address) return;

  loading.value = true;
  geocoder.value.addressSearch(props.address, (result, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      coordinate.value = {
        lat: parseFloat(result[0].y),
        lng: parseFloat(result[0].x),
      };
    } else {
      coordinate.value = {};
    }
    loading.value = false;
  });
};

watch(
  () => props.address,
  (newVal) => {
    if (newVal) {
      if (!geocoder.value && window.kakao?.maps?.services) {
        geocoder.value = new window.kakao.maps.services.Geocoder();
      }
      searchAddress();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.map-container {
  width: 600px;
  height: 450px;
  border-radius: 12px;
  background-color: #f0f2f5;
  transition: transform 0.3s ease;
  box-sizing: border-box;
}

.map-container.shift-left {
  transform: translateX(-30%);
}

.map-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  color: #6b7280;
}
</style>
