<template>
  <div class="house-container">
    <!-- 필터 컴포넌트 -->
    <HouseFilter
      :filters="searchQuery"
      :filter-options="filterOptions"
      @update-filter="updateFilter"
      @clear-filter="clearFilter"
      @clear-all="clearAllFilters"
      @search="searchHouses"
    />

    <!-- 검색 결과 정보 -->
    <div class="result-info">
      <div class="result-count">
        총 <strong>{{ pageInfo.totalCount }}</strong
        >개의 주택이 검색되었습니다.
      </div>
      <div class="page-info">
        {{ pageInfo.startItem }}-{{ pageInfo.endItem }} /
        {{ pageInfo.totalCount }}
      </div>
    </div>

    <!-- 리스트와 지도 영역 -->
    <div class="list-map-wrapper">
      <!-- 주택 정보 그리드 -->
      <div class="house-list">
        <div v-if="!loading && houses.length > 0" class="house-grid">
          <HouseCard
            v-for="house in houses"
            :key="house.houseId"
            :house="house"
            @card-click="handleCardClick"
            @toggle-favorite="handleToggleFavorite"
          />
        </div>

        <div v-if="loading" class="loading">
          <div class="loading-spinner"></div>
          <p>주택 정보를 불러오는 중...</p>
        </div>

        <div v-if="!loading && houses.length === 0" class="no-results">
          <div class="no-results-icon">🏠</div>
          <h3>검색 결과가 없습니다</h3>
          <p>다른 조건으로 검색해보세요.</p>
          <button @click="clearAllFilters" class="clear-button">
            필터 초기화
          </button>
        </div>
      </div>

      <!-- 지도 -->
      <div class="map">
        <div class="category-button-wrapper">
          <button
            :class="{
              'category-button': true,
              selected: selectedCategory === 'MT1',
            }"
            @click="selectedCategory = 'MT1'"
          >
            대형마트
          </button>
          <button
            :class="{
              'category-button': true,
              selected: selectedCategory === 'CS2',
            }"
            @click="selectedCategory = 'CS2'"
          >
            편의점
          </button>
          <button
            :class="{
              'category-button': true,
              selected: selectedCategory === 'PS3',
            }"
            @click="selectedCategory = 'PS3'"
          >
            어린이집
          </button>
          <button
            :class="{
              'category-button': true,
              selected: selectedCategory === 'SC4',
            }"
            @click="selectedCategory = 'SC4'"
          >
            학교
          </button>
          <button
            :class="{
              'category-button': true,
              selected: selectedCategory === 'AC5',
            }"
            @click="selectedCategory = 'AC5'"
          >
            학원
          </button>
          <button
            :class="{
              'category-button': true,
              selected: selectedCategory === 'OL7',
            }"
            @click="selectedCategory = 'OL7'"
          >
            주유소
          </button>
          <button
            :class="{
              'category-button': true,
              selected: selectedCategory === 'SW8',
            }"
            @click="selectedCategory = 'SW8'"
          >
            지하철역
          </button>
          <button
            :class="{
              'category-button': true,
              selected: selectedCategory === 'BK9',
            }"
            @click="selectedCategory = 'BK9'"
          >
            은행
          </button>
          <button
            :class="{
              'category-button': true,
              selected: selectedCategory === 'PO3',
            }"
            @click="selectedCategory = 'PO3'"
          >
            공공기관
          </button>
          <button
            :class="{
              'category-button': true,
              selected: selectedCategory === 'HP8',
            }"
            @click="selectedCategory = 'HP8'"
          >
            병원
          </button>
          <button
            :class="{
              'category-button': true,
              selected: selectedCategory === 'PM9',
            }"
            @click="selectedCategory = 'PM9'"
          >
            약국
          </button>
          <button
            :class="{
              'category-button': true,
              selected: selectedCategory === 'CT1',
            }"
            @click="selectedCategory = 'CT1'"
          >
            문화시설
          </button>
        </div>
        <div class="map-content">
          <KakaoMapViewer
            ref="mapViewerRef"
            :houses="houses"
            :selectedCategory="selectedCategory"
          />
        </div>
      </div>
    </div>

    <!-- 페이지네이션 -->
    <HousePagination :page-info="pageInfo" @page-change="changePage" />

    <!-- ChatBot -->
    <ChatBot></ChatBot>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import HouseFilter from '../components/house/HouseFilter.vue';
import HouseCard from '../components/house/HouseCard.vue';
import HousePagination from '../components/house/HousePagination.vue';
import KakaoMapViewer from '@/components/KakaoMapViewer.vue';
import ChatBot from '../AI/ChatBot.vue';

const router = useRouter();
const route = useRoute();
const mapViewerRef = ref(null);
const selectedCategory = ref('');

const moveMapToHouse = (house) => {
  if (mapViewerRef.value) {
    mapViewerRef.value.updateMapWithHouse(house);
  }
};

const loading = ref(false);
const houses = ref([]);

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

const searchQuery = reactive({
  region: route.query.region || '',
  noticeType: route.query.noticeType || '',
  noticeStatus: route.query.noticeStatus || '',
  page: parseInt(route.query.page) || 0,
  size: parseInt(route.query.size) || 20,
});

const filterOptions = reactive({
  regions: [
    { code: '서울', name: '서울' },
    { code: '부산', name: '부산' },
    { code: '대구', name: '대구' },
    { code: '인천', name: '인천' },
    { code: '광주', name: '광주' },
    { code: '대전', name: '대전' },
    { code: '울산', name: '울산' },
    { code: '세종', name: '세종' },
    { code: '강원', name: '강원' },
    { code: '전북', name: '전북' },
    { code: '제주', name: '제주' },
    { code: '경기', name: '경기' },
    { code: '경남', name: '경남' },
    { code: '경북', name: '경북' },
    { code: '전남', name: '전남' },
    { code: '충남', name: '충남' },
    { code: '충북', name: '충북' },
  ],
  noticeTypes: [
    { code: '가정어린이집', name: '가정어린이집' },
    { code: '공공임대', name: '공공임대' },
    { code: '국민임대', name: '국민임대' },
    { code: '분양주택', name: '분양주택' },
    { code: '영구임대', name: '영구임대' },
    { code: '통합공공임대', name: '통합공공임대' },
    { code: '행복주택', name: '행복주택' },
  ],
  noticeStatuses: [
    { code: '공고중', name: '공고중' },
    { code: '접수마감', name: '접수마감' },
    { code: '정정공고중', name: '정정공고중' },
    { code: '접수중', name: '접수중' },
  ],
});

const updateUrl = () => {
  const query = {};

  if (searchQuery.region) query.region = searchQuery.region;
  if (searchQuery.noticeType) query.noticeType = searchQuery.noticeType;
  if (searchQuery.noticeStatus) query.noticeStatus = searchQuery.noticeStatus;
  if (searchQuery.page > 0) query.page = searchQuery.page;
  if (searchQuery.size !== 20) query.size = searchQuery.size;

  router.replace({ query });
};

const getQueryUrl = () => {
  const params = new URLSearchParams();
  params.append('page', searchQuery.page);
  params.append('size', searchQuery.size);

  if (searchQuery.region) params.append('cnpCdNm', searchQuery.region);
  if (searchQuery.noticeType)
    params.append('aisTpCdNm', searchQuery.noticeType);
  if (searchQuery.noticeStatus)
    params.append('panSs', searchQuery.noticeStatus);

  return `/api/api/house?${params.toString()}`;
};

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
  } catch (error) {
    console.error('주택 목록 로드 실패:', error);
    houses.value = [];
    pageInfo.totalCount = 0;
  } finally {
    loading.value = false;
  }
};

const updateSearchQueryFromUrl = () => {
  searchQuery.region = route.query.region || '';
  searchQuery.noticeType = route.query.noticeType || '';
  searchQuery.noticeStatus = route.query.noticeStatus || '';
  searchQuery.page = parseInt(route.query.page) || 0;
  searchQuery.size = parseInt(route.query.size) || 20;
};

const updateFilter = ({ key, value }) => {
  searchQuery[key] = value;
  searchQuery.page = 0;
  updateUrl();
  loadHouses();
};

const clearFilter = (key) => {
  searchQuery[key] = '';
  searchQuery.page = 0;
  updateUrl();
  loadHouses();
};

const clearAllFilters = () => {
  searchQuery.region = '';
  searchQuery.noticeType = '';
  searchQuery.noticeStatus = '';
  searchQuery.page = 0;
  updateUrl();
  loadHouses();
};

const searchHouses = () => {
  searchQuery.page = 0;
  updateUrl();
  loadHouses();
};

const changePage = (newPage) => {
  searchQuery.page = newPage;
  moveMapToHouse(null);
  updateUrl();
  loadHouses();
  window.scrollTo({ top: 200, behavior: 'smooth' });
};

const handleCardClick = (house) => {
  moveMapToHouse(house);
};

const handleToggleFavorite = ({ houseId, isFavorite }) => {
  console.log('찜하기 토글:', houseId, isFavorite);
};

watch(
  () => route.query,
  (newQuery, oldQuery) => {
    if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
      updateSearchQueryFromUrl();
      loadHouses();
    }
  }
);

onMounted(() => {
  loadHouses();
});
</script>

<style scoped>
.house-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 검색 결과 정보 */
.result-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  padding: 16px 0;
}

.result-count {
  font-size: 16px;
  color: #222222;
}

.page-info {
  font-size: 14px;
  color: #717171;
}

.list-map-wrapper {
  display: flex;
  /* flex-wrap 제거 */
  gap: 20px;
}

/* 주택 리스트 */
.house-list {
  flex: 1 1 50%;
  min-width: 300px;
  height: 100vh;
  overflow-y: scroll;
  scrollbar-width: none;
}

/* 주택 그리드 */
.house-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 24px;
  padding: 0;
}

/* 지도 영역 */
.map {
  flex: 1 1 50%;
  min-width: 300px;
  height: 100vh; /* 높이도 리스트와 동일하게 */
  display: flex;
  flex-direction: column;
}

.map-content {
  flex: 1; /* 버튼 아래 공간 모두 차지 */
}

/* 로딩 및 결과 없음 */
.loading,
.no-results {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f0f0f0;
  border-top: 4px solid #ff385c;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.no-results h3 {
  font-size: 18px;
  color: #222222;
  margin: 0 0 8px 0;
}

.no-results p {
  color: #717171;
  margin: 0 0 20px 0;
}

.clear-button {
  background: #ff385c;
  color: white;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-button:hover {
  background: #e31c5f;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .house-container {
    padding: 16px;
  }

  .result-info {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }

  .house-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .house-container {
    padding: 12px;
  }
}

/* 768px 이하에서는 지도 숨기기 */
@media (max-width: 768px) {
  .map {
    display: none;
  }
}

/* Category Button for Map */
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
