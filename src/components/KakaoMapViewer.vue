<script setup>
import { ref, onMounted, watch } from 'vue';
import { KakaoMap, KakaoMapMarker, KakaoMapInfoWindow } from "vue3-kakao-maps";

const props = defineProps({
  initialLat: { type: Number, default: 33.450701 },
  initialLng: { type: Number, default: 126.570667 },
  lhComplexes: { type: Array, default: () => [] }, // LH 단지 데이터 (DTO 형태)
  searchRadius: { type: Number, default: 2000 }, // 주변 시설 검색 반경 (미터)
  initialCategory: { type: String, default: 'PO3' }, // 초기 검색 카테고리
});

const mapRef = ref(null);
const coordinate = ref({ lat: props.initialLat, lng: props.initialLng });
const markers = ref([]); // LH 단지 마커
const publicFacilityMarkers = ref([]); // 공공시설 마커
const selectedPlaceInfo = ref(null); // 인포윈도우에 표시될 장소 정보

let geocoder = null;
let places = null; // Places 객체

// 카테고리별 마커 이미지 스프라이트 정보 (Kakao Map Places API 샘플 기준)
const categoryMap = {
  'PO3': { name: '공공기관', order: 0 },
  'SC4': { name: '학교', order: 3 },
  'HP8': { name: '병원', order: 7 },
  'PM9': { name: '약국', order: 8 },
  'MT1': { name: '대형마트', order: 1 },
  'CS2': { name: '편의점', order: 2 },
  'BK9': { name: '은행', order: 4 },
  'CT1': { name: '문화시설', order: 5 },
  'AD5': { name: '숙박', order: 6 },
  'FD6': { name: '음식점', order: 9 },
  'CE7': { name: '카페', order: 10 },
  'AT4': { name: '관광명소', order: 11 },
  // 필요한 다른 카테고리 추가
};

const currentCategory = ref(props.initialCategory); // 현재 선택된 카테고리

onMounted(() => {
  if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
    geocoder = new window.kakao.maps.services.Geocoder();
    places = new window.kakao.maps.services.Places();
    // 초기 LH 단지 마커 및 주변 시설 검색
    if (props.lhComplexes.length > 0) {
      updateMapWithComplex(props.lhComplexes[0]);
    }
  } else {
    console.error("Kakao maps services library not loaded.");
  }
});

// lhComplexes prop이 변경될 때 지도 업데이트
watch(() => props.lhComplexes, (newComplexes) => {
  if (newComplexes.length > 0) {
    updateMapWithComplex(newComplexes[0]);
  } else {
    markers.value = [];
    publicFacilityMarkers.value = [];
    selectedPlaceInfo.value = null;
  }
}, { deep: true });

// 특정 단지 정보로 지도 업데이트 (중심 이동, 마커 표시, 주변 시설 검색)
const updateMapWithComplex = (complex) => {
  if (!geocoder) {
    console.error("Geocoder not initialized.");
    return;
  }

  // 주소 검색 시도 (첫 번째 조합)
  geocodeDetailedAddress(complex, 0); // 0은 첫 번째 시도를 의미
};

// 상세 주소로 지오코딩 및 지도 이동/마커 추가 (재시도 로직 포함)
const geocodeDetailedAddress = (complex, attempt, searchFacilities = true) => {
  if (!geocoder) {
    console.error("Geocoder not initialized.");
    return;
  }

  let fullAddress = '';
  if (attempt === 0) {
    fullAddress = `${complex.lct_ara_adr} ${complex.complexName}`;
  } else if (attempt === 1) {
    fullAddress = `${complex.lct_ara_adr} ${complex.lct_ara_dtl_adr}`;
  } else if (attempt === 2 ){
    fullAddress = `${complex.lct_ara_adr}`;
  } else {
    console.error("Invalid attempt number.");
    return;
  }

  geocoder.addressSearch(fullAddress, (result, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const newLat = parseFloat(result[0].y);
      const newLng = parseFloat(result[0].x);

      coordinate.value = {
        lat: newLat,
        lng: newLng
      };

      // LH 단지 마커 업데이트
      markers.value = [{
        lat: newLat,
        lng: newLng,
        name: complex.complexName,
        address: fullAddress
      }];

      // 지도를 해당 위치로 이동
      if (mapRef.value && mapRef.value.map) {
        const newLatLng = new window.kakao.maps.LatLng(newLat, newLng);
        mapRef.value.map.setCenter(newLatLng);

        // 지도 이동 후 주변 시설 검색
        if (searchFacilities) {
          searchPublicFacilities(newLatLng, currentCategory.value);
        }
      }
    } else {
      console.warn(`주소 검색 실패: ${fullAddress} (${status})`);
      // 첫 번째 시도 실패 시 두 번째 시도
      if (attempt === 0) {
        geocodeDetailedAddress(complex, 1, searchFacilities); // 두 번째 시도
      } else if (attempt === 1) {
        geocodeDetailedAddress(complex, 2, searchFacilities); // 세 번째 시도
      } else {
        alert(`'${complex.complexName}'에 대한 주소 검색 결과가 없습니다.`);
      }
    }
  });
};

// 주변 공공시설 검색
const searchPublicFacilities = (centerLatLng, categoryCode) => {
  if (!places) {
    console.error("Places API not initialized.");
    return;
  }

  publicFacilityMarkers.value = []; // 기존 공공시설 마커 초기화
  selectedPlaceInfo.value = null; // 인포윈도우 닫기

  places.categorySearch(categoryCode, (data, status, pagination) => {
    if (status === window.kakao.maps.services.Status.OK) {
      data.forEach(place => {
        publicFacilityMarkers.value.push({
          lat: parseFloat(place.y),
          lng: parseFloat(place.x),
          name: place.place_name,
          category: place.category_group_name, // 카테고리 그룹 이름 (예: 공공기관)
          categoryCode: place.category_group_code, // 카테고리 코드 (예: PO3)
          address: place.address_name,
          roadAddress: place.road_address_name,
          phone: place.phone,
          placeUrl: place.place_url,
        });
      });
      // 필요하다면 pagination을 사용하여 다음 페이지 결과도 가져올 수 있습니다.
    } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
      console.log("주변 공공시설 검색 결과가 없습니다.");
    } else {
      console.error("주변 공공시설 검색 중 오류 발생: " + status);
    }
  }, {
    location: centerLatLng, // 현재 지도 중심 좌표
    radius: props.searchRadius // 검색 반경 (미터 단위)
  });
};

// 카테고리 버튼 클릭 핸들러
const onClickCategory = (categoryCode) => {
  currentCategory.value = categoryCode;
  if (mapRef.value && mapRef.value.map) {
    const center = mapRef.value.map.getCenter();
    searchPublicFacilities(center, categoryCode);
  }
};

// 마커 이미지 옵션 생성 함수
const getMarkerImageOptions = (categoryCode) => {
  const imageSrc = 'https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/places_category.png';
  const imageSize = new window.kakao.maps.Size(27, 28);
  const categoryInfo = categoryMap[categoryCode];
  // 스프라이트 이미지에서 해당 카테고리의 아이콘 위치 계산
  const spriteOrigin = categoryInfo ? new window.kakao.maps.Point(46, (categoryInfo.order * 36)) : new window.kakao.maps.Point(0, 0); 

  return new window.kakao.maps.MarkerImage(imageSrc, imageSize, {
    spriteSize: new window.kakao.maps.Size(72, 208),
    spriteOrigin: spriteOrigin,
    offset: new window.kakao.maps.Point(11, 28)
  });
};

// 인포윈도우 열기
const openInfowindow = (place) => {
  selectedPlaceInfo.value = place;
};

// 인포윈도우 닫기
const closeInfowindow = () => {
  selectedPlaceInfo.value = null;
};

// 부모 컴포넌트에서 호출할 수 있도록 노출
defineExpose({
  updateMapWithComplex,
});

</script>

<template>
  <div style="display: flex; flex-direction: column; height: 100%;">
    <div style="margin-bottom: 10px;">
      <h3>주변 시설 카테고리</h3>
      <div style="display: flex; gap: 10px; flex-wrap: wrap;">
        <button v-for="(cat, code) in categoryMap" :key="code" @click="onClickCategory(code)" :class="{ 'active-category': currentCategory === code }" style="padding: 8px 15px; border: 1px solid #ccc; border-radius: 5px; cursor: pointer; background-color: #f9f9f9;">
          {{ cat.name }}
        </button>
      </div>
    </div>
    <div style="flex-grow: 1;">
      <KakaoMap ref="mapRef" :lat="coordinate.lat" :lng="coordinate.lng" :draggable="true" style="width: 100%; height: 100%;">
        <!-- LH 단지 마커 -->
        <KakaoMapMarker v-for="(marker, index) in markers" :key="'lh-' + index" :lat="marker.lat" :lng="marker.lng" :title="marker.name"></KakaoMapMarker>
        <!-- 공공시설 마커 -->
        <KakaoMapMarker 
          v-for="(marker, index) in publicFacilityMarkers" 
          :key="'pub-' + index" 
          :lat="marker.lat" 
          :lng="marker.lng" 
          :title="marker.name + ' (' + marker.category + ')'"
          :image="getMarkerImageOptions(marker.categoryCode)"
          @click="openInfowindow(marker)"
        ></KakaoMapMarker>

        <!-- 인포윈도우 -->
        <KakaoMapInfoWindow
          v-if="selectedPlaceInfo"
          :lat="selectedPlaceInfo.lat"
          :lng="selectedPlaceInfo.lng"
          :infoWindowOptions="{ removable: true }"
          @close="closeInfowindow"
        >
          <div style="padding:5px;">
            <strong>{{ selectedPlaceInfo.name }}</strong><br>
            <span v-if="selectedPlaceInfo.roadAddress">{{ selectedPlaceInfo.roadAddress }}</span>
            <span v-else>{{ selectedPlaceInfo.address }}</span><br>
            <span v-if="selectedPlaceInfo.phone">{{ selectedPlaceInfo.phone }}</span><br>
            <a :href="selectedPlaceInfo.placeUrl" target="_blank">상세보기</a>
          </div>
        </KakaoMapInfoWindow>

      </KakaoMap>
    </div>
  </div>
</template>

<style scoped>
.active-category {
  background-color: #007bff !important;
  color: white;
  border-color: #007bff !important;
}
</style>
