<script setup>
import { ref, watch } from 'vue';
import {
  KakaoMap,
  KakaoMapMarker,
  KakaoMapCustomOverlay,
} from 'vue3-kakao-maps';
import HouseInfoOverlay from './house/HouseInfoOverlay.vue';

const props = defineProps({
  initialLat: { type: Number, default: 33.450701 },
  initialLng: { type: Number, default: 126.570667 },
  houses: { type: Array, default: () => [] }, // LH 단지 데이터 (DTO 형태)
  selectedCategory: { type: String, default: '' }, // 선택된 주변시설 카테고리
});

const map = ref(null);
const coordinate = ref({ lat: props.initialLat, lng: props.initialLng });
const markers = ref([]); // LH 단지 마커
const publicFacilityMarkers = ref([]); // 공공시설 마커
const selectedPlaceInfo = ref(null); // 인포윈도우에 표시될 장소 정보
const selectedMarker = ref(null); // LH 단지 인포윈도우 정보
const currentCategory = ref(props.selectedCategory); // 현재 선택된 카테고리
let customOverlay = null;
let geocoder = null;
let places = null; // 장소 검색 객체

watch(map, () => {
  if (window.kakao && window.kakao.maps && window.kakao.maps.services) {
    geocoder = new window.kakao.maps.services.Geocoder();
    // 초기 모든 LH 단지 마커 표시
    places = new window.kakao.maps.services.Places();
    // Places 서비스 초기화
    if (props.houses.length > 0) {
      loadAllComplexes();
    }
  } else {
    console.error('Kakao maps services library not loaded.');
  }
});

// selectedCategory prop이 변경될 때 시설 검색
watch(
  () => props.selectedCategory,
  (newCategory) => {
    currentCategory.value = newCategory;
    if (newCategory && map.value) {
      const currentCenter = map.value.getCenter();
      searchPlaces( newCategory, currentCenter );
    } else {
      publicFacilityMarkers.value = [];
      // 카테고리 없으면 마커 초기화
    }
  }
);

const searchPlaces = (categoryGroupCode, center) => {
  if (!places || !map.value) {
    console.error('Places service or map not initailized.');
    return;
  }
  // 기존 공공시설 마커 제거
  publicFacilityMarkers.value = [];

  // 공공시설 검색옵션 : 공고지역 중심, 반경 1000m = 1km, 최대 15개 검색
  // limit- radius : 20000m = 20km, size : 15개가 한계
  const options = { location: center, radius: 1000, size: 15 };
  places.categorySearch(categoryGroupCode, placesSearchCB, options);
};

// 장소검색 callback 함수
const placesSearchCB = (data, status, pagination) => {
  if (status === window.kakao.maps.services.Status.OK) {
    displayPlaces(data);
  } else if (status === window.kakao.maps.services.Status.ZERO_RESULT) {
    console.warn('검색 결과가 없습니다.');
  } else if (status === window.kakao.maps.services.Status.ERROR) {
    console.error('장소 검색 중 오류가 발생했습니다.');
  }
};

// 검색결과 마커표시
const displayPlaces = (placesData) => {
  // 상세페이지에서 지도가 초기화되는 문제를 해결못해서 주석처리함
  // const bounds = new window.kakao.maps.LatLngBounds();
  // const newLatLng = new window.kakao.maps.LatLng(
  //   coordinate.value.lat,
  //   coordinate.value.lng
  // );
  for (let i = 0; i < placesData.length; i++) {
    const place = placesData[i];
    const marker = {
      id: place.id,
      lat: place.y,
      lng: place.x,
      title: place.place_name,
      address: place.address_name,
      phone: place.phone,
      url: place.place_url,
    };
    publicFacilityMarkers.value.push(marker);
    // 상세페이지에서 지도가 초기화되는 문제를 해결못해서 주석처리함
    // bounds.extend(new window.kakao.maps.LatLng(place.y, place.x));
  }
  // 상세페이지에서 지도가 초기화되는 문제를 해결못해서 주석처리함
  // if (publicFacilityMarkers.value.length > 0) {
  //   bounds.extend(
  //     new window.kakao.maps.LatLng(coordinate.value.lat, coordinate.value.lng)
  //   );
  //   map.value.setBounds(bounds);
  //   map.value.setCenter(newLatLng);
  //   // 카카오맵을 단지 마커가 중심으로 가게 고정
  // }
  map.value.setLevel(5);

};

// houses prop이 변경될 때 지도 업데이트
watch(
  () => props.houses,
  (newHouses) => {
    console.log('  ⚠️  : ', newHouses);

    if (!map.value) return;

    if (newHouses.length > 0) {
      loadAllComplexes();
    } else {
      markers.value = [];
      publicFacilityMarkers.value = [];
      selectedPlaceInfo.value = null;
      selectedMarker.value = null;
    }
  },
  { deep: true }
);

// 모든 단지를 지도에 마커로 표시
const loadAllComplexes = async () => {
  if (!geocoder || props.houses.length === 0) {
    return;
  }

  markers.value = []; // 기존 마커 초기화
  publicFacilityMarkers.value = []; // 기존 단지주변 공공시설 마커 초기화
  const bounds = new window.kakao.maps.LatLngBounds(); // 지도 영역 설정용

  // 각 단지에 대해 지오코딩 수행
  for (const house of props.houses) {
    await geocodeComplex(house, bounds);
  }

  console.log('  ⚠️  : ', bounds);

  if (markers.value.length === 1) {
    // 마커가 하나뿐인 경우 해당 위치로 이동하고 적절한 줌 레벨 설정
    const marker = markers.value[0];
    const newLatLng = new window.kakao.maps.LatLng(marker.lat, marker.lng);
    map.value.setCenter(newLatLng);
    map.value.setLevel(5); // 더 가까운 줌 레벨
  } else {
    // 여러 마커가 있는 경우 모든 마커를 포함하는 영역으로 조정
    map.value.setBounds(bounds);

    // setBounds 후에 패딩을 추가하여 마커들이 가장자리에 붙지 않도록 함
    setTimeout(() => {
      if (map.value && map.value.map) {
        const currentLevel = map.value.map.getLevel();
        // 현재 레벨에서 1단계 더 축소하여 여백 추가
        map.value.map.setLevel(Math.min(currentLevel + 1, 10));
      }
    }, 100);
  }
};

// 단일 단지 지오코딩
const geocodeComplex = (house, bounds) => {
  return new Promise((resolve) => {
    geocodeDetailedAddress(house, 0, false, (result) => {
      if (result) {
        const latLng = new window.kakao.maps.LatLng(result.lat, result.lng);
        bounds.extend(latLng);

        // 바운딩 박스에 약간의 패딩을 추가
        const padding = 0.001; // 약 100m 정도의 패딩
        bounds.extend(
          new window.kakao.maps.LatLng(
            result.lat + padding,
            result.lng + padding
          )
        );
        bounds.extend(
          new window.kakao.maps.LatLng(
            result.lat - padding,
            result.lng - padding
          )
        );
      }
      resolve(result);
    });
  });
};

// 상세 주소로 지오코딩 및 마커 추가 (재시도 로직 포함)
const geocodeDetailedAddress = (
  house,
  attempt,
  searchFacilities = false,
  callback = null
) => {
  if (!geocoder) {
    console.error('Geocoder not initialized.');
    if (callback) callback(null);
    return;
  }

  let fullAddress = '';
  if (attempt === 0) {
    fullAddress = `${house.address} ${house.houseName}`;
  } else if (attempt === 1) {
    fullAddress = `${house.houseName}`;
  } else if (attempt === 2) {
    fullAddress = `${house.address}`;
  } else {
    console.error('Invalid attempt number.');
    if (callback) callback(null);
    return;
  }

  geocoder.addressSearch(fullAddress, (result, status) => {
    if (status === window.kakao.maps.services.Status.OK) {
      const newLat = parseFloat(result[0].y);
      const newLng = parseFloat(result[0].x);

      const markerData = {
        id: house.danziId,
        lat: newLat,
        lng: newLng,
        house: house, // 원본 complex 데이터 보관
      };

      // 마커 배열에 추가
      markers.value.push(markerData);

      // 첫 번째 단지의 경우 지도 중심으로 설정하고 주변 시설 검색
      if (searchFacilities && map.value && map.value.map) {
        coordinate.value = { lat: newLat, lng: newLng };
        const newLatLng = new window.kakao.maps.LatLng(newLat, newLng);
        map.value.map.setCenter(newLatLng);
      }

      if (callback) callback(markerData);
    } else {
      console.warn(`주소 검색 실패: ${fullAddress} (${status})`);
      // 첫 번째 시도 실패 시 두 번째 시도
      if (attempt === 0) {
        geocodeDetailedAddress(house, 1, searchFacilities, callback);
      } else if (attempt === 1) {
        geocodeDetailedAddress(house, 2, searchFacilities, callback);
      } else {
        console.warn(`'${house.houseId}'에 대한 주소 검색 결과가 없습니다.`);
        if (callback) callback(null);
      }
    }
  });
};

// 특정 단지 정보로 지도 업데이트 (중심 이동, 주변 시설 검색)
const updateMapWithHouse = (house) => {
  if (!house) {
    selectedMarker.value = null;
    return;
  }

  if (!geocoder) {
    console.error('Geocoder not initialized.');
    return;
  }

  // 기존 마커 중에서 해당 단지 찾기
  const existingMarker = markers.value.find(
    (marker) => marker.house.danziId === house.danziId
  );

  if (existingMarker) {
    coordinate.value = { lat: existingMarker.lat, lng: existingMarker.lng };

    // 기존 공공시설 마커 초기화
    publicFacilityMarkers.value = [];

    if (map.value) {
      const newLatLng = new window.kakao.maps.LatLng(
        existingMarker.lat,
        existingMarker.lng
      );

      console.log('  ⚠️  : ', '지도 변경');

      map.value.setCenter(newLatLng);
      map.value.setLevel(3);
      selectedMarker.value = existingMarker;

      // 카테고리가 이미 선택됐다면 새로운 단지위치로 이동 후 주변시설 검색
      if (currentCategory.value) {
        searchPlaces(currentCategory.value, newLatLng);
      }
    }
  }
};

const onLoadKakaoMap = (newMap) => {
  map.value = newMap;
};

// 인포윈도우 열기 (LH 단지) - 레거시
const openComplexInfowindow = (marker) => {
  console.log('LH 단지 마커 클릭:', marker);
  selectedMarker.value = marker;
};

// 인포윈도우 닫기
const closeOverlay = () => {
  selectedMarker.value = null;
};

// 부모 컴포넌트에서 호출할 수 있도록 노출
defineExpose({
  updateMapWithHouse,
});
</script>

<template>
  <div style="display: flex; flex-direction: column; height: 100%">
    <div style="flex-grow: 1">
      <KakaoMap
        :lat="coordinate.lat"
        :lng="coordinate.lng"
        :draggable="true"
        @on-load-kakao-map="onLoadKakaoMap"
        style="width: 100%; height: 100%"
      >
        <!-- LH 단지 마커 -->
        <KakaoMapMarker
          v-for="marker in markers"
          :key="marker.id"
          :lat="marker.lat"
          :lng="marker.lng"
          :title="marker.name"
          :clickable="true"
          v-on:onClickKakaoMapMarker="openComplexInfowindow(marker)"
          :z-index="20"
        >
        </KakaoMapMarker>

        <!-- 단지주변 공공시설 마커 -->
        <!-- 단지주변 공공시설 마커 이미지: 단지 마커(카카오맵 기본)와 구분하기 위해 png 첨부 -->
        <KakaoMapMarker
          v-for="marker in publicFacilityMarkers"
          :key="'facility-' + marker.id"
          :lat="marker.lat"
          :lng="marker.lng"
          :title="marker.title"
          :clickable="true"
          :image="{
            imageSrc: '/src/assets/images/locationPin.png',
            imageWidth: 30,
            imageHeight: 30,
            imageOption: {},
          }"
          :z-index="10"
        >
        </KakaoMapMarker>

        <KakaoMapCustomOverlay
          v-if="selectedMarker"
          :lat="selectedMarker.lat"
          :lng="selectedMarker.lng"
          :z-index="30"
        >
          <HouseInfoOverlay
            :house="selectedMarker.house"
            @close="closeOverlay"
          />
        </KakaoMapCustomOverlay>
      </KakaoMap>
    </div>
  </div>
</template>

<style></style>
