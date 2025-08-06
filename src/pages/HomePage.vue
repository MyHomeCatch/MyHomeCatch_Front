<template>
  <div class="house-container">
    <!-- 검색 로직 컴포넌트 (UI 없음, 로직만) -->
    <HouseSearchLogic
      ref="searchLogicRef"
      @houses-loaded="onHousesLoaded"
      @loading-change="onLoadingChange"
      @page-info-change="onPageInfoChange"
    />

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

    <div style="display: flex; margin-top: 40px">
      <!-- 검색 결과 섹션 -->
      <HouseSearchResults
        ref="searchResultsRef"
        :search-query="searchQuery"
        :loading="loading"
        :houses="houses"
        :is-logged-in="auth.$state.isLoggedIn"
        @card-click="handleCardClick"
        @toggle-favorite="handleToggleFavorite"
        @clear-all-filters="clearAllFilters"
        @go-to-search="handleGoToSearch"
      />

      <!-- 지도 섹션 -->
      <HouseMapSection
        ref="mapSectionRef"
        :houses="allHousesForMap"
        :selected-category="selectedCategory"
        @category-change="handleCategoryChange"
      />
    </div>

    <!-- 페이지네이션 -->
    <HousePagination :page-info="pageInfo" @page-change="changePage" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick } from 'vue';
import HouseFilter from '../components/house/HouseFilter.vue';
import HousePagination from '../components/house/HousePagination.vue';
import HouseSearchResults from '../components/house/HouseSearchResults.vue';
import HouseMapSection from '../components/house/HouseMapSection.vue';
import HouseSearchLogic from '../components/house/HouseSearchLogic.vue';
import { useAuthStore } from '../stores/auth';

// Auth
const auth = useAuthStore();

// Refs
const searchLogicRef = ref(null);
const searchResultsRef = ref(null);
const mapSectionRef = ref(null);
const selectedCategory = ref('');

// State
const loading = ref(false);
const houses = ref([]);
const pageInfo = ref({
  currentPage: 0,
  endItem: 0,
  first: true,
  hasNext: false,
  hasPrevious: false,
  last: false,
  size: 15,
  startItem: 1,
  totalCount: 0,
  totalPages: 0,
});
const searchQuery = ref({
  region: [],
  noticeType: [],
  noticeStatus: [],
  page: 0,
  size: 20,
});
const filterOptions = ref({
  regions: [],
  noticeTypes: [],
  noticeStatuses: [],
});

// 지도에 표시할 모든 주택 (추천 + 검색 결과)
const allHousesForMap = computed(() => {
  const searchHouses = houses.value || [];
  const recommendedHousesData = searchResultsRef.value?.recommendedHouses || [];

  // 중복 제거를 위해 danziId로 필터링
  const seenIds = new Set();
  const combined = [...recommendedHousesData, ...searchHouses];

  return combined.filter((house) => {
    if (!house.danziId || seenIds.has(house.danziId)) {
      return false;
    }
    seenIds.add(house.danziId);
    return true;
  });
});

// Event handlers from search logic
const onHousesLoaded = (newHouses) => {
  houses.value = newHouses;
};

const onLoadingChange = (newLoading) => {
  loading.value = newLoading;
};

const onPageInfoChange = (newPageInfo) => {
  pageInfo.value = newPageInfo;
};

// Methods - delegate to search logic
const updateFilter = (payload) => {
  if (searchLogicRef.value) {
    searchLogicRef.value.updateFilter(payload);
  }
};

const clearFilter = (key) => {
  if (searchLogicRef.value) {
    searchLogicRef.value.clearFilter(key);
  }
};

const clearAllFilters = () => {
  if (searchLogicRef.value) {
    searchLogicRef.value.clearAllFilters();
  }
};

const searchHouses = () => {
  if (searchLogicRef.value) {
    searchLogicRef.value.searchHouses();
  }
};

const changePage = (newPage) => {
  if (mapSectionRef.value) {
    mapSectionRef.value.moveMapToHouse(null);
  }
  if (searchLogicRef.value) {
    searchLogicRef.value.changePage(newPage);
  }
};

// UI event handlers
const handleCardClick = (house) => {
  if (mapSectionRef.value) {
    mapSectionRef.value.moveMapToHouse(house);
  }
};

const handleToggleFavorite = ({ houseId, isFavorite }) => {
  console.log('찜하기 토글:', houseId, isFavorite);
};

const handleCategoryChange = (category) => {
  selectedCategory.value = selectedCategory.value === category ? '' : category;
};

const handleGoToSearch = (query) => {
  if (query.aisTpCdNm && searchLogicRef.value) {
    const newNoticeType = Array.isArray(query.aisTpCdNm)
      ? query.aisTpCdNm
      : [query.aisTpCdNm];
    searchLogicRef.value.updateFilter({
      key: 'noticeType',
      value: newNoticeType,
    });
  }
};

// 컴포넌트 마운트 시 실행
onMounted(async () => {
  try {
    // 먼저 searchQuery와 filterOptions를 동기적으로 설정
    if (searchLogicRef.value) {
      searchQuery.value = searchLogicRef.value.searchQuery;
      filterOptions.value = searchLogicRef.value.filterOptions;
      pageInfo.value = searchLogicRef.value.pageInfo;
    }

    // 다음 틱에서 데이터 로드
    await nextTick();

    if (searchLogicRef.value) {
      await searchLogicRef.value.loadHouses();
    }

    // 추천 데이터 로드
    if (auth.$state.isLoggedIn && searchResultsRef.value) {
      await searchResultsRef.value.loadRecommendedHouses();
    }
  } catch (error) {
    console.error('HouseList 마운트 오류:', error);
  }
});
</script>

<style scoped>
.house-container {
  max-width: 1440px;
  margin: 0 auto;
  padding: 24px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

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

@media (max-width: 768px) {
  .house-container {
    padding: 16px;
  }

  .result-info {
    flex-direction: column;
    gap: 8px;
    align-items: flex-start;
  }
}

@media (max-width: 480px) {
  .house-container {
    padding: 12px;
  }
}
</style>
