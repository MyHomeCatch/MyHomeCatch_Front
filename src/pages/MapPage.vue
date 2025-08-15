<template>
  <div class="map-app-container">
    <!-- 왼쪽 지역별 필터링 패널 -->
    <div class="region-filter-panel">
      <div class="panel-header">
        <div class="logo-section">
          <div class="logo-icon">🏠</div>
          <span class="logo-text">LH</span>
        </div>
      </div>

      <div class="region-list">
        <div
          v-for="region in regionData"
          :key="region.name"
          class="region-item"
          :class="{ active: selectedRegion === region.name }"
          @click="selectRegion(region.name)"
        >
          <span class="region-name">{{ region.name }}</span>
          <span class="region-count">({{ region.count }})</span>
          <span class="expand-icon">▼</span>
        </div>
      </div>

      <!-- 지원 가능한 주택 목록 -->
      <div
        v-if="selectedRegion && filteredHouses.length > 0"
        class="support-section"
      >
        <div class="support-header">
          <div class="support-title">
            <span class="support-icon">🏠</span>
            <h3>{{ selectedRegion }} 지원 가능 공고</h3>
          </div>
          <span class="support-count">{{ filteredHouses.length }}개</span>
        </div>
        <div class="house-cards-container">
          <div
            v-for="house in filteredHouses.slice(0, 8)"
            :key="house.houseId || house.id"
            class="house-card-wrapper"
            :class="{
              selected:
                selectedMarker &&
                selectedMarker.house &&
                (selectedMarker.house.houseId ===
                  (house.houseId || house.id || house.danziId) ||
                  selectedMarker.house.danziId ===
                    (house.houseId || house.id || house.danziId)),
            }"
          >
            <MapPageHouseCard
              :house="{
                ...house,
                houseId: house.houseId || house.id,
                houseName: house.houseName || house.title || '주택명 없음',
                region: house.cnpCdNm || house.region || '지역 정보 없음',
                noticeType:
                  house.aisTpCdNm || house.noticeType || '타입 정보 없음',
                noticeStatus:
                  house.panSs || house.noticeStatus || '상태 정보 없음',
                exclusiveArea:
                  house.exclusiveArea || house.area || '면적 정보 없음',
                overviewImageUrl:
                  house.overviewImageUrl || house.imageUrl || '',
              }"
              :favorite-list="favoriteList"
              @card-click="handleHouseCardClick(house)"
              @toggle-favorite="handleToggleFavorite"
            />
          </div>
        </div>
        <div v-if="filteredHouses.length > 8" class="more-houses">
          <span>+ {{ filteredHouses.length - 8 }}개 더 보기</span>
        </div>
      </div>
    </div>

    <!-- 지도 섹션 -->
    <div class="map-section">
      <!-- 지도 위 필터링 버튼들 -->
      <div class="map-filters">
        <div
          class="filter-button"
          :class="{ active: activeFilters.includes('all') }"
          @click="toggleFilter('all')"
        >
          전체
        </div>
        <div
          class="filter-button"
          :class="{ active: activeFilters.includes('purchased') }"
          @click="toggleFilter('purchased')"
        >
          매입임대
        </div>
        <div
          class="filter-button"
          :class="{ active: activeFilters.includes('public') }"
          @click="toggleFilter('public')"
        >
          공공임대
        </div>
        <div
          class="filter-button"
          :class="{ active: activeFilters.includes('happy') }"
          @click="toggleFilter('happy')"
        >
          행복주택
        </div>
        <div
          class="filter-button"
          :class="{ active: activeFilters.includes('sale') }"
          @click="toggleFilter('sale')"
        >
          공공분양
        </div>
        <div
          class="filter-button"
          :class="{ active: activeFilters.includes('private') }"
          @click="toggleFilter('private')"
        >
          분양주택
        </div>
        <div
          class="filter-button"
          :class="{ active: activeFilters.includes('national') }"
          @click="toggleFilter('national')"
        >
          국민임대
        </div>
        <div
          class="filter-button"
          :class="{ active: activeFilters.includes('permanent') }"
          @click="toggleFilter('permanent')"
        >
          영구임대
        </div>
        <div
          class="filter-button"
          @click="toggleFilter('private-rental')"
          :class="{ active: activeFilters.includes('private-rental') }"
        >
          민간임대
        </div>
        <div
          class="filter-button"
          :class="{ active: activeFilters.includes('existing') }"
          @click="toggleFilter('existing')"
        >
          기전세
        </div>
      </div>

      <div class="social-facility-filters">
        <div
          class="filter-button"
          v-for="(category, index) in socialFacilityCategories"
          :key="index"
          :class="{ active: selectedSocialFacility === category.code }"
          @click="
            toggleSocialFacilityFilter(category.code),
              $emit('update:selectedCategory', category.code)
          "
        >
          {{ category.label }}
        </div>
      </div>

      <!-- 지도 컴포넌트 -->
      <div class="map-container">
        <KakaoMapViewer
          ref="mapViewerRef"
          :houses="filteredHouses"
          :selected-category="selectedCategory"
          :selectedCategory="selectedSocialFacility"
          @category-change="handleCategoryChange"
          @marker-select="handleMarkerSelect"
          @marker-deselect="handleMarkerDeselect"
        />
      </div>

      <!-- 지도 컨트롤 -->
      <div class="map-controls">
        <div class="control-button" @click="zoomIn">
          <span>+</span>
        </div>
        <div class="control-button" @click="zoomOut">
          <span>-</span>
        </div>
        <div class="control-button" @click="toggleFullscreen">
          <span>⛶</span>
        </div>
      </div>
    </div>

    <!-- ChatBot -->
    <ChatBot></ChatBot>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch, reactive } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import KakaoMapViewer from '@/components/KakaoMapViewer.vue';
import ChatBot from '../AI/ChatBot.vue';
import HouseCard from '../components/house/HouseCard.vue';
import MapPageHouseCard from '../components/house/MapPageHouseCard.vue';
import { useAuthStore } from '../stores/auth';
import { getBookmarks } from '../api/bookmardApi';

// Auth
const auth = useAuthStore();

// Refs
const mapViewerRef = ref(null);

const selectedMarker = ref(null); // 클릭으로 선택된 마커
const previousMapCenter = ref(null); // 마커선택 취소 후 롤백시킬 지도 중심위치
const previousZoomLevel = ref(null); // 마커선택 취소 후 롤백시킬 지도 확대Level
const selectedSocialFacility = ref(null); // 주변 공공시설 카테고리 필터

const selectedCategory = ref(''); // 주택 유형 필터
const activeFilters = ref(['all']);
const selectedRegion = ref('');
const houses = ref([]);
const favoriteList = ref([]);
const loading = ref(false);

// 페이지 정보
const pageInfo = reactive({
  currentPage: 0,
  endItem: 0,
  first: true,
  hasNext: false,
  hasPrevious: false,
  last: false,
  size: 20,
  startItem: 1,
  totalCount: 0,
  totalPages: 0,
});

// 검색 쿼리
const searchQuery = reactive({
  region: [],
  noticeType: [],
  noticeStatus: ['공고중', '접수중'], // 기본값
  page: 0,
  size: 100, // 초기 데이터를 많이 받아오기 위해 크게 설정
});

// 필터 옵션 (기존 HouseSearchLogic에서 가져옴)
const filterOptions = reactive({
  regions: [
    { code: '서울', name: '서울' },
    { code: '부산', name: '부산' },
    { code: '대구', name: '대구' },
    { code: '인천', name: '인천' },
    { code: '광주', name: '광주' },
    { code: '대전', name: '대전' },
    { name: '울산', code: '울산' },
    { name: '세종', code: '세종' },
    { name: '강원', code: '강원' },
    { name: '전북', code: '전북' },
    { name: '제주', code: '제주' },
    { name: '경기', code: '경기' },
    { name: '경남', code: '경남' },
    { name: '경북', code: '경북' },
    { name: '전남', code: '전남' },
    { name: '충남', code: '충남' },
    { name: '충북', code: '충북' },
  ],
  noticeTypes: [
    { code: '가정어린이집', name: '가정어린이집' },
    { code: '공공임대', name: '공공임대' },
    { code: '국민임대', name: '국민임대' },
    { code: '분양주택', name: '분양주택' },
    { code: '영구임대', name: '영구임대' },
    { code: '통합공공임대', name: '통합공공임대' },
    { code: '행복주택', name: '행복주택' },
    { code: '매입임대', name: '매입임대' },
    { code: '공공분양', name: '공공분양' },
    { code: '민간임대', name: '민간임대' },
    { code: '기전세', name: '기전세' },
  ],
  noticeStatuses: [
    { code: '공고중', name: '공고중' },
    { code: '접수마감', name: '접수마감' },
    { code: '정정공고중', name: '정정공고중' },
    { code: '접수중', name: '접수중' },
  ],
});

const socialFacilityCategories = [
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

// 지역 데이터 (API에서 동적으로 업데이트)
const regionData = ref([]);

// API URL 생성
const getQueryUrl = () => {
  const params = new URLSearchParams();
  params.append('page', searchQuery.page);
  params.append('size', searchQuery.size);

  searchQuery.region.forEach((region) => {
    if (region) params.append('cnpCdNm', region);
  });

  searchQuery.noticeType.forEach((type) => {
    if (type) params.append('aisTpCdNm', type);
  });

  searchQuery.noticeStatus.forEach((status) => {
    if (status) params.append('panSs', status);
  });

  return `/api/api/house?${params.toString()}`;
};

// 주택 목록 로드
const loadHouses = async () => {
  loading.value = true;

  try {
    const { data } = await axios.get(getQueryUrl());

    if (data.housingList) {
      houses.value = data.housingList;
      Object.assign(pageInfo, data.pageInfo);
    } else {
      houses.value = Array.isArray(data) ? data : [];
      pageInfo.totalCount = houses.value.length;
    }

    // 지역별 카운트 업데이트
    updateRegionCounts();
  } catch (error) {
    console.error('주택 목록 로드 실패:', error);
    houses.value = [];
    pageInfo.totalCount = 0;
  } finally {
    loading.value = false;
  }
};

// 지역별 카운트 업데이트
const updateRegionCounts = () => {
  const regionCounts = {};

  // 기본 지역 설정
  filterOptions.regions.forEach((region) => {
    regionCounts[region.name] = 0;
  });

  // 주택 데이터에서 지역별 카운트 계산
  houses.value.forEach((house) => {
    const region = house.cnpCdNm || house.region;
    if (region && regionCounts.hasOwnProperty(region)) {
      regionCounts[region]++;
    }
  });

  // regionData 업데이트
  regionData.value = filterOptions.regions.map((region) => ({
    name: region.name,
    count: regionCounts[region.name] || 0,
  }));
};

// 지도 필터링된 주택들
const filteredHouses = computed(() => {
  let filtered = houses.value;

  // 지역별 필터링
  if (selectedRegion.value) {
    filtered = filtered.filter((house) => {
      const region = house.cnpCdNm || house.region;
      return region === selectedRegion.value;
    });
  }

  // 주택 타입별 필터링
  if (activeFilters.value.includes('all')) {
    return filtered;
  }

  return filtered.filter((house) => {
    const houseType = house.aisTpCdNm || house.noticeType;

    if (
      activeFilters.value.includes('purchased') &&
      houseType?.includes('매입임대')
    )
      return true;
    if (
      activeFilters.value.includes('public') &&
      houseType?.includes('공공임대')
    )
      return true;
    if (
      activeFilters.value.includes('happy') &&
      houseType?.includes('행복주택')
    )
      return true;
    if (activeFilters.value.includes('sale') && houseType?.includes('공공분양'))
      return true;
    if (
      activeFilters.value.includes('private') &&
      houseType?.includes('분양주택')
    )
      return true;
    if (
      activeFilters.value.includes('national') &&
      houseType?.includes('국민임대')
    )
      return true;
    if (
      activeFilters.value.includes('permanent') &&
      houseType?.includes('영구임대')
    )
      return true;
    if (
      activeFilters.value.includes('private-rental') &&
      houseType?.includes('민간임대')
    )
      return true;
    if (
      activeFilters.value.includes('existing') &&
      houseType?.includes('기전세')
    )
      return true;

    return false;
  });
});

// 필터 토글
const toggleFilter = (filterType) => {
  if (filterType === 'all') {
    activeFilters.value = ['all'];
    searchQuery.noticeType = []; // 모든 타입 허용
  } else {
    const allIndex = activeFilters.value.indexOf('all');
    if (allIndex > -1) {
      activeFilters.value.splice(allIndex, 1);
    }

    const filterIndex = activeFilters.value.indexOf(filterType);
    if (filterIndex > -1) {
      activeFilters.value.splice(filterIndex, 1);
    } else {
      activeFilters.value.push(filterType);
    }

    // 필터가 없으면 전체로 설정
    if (activeFilters.value.length === 0) {
      activeFilters.value = ['all'];
      searchQuery.noticeType = [];
    } else {
      // 선택된 필터를 API 쿼리에 매핑
      searchQuery.noticeType = activeFilters.value
        .map((filter) => {
          switch (filter) {
            case 'purchased':
              return '매입임대';
            case 'public':
              return '공공임대';
            case 'happy':
              return '행복주택';
            case 'sale':
              return '공공분양';
            case 'private':
              return '분양주택';
            case 'national':
              return '국민임대';
            case 'permanent':
              return '영구임대';
            case 'private-rental':
              return '민간임대';
            case 'existing':
              return '기전세';
            default:
              return '';
          }
        })
        .filter(Boolean);
    }
  }
  // 필터 변경 시 API 호출
  loadHouses();
};

// 주변 공공시설 필터 토글
const toggleSocialFacilityFilter = (filterType) => {
  // 이미 선택된 필터면 해제
  if (filterType === selectedSocialFacility.value) {
    filterType = null;
    selectedSocialFacility.value = null;
  }
  // 새로운 필터 선택
  selectedSocialFacility.value = filterType;
};

// 지도 컨트롤
const zoomIn = () => {
  if (mapViewerRef.value) {
    mapViewerRef.value.zoomIn();
  }
};

const zoomOut = () => {
  if (mapViewerRef.value) {
    mapViewerRef.value.zoomOut();
  }
};

const toggleFullscreen = () => {
  if (mapViewerRef.value) {
    mapViewerRef.value.toggleFullscreen();
  }
};

// 카테고리 변경
const handleCategoryChange = (category) => {
  selectedCategory.value = selectedCategory.value === category ? '' : category;
};

// 지역 선택
const selectRegion = (regionName) => {
  selectedRegion.value = selectedRegion.value === regionName ? '' : regionName;

  // 지역 선택 시 해당 지역으로 검색 쿼리 업데이트
  if (selectedRegion.value) {
    searchQuery.region = [selectedRegion.value];
  } else {
    searchQuery.region = [];
  }

  // 지역이 바뀔 때 이전 지도 상태 초기화
  previousMapCenter.value = null;
  previousZoomLevel.value = null;
  selectedMarker.value = null;

  // API 호출
  loadHouses();

  if (mapViewerRef.value) {
    // 새로운 지역 선택시 지도 중심 및 확대level 저장
    previousMapCenter.value = mapViewerRef.value.getMapCenter();
    previousZoomLevel.value = mapViewerRef.value.getMapLevel();
  }
};

// 즐겨찾기 관련 메소드
const loadFavorites = async () => {
  if (!auth.isLoggedIn) {
    favoriteList.value = [];
    return;
  }

  try {
    const response = await getBookmarks(auth.token);
    favoriteList.value = response.bookmarks || [];
  } catch (error) {
    console.error('즐겨찾기 목록 로드 실패:', error);
    favoriteList.value = [];
  }
};

// MapPageHouseCard 클릭 핸들러
const handleHouseCardClick = (house) => {
  if (mapViewerRef.value) {
    // MapPageHouseCard 해당 마커 찾기 - 마커 기준으로 판단
    const targetMarker = mapViewerRef.value.findHouseMarker(
      house.danziId || house.houseId
    );
    if (targetMarker) {
      // 이미 선택된 카드 클릭시 선택 해제 후 지도 롤백 - 마커 기준으로 판단
      console.log(selectedMarker.value, targetMarker);
      if (selectedMarker.value && selectedMarker.value.id === targetMarker.id) {
        handleMarkerDeselect();
      } else {
        handleMarkerSelect({
          marker: targetMarker,
          house: targetMarker.house,
          position: new kakao.maps.LatLng(targetMarker.lat, targetMarker.lng),
        });
      }
    }
  }
};

// 즐겨찾기 토글 핸들러
const handleToggleFavorite = (data) => {
  console.log('즐겨찾기 토글:', data);
  // 즐겨찾기 상태 업데이트 로직
};

// 마커 클릭 핸들러
const handleMarkerSelect = ({ marker, house, position }) => {
  // 마커선택 이전 지도상태 저장
  if (mapViewerRef.value && selectedMarker.value === null) {
    previousMapCenter.value = mapViewerRef.value.getMapCenter();
    previousZoomLevel.value = mapViewerRef.value.getMapLevel();
  }
  // 마커 선택 저장
  selectedMarker.value = marker;
  // 지도 마커위치로 이동, Level : 5
  if (mapViewerRef.value) {
    mapViewerRef.value.updateMapWithHouse(house);
  }
};

const handleMarkerDeselect = () => {
  // 마커 선택 해제
  selectedMarker.value = null;

  // KakaoMapViewer의 activeHouseCenter, selectedMarker, publicFacilityMarkers 직접 초기화
  if (mapViewerRef.value) {
    mapViewerRef.value.clearMarker();
  }
  // 이전 지도 상태로 복원
  // if (
  //   previousMapCenter.value &&
  //   previousZoomLevel.value &&
  //   mapViewerRef.value
  // ) {
  //   mapViewerRef.value.moveToPosition(
  //     previousMapCenter.value,
  //     previousZoomLevel.value
  //   );
  // }
};

// 로그인 상태 변화 감지
watch(
  () => auth.isLoggedIn,
  async (newValue, oldValue) => {
    if (newValue !== oldValue) {
      await loadFavorites();
    }
  },
  { immediate: false }
);

// 컴포넌트 마운트 시 실행
onMounted(async () => {
  try {
    await loadFavorites();
    await loadHouses(); // API에서 실제 데이터 로드
  } catch (error) {
    console.error('HomePage 마운트 오류:', error);
  }
});

// 외부에서 접근 가능하도록 expose
defineExpose({
  refreshFavorites: loadFavorites,
  loadFavorites,
});
</script>

<style scoped>
.map-app-container {
  display: flex;
  height: 100vh;
  width: 100%;
  overflow: hidden;
}

/* 왼쪽 지역별 필터링 패널 */
.region-filter-panel {
  width: 350px;
  height: 100vh;
  background: white;
  border-right: 1px solid #e0e0e0;
  display: flex;
  flex-direction: column;
  box-shadow: 2px 0 8px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  overflow: hidden;
}

.panel-header {
  padding: 20px;
  border-bottom: 1px solid #f0f0f0;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 20px;
}

.logo-icon {
  font-size: 24px;
  background: linear-gradient(135deg, #4caf50, #45a049);
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

.category-tabs {
  display: flex;
  gap: 8px;
}

.category-tab {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e0e0e0;
}

.category-tab.active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.category-tab:hover:not(.active) {
  background: #f5f5f5;
}

.region-list {
  flex: 1;
  overflow-y: auto;
  padding: 0;
  max-height: 300px;
  padding-right: 8px;
}

.region-list::-webkit-scrollbar {
  width: 6px;
}

.region-list::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.region-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.region-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.region-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  border-bottom: 1px solid #f5f5f5;
  cursor: pointer;
  transition: background-color 0.2s;
}

.region-item:hover {
  background-color: #f8f9fa;
}

.region-item.active {
  background-color: #e8f5e8;
  border-left: 3px solid #4caf50;
}

.region-name {
  font-size: 14px;
  color: #333;
  flex: 1;
}

.region-count {
  font-size: 12px;
  color: #666;
  margin-right: 8px;
}

.expand-icon {
  font-size: 10px;
  color: #999;
  transition: transform 0.2s;
}

.region-item:hover .expand-icon {
  transform: rotate(180deg);
}

/* 지원 섹션 스타일 */
.support-section {
  margin-top: 20px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
}

.support-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 2px solid #e9ecef;
}

.support-title {
  display: flex;
  align-items: center;
  gap: 8px;
}

.support-icon {
  font-size: 20px;
}

.support-header h3 {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: #333;
}

.support-count {
  background: #4caf50;
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.house-cards-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
  /* 컨테이너 높이를 늘려서 더 많은 카드가 보이도록 */
  min-height: 50vh; /* 화면 높이의 50% */
  max-height: 60vh; /* 화면 높이의 60% */
  overflow-y: auto;
  padding-top: 8px;
  padding-bottom: 8px;
  padding-right: 8px;
  padding-left: 8px;
}

.house-cards-container::-webkit-scrollbar {
  width: 6px;
}

.house-cards-container::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.house-cards-container::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.house-cards-container::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.house-card-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
}

.house-card-wrapper:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
}

/* 선택된 하우스카드 래퍼 스타일 */
.house-card-wrapper.selected {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

/* 선택된 상태에서 호버 효과 */
.house-card-wrapper.selected:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 35px rgba(211, 218, 226, 0.4);
}

.more-houses {
  text-align: center;
  padding: 12px;
  color: #666;
  font-size: 12px;
  border-top: 1px solid #e9ecef;
  margin-top: 12px;
}

/* 지도 섹션 */
.map-section {
  flex: 1;
  position: relative;
  background: #f5f5f5;
}

/* 지도 위 주택 유형 필터링 버튼들 */
.map-filters {
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 1000;
  background: white;
  padding: 12px;
  border-radius: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.filter-button {
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  border: 1px solid #e0e0e0;
  background: white;
  color: #666;
  white-space: nowrap;
}

.filter-button.active {
  background: #4caf50;
  color: white;
  border-color: #4caf50;
}

.filter-button:hover:not(.active) {
  background: #f5f5f5;
}

/* 지도 위 주변 공공시설 필터링 버튼들 */
.social-facility-filters {
  position: absolute;
  top: 90px; /* map-filters 아래에 위치 */
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
  z-index: 1000;
  background: white;
  padding: 12px;
  border-radius: 25px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* 지도 컨테이너 */
.map-container {
  width: 100%;
  height: 100%;
}

/* 지도 컨트롤 */
.map-controls {
  position: absolute;
  bottom: 30px;
  right: 30px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  z-index: 1000;
}

.control-button {
  width: 40px;
  height: 40px;
  background: white;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  transition: all 0.2s;
  font-size: 18px;
  color: #666;
}

.control-button:hover {
  background: #f5f5f5;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .region-filter-panel {
    width: 250px;
  }

  .map-filters {
    flex-wrap: wrap;
    max-width: 90%;
  }

  .filter-button {
    font-size: 11px;
    padding: 6px 12px;
  }
}

@media (max-width: 480px) {
  .region-filter-panel {
    width: 220px;
  }

  .panel-header {
    padding: 16px;
  }

  .logo-section {
    margin-bottom: 16px;
  }

  .logo-icon {
    width: 32px;
    height: 32px;
    font-size: 20px;
  }

  .logo-text {
    font-size: 16px;
  }
}
</style>
