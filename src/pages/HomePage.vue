<script setup>
import { ref, onMounted } from 'vue';
import { KakaoMap, KakaoMapMarker } from "vue3-kakao-maps";

const mapRef = ref(null);
const addressInput = ref('');
const coordinate = ref({
  lat: 33.450701,
  lng: 126.570667
});

let geocoder = null;

onMounted(() => {
  if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
    geocoder = new window.kakao.maps.services.Geocoder();
  } else {
    console.error("Kakao maps services library not loaded.");
  }
});

const searchAddress = () => {
  if (!geocoder) {
    console.error("Geocoder not initialized.");
    return;
  }

  geocoder.addressSearch(addressInput.value, (result, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const newLat = parseFloat(result[0].y);
      const newLng = parseFloat(result[0].x);

      coordinate.value = {
        lat: newLat,
        lng: newLng
      };

      if (mapRef.value && mapRef.value.map) {
        const newLatLng = new window.kakao.maps.LatLng(newLat, newLng);
        mapRef.value.map.setCenter(newLatLng);
      }
    } else {
      alert('주소 검색 결과가 없습니다.');
    }
  });
};
</script>

<template>
  <div style="display: flex; width: 100%;">
    <div style="flex: 1;">
      <h1>첫 번째 페이지</h1>
      <div>
        <input type="text" v-model="addressInput" placeholder="주소를 입력하세요" @keyup.enter="searchAddress" />
        <button @click="searchAddress">검색</button>
      </div>
      <!-- 다른 내용이 있다면 여기에 추가 -->
    </div>
    <div style="flex: 1;">
      <KakaoMap ref="mapRef" :lat="coordinate.lat" :lng="coordinate.lng" :draggable="true" style="width: 100%; height: 500px;">
        <KakaoMapMarker :lat="coordinate.lat" :lng="coordinate.lng"></KakaoMapMarker>
      </KakaoMap>
    </div>
  </div>
</template>
