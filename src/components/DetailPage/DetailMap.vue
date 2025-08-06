<template>
  <div class="map-container" v-if="hasValidCoordinate">
    <KakaoMapViewer
      v-if="coordinate.lat && coordinate.lng"
      :initialLat="props.initialLat"
      :initialLng="props.initialLng"
      :houses="props.houses"
      :selectedCategory="props.selectedCategory"
    />
  </div>
  <div v-else-if="loading" class="map-placeholder">
    <LoadingSpinner />
  </div>
  <div v-else class="map-placeholder">
    <p>지도의 위치를 찾을 수 없습니다.</p>
  </div>
</template>

<script setup>
import { ref, watch, defineProps, computed } from 'vue';
import KakaoMapViewer from '@/components/KakaoMapViewer.vue';
import LoadingSpinner from '@/components/ui/LoadingSpinner.vue';


const props = defineProps({
  initialLat: { type: Number, default: 33.450701 },
  initialLng: { type: Number, default: 126.570667 },
  houses: { type: Array, default: () => [] }, 
  selectedCategory: { type: String, default: '' }, // 선택된 주변시설 카테고리
});

const loading = ref(true);

// 상태 변수
const coordinate = ref({
  lat: props.initialLat,
  lng: props.initialLng,
});

const geocoder = ref(null);
const map = ref(null);

// 좌표 유효성 판단
const hasValidCoordinate = computed(() => {
  return !!coordinate.value.lat && !!coordinate.value.lng;
});


const onMapLoad = (mapInstance) => {
  map.value = mapInstance;
  if (window.kakao?.maps?.services) {
    geocoder.value = new window.kakao.maps.services.Geocoder();

    if (props.address) {
      searchAddress(props.address);
    } else {
      loading.value = false;
    }
  } else {
    console.error('카카오맵 서비스 로딩 실패');
    loading.value = false;
  }
};

const searchAddress = () => {
  if (!geocoder.value || !props.address) return;

  loading.value = true;
  geocoder.value.addressSearch(props.address, (result, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const { y, x } = result[0];
      coordinate.value = {
        lat: parseFloat(y),
        lng: parseFloat(x),
      };
    } else {
      console.warn(`주소 검색 실패: ${props.address}, 상태: ${status}`);
      coordinate.value = {}; // 좌표 초기화
    }
    loading.value = false;
  });
};

watch(
  () => props.address,
  (newAddress) => {
    if (newAddress && geocoder.value) {
      searchAddress();
    }
  }
);
</script>

<style scoped>
.map-container {
  width: 100%;
  height: 450px; /* 지도의 높이를 지정 */
  border-radius: 12px;
  background-color: #f0f2f5;
  margin-bottom: 20px;
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
