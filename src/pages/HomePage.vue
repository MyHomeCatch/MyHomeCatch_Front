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

    <!-- 주택 목록 -->
    <div v-if="!loading && houses.length > 0" class="house-grid">
      <HouseCard
        v-for="house in houses"
        :key="house.houseId"
        :house="house"
        @card-click="handleCardClick"
        @toggle-favorite="handleToggleFavorite"
      />
    </div>

    <!-- 페이지네이션 -->
    <HousePagination :page-info="pageInfo" @page-change="changePage" />

    <!-- 로딩 표시 -->
    <div v-if="loading" class="loading">
      <div class="loading-spinner"></div>
      <p>주택 정보를 불러오는 중...</p>
    </div>

    <!-- 결과 없음 -->
    <div v-if="!loading && houses.length === 0" class="no-results">
      <div class="no-results-icon">🏠</div>
      <h3>검색 결과가 없습니다</h3>
      <p>다른 조건으로 검색해보세요.</p>
      <button @click="clearAllFilters" class="clear-button">필터 초기화</button>
    </div>

    <div style="display: flex; width: 100%; height: 100vh">
      <div style="flex: 1; padding: 20px; overflow-y: auto">
        <h1>LH 주택 단지 검색</h1>
        <div>
          <input
            type="text"
            v-model="basicAddressInput"
            placeholder="기본 주소 (예: 경기도 양주시 덕계동)"
            @keyup.enter="searchBasicAddress"
            style="width: 70%; padding: 8px; margin-right: 5px"
          />
          <button @click="searchBasicAddress" style="padding: 8px 15px">
            검색
          </button>
        </div>

        <div
          v-if="filteredComplexes.length > 0"
          style="
            margin-top: 20px;
            max-height: 400px;
            overflow-y: auto;
            border: 1px solid #eee;
            padding: 10px;
          "
        >
          <h3>검색 결과 ({{ filteredComplexes.length }}개)</h3>
          <ul style="list-style: none; padding: 0">
            <li
              v-for="complex in filteredComplexes"
              :key="complex.id"
              @click="moveMapToComplex(complex)"
              style="
                padding: 8px;
                border-bottom: 1px solid #eee;
                cursor: pointer;
                transition: background-color 0.2s;
              "
              @mouseover="
                (event) => (event.target.style.backgroundColor = '#f0f0f0')
              "
              @mouseout="
                (event) => (event.target.style.backgroundColor = 'white')
              "
            >
              <strong>{{ complex.complexName }}</strong
              ><br />
              <small
                >{{ complex.lct_ara_adr }} {{ complex.lct_ara_dtl_adr }}</small
              >
            </li>
          </ul>
        </div>
        <div v-else-if="basicAddressInput.length > 0" style="margin-top: 20px">
          <p>검색 결과가 없습니다.</p>
        </div>
      </div>
      <div style="flex: 1; height: 100%">
        <KakaoMapViewer ref="mapViewerRef" :lhComplexes="filteredComplexes" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue';
import axios from 'axios';
import HouseFilter from '../components/house/HouseFilter.vue';
import HouseCard from '../components/house/HouseCard.vue';
import HousePagination from '../components/house/HousePagination.vue';

import { ref, computed } from 'vue';
import KakaoMapViewer from '@/components/KakaoMapViewer.vue';

const basicAddressInput = ref('');
const filteredComplexes = computed(() => {
  if (!basicAddressInput.value) {
    return [];
  }
  const searchTerm = basicAddressInput.value.trim();
  return lhHousingData.value.filter((complex) =>
    complex.lct_ara_adr.includes(searchTerm)
  );
});

const mapViewerRef = ref(null); // KakaoMapViewer 컴포넌트의 ref

const searchBasicAddress = () => {
  if (filteredComplexes.value.length > 0) {
    // 필터링된 첫 번째 단지의 상세 주소로 지도 이동 및 주변 시설 검색 요청
    mapViewerRef.value.updateMapWithComplex(filteredComplexes.value[0]);
  } else {
    alert('해당 기본 주소에 대한 단지 정보가 없습니다.');
  }
};

const moveMapToComplex = (complex) => {
  mapViewerRef.value.updateMapWithComplex(complex);
};

// State
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
  region: '',
  noticeType: '',
  noticeStatus: '',
  page: 0,
  size: 20,
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

// API URL 생성
const getQueryUrl = () => {
  const params = new URLSearchParams();
  params.append('page', searchQuery.page);
  params.append('size', searchQuery.size);

  if (searchQuery.region) params.append('cnpCdNm', searchQuery.region);
  if (searchQuery.noticeType)
    params.append('aisTpCdNm', searchQuery.noticeType);
  if (searchQuery.noticeStatus)
    params.append('panSs', searchQuery.noticeStatus);

  return `/api/house?${params.toString()}`;
};

// 주택 목록 로드
const loadHouses = async () => {
  loading.value = true;
  try {
    const { data } = await axios.get(getQueryUrl());

    // 응답 데이터 구조에 맞게 처리
    if (data.houses) {
      houses.value = data.houses;
      Object.assign(pageInfo, data.pageInfo);
    } else if (data.housingList) {
      houses.value = data.housingList;
      Object.assign(pageInfo, data.pageInfo);
    } else {
      // 단순 배열인 경우
      houses.value = Array.isArray(data) ? data : [];
      pageInfo.totalCount = houses.value.length;
    }

    console.log('Loaded houses:', houses.value);
  } catch (error) {
    console.error('주택 목록 로드 실패:', error);
    houses.value = [];
    pageInfo.totalCount = 0;
  } finally {
    loading.value = false;
  }
};

// 필터 이벤트 핸들러
const updateFilter = ({ key, value }) => {
  searchQuery[key] = value;
  searchQuery.page = 0; // 첫 페이지로 리셋
  loadHouses();
};

const clearFilter = (key) => {
  searchQuery[key] = '';
  searchQuery.page = 0;
  loadHouses();
};

const clearAllFilters = () => {
  searchQuery.region = '';
  searchQuery.noticeType = '';
  searchQuery.noticeStatus = '';
  searchQuery.page = 0;
  loadHouses();
};

const searchHouses = () => {
  searchQuery.page = 0;
  loadHouses();
};

// 페이지네이션 이벤트 핸들러
const changePage = (newPage) => {
  searchQuery.page = newPage;
  loadHouses();
  // 페이지 이동 시 맨 위로 스크롤
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// 카드 이벤트 핸들러
const handleCardClick = (house) => {
  console.log('카드 클릭:', house);
  // 라우터로 상세 페이지 이동
  // router.push(`/house/${house.houseId}`);
};

const handleToggleFavorite = ({ houseId, isFavorite }) => {
  console.log('찜하기 토글:', houseId, isFavorite);
  // 찜하기 API 호출 또는 로컬 저장소에 저장
  // try {
  //   await axios.post('/api/favorites', { houseId, isFavorite });
  // } catch (error) {
  //   console.error('찜하기 처리 실패:', error);
  // }
};

// 컴포넌트 마운트 시 실행
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

/* 주택 그리드 */
.house-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 24px;
  padding: 0;
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
</style>
