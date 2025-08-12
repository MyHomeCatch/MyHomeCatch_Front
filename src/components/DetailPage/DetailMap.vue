<template>
  <div>
    <div
      class="map-container"
      v-if="hasValidCoordinate"
      style="position: relative"
    >
      <!-- 지도 위에 카테고리 버튼 오버레이 -->
      <div class="map-category-overlay">
        <MapCategory
          :selectedCategory="selectedCategory"
          @update:selectedCategory="(val) => (selectedCategory = val)"
        />
      </div>

      <KakaoMapViewer
        v-if="coordinate.lat && coordinate.lng"
        :initialLat="props.initialLat"
        :initialLng="props.initialLng"
        :houses="props.houses"
        :selectedCategory="selectedCategory"
      />
    </div>

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
import MapCategory from '@/components/DetailPage/MapCategory.vue'; // 경로는 실제 위치에 맞게 조정

const props = defineProps({
  houses: { type: Array, default: () => [] },
  selectedCategory: { type: String, default: '' }, // 선택된 주변시설 카테고리
  address: { type: String, default: '' }, // 주소 prop 추가 필요하면
  initialLat: { type: Number, default: 33.450701 }, // 초기 위도
  initialLng: { type: Number, default: 126.570667 }, // 초기 경도
});

const selectedCategory = ref(props.selectedCategory);
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
  height: 620px; /* 450px에서 100%로 변경 */
  border-radius: 12px;
  background-color: #f0f2f5;
  margin-bottom: 0; /* 부모 높이 맞출 때 마진 조절 필요할 수 있음 */
  position: relative;
}

/* 카테고리 버튼 지도 위 오버레이 위치 */
.map-category-overlay {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  z-index: 10;
  background: transparent; /* 배경 투명 처리 */
  padding: 8px 12px;
  border-radius: 10px;
  box-shadow: none; /* 그림자 제거 */
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