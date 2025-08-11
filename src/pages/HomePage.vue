<template>
  <div class="house-container">
    <!-- mini user info -->
    <div class="mini-user-info-container">
      <MiniUserInfo v-if="isMiniUserInfoVisible" />
      <button
        @click="isMiniUserInfoVisible = !isMiniUserInfoVisible"
        class="toggle-button"
      >
        {{ isMiniUserInfoVisible ? '접기' : '펼치기' }}
      </button>
    </div>

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
        :favorite-list="favoriteList"
        @card-click="handleCardClick"
        @toggle-favorite="handleToggleFavorite"
        @clear-all-filters="clearAllFilters"
        @go-to-search="handleGoToSearch"
      />

      <!-- 지도 섹션 -->
      <!-- <HouseMapSection
        ref="mapSectionRef"
        :houses="allHousesForMap"
        :selected-category="selectedCategory"
        @category-change="handleCategoryChange"
      /> -->
    </div>

    <!-- 페이지네이션 -->
    <HousePagination :page-info="pageInfo" @page-change="changePage" />

    <!-- ChatBot -->
    <ChatBot></ChatBot>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import HouseFilter from '../components/house/HouseFilter.vue';
import HousePagination from '../components/house/HousePagination.vue';

import KakaoMapViewer from '@/components/KakaoMapViewer.vue';
import ChatBot from '../AI/ChatBot.vue';

import HouseSearchResults from '../components/house/HouseSearchResults.vue';
import HouseMapSection from '../components/house/HouseMapSection.vue';
import HouseSearchLogic from '../components/house/HouseSearchLogic.vue';
import { useAuthStore } from '../stores/auth';
import { getBookmarks } from '../api/bookmardApi';
import MiniUserInfo from '../components/homeUserInfo/miniUserInfo.vue';

const isMiniUserInfoVisible = ref(true);

const router = useRouter();
const route = useRoute();
const mapViewerRef = ref(null);

// Auth
const auth = useAuthStore();

// Refs
const searchLogicRef = ref(null);
const searchResultsRef = ref(null);
const mapSectionRef = ref(null);

const selectedCategory = ref('');

const loading = ref(false);
const houses = ref([]);
const favoriteList = ref([]); // 즐겨찾기 목록 추가
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

// 즐겨찾기 관련 메소드
const loadFavorites = async () => {
  if (!auth.isLoggedIn) {
    favoriteList.value = [];
    return;
  }

  try {
    const response = await getBookmarks(auth.token);
    favoriteList.value = response.bookmarks || [];
    console.log('즐겨찾기 목록 로드 완료:', favoriteList.value.length); // 디버깅용
  } catch (error) {
    console.error('즐겨찾기 목록 로드 실패:', error);
    favoriteList.value = [];
  }
};

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

// 즐겨찾기 토글 핸들러 개선
const handleToggleFavorite = async (data) => {
  if (data.action === 'add') {
    // 이미 존재하는지 확인 후 추가
    const exists = favoriteList.value.find(
      (fav) => fav.danziId === data.danziId
    );

    if (!exists) {
      const newFavorite = {
        danziId: data.danziId,
        userId: auth.user.id,
        // 추가 필요한 필드들도 여기에 포함
      };
      // 새로운 배열 생성으로 반응성 트리거
      favoriteList.value = [...favoriteList.value, newFavorite];
    }
  } else if (data.action === 'remove') {
    // 배열에서 제거
    const filteredList = favoriteList.value.filter(
      (fav) => fav.danziId !== data.danziId
    );
    // 새로운 배열 할당으로 반응성 트리거
    favoriteList.value = [...filteredList];
  }

  // Vue의 반응성 시스템을 강제로 트리거
  await nextTick();
};

const handleCategoryChange = (category) => {
  selectedCategory.value = selectedCategory.value === category ? '' : category;
};

const handleGoToSearch = (query) => {
  if (searchLogicRef.value && query.aisTpCdNm) {
    const newNoticeType = Array.isArray(query.aisTpCdNm)
      ? query.aisTpCdNm
      : [query.aisTpCdNm];
    searchLogicRef.value.updateFilter({
      key: 'noticeType',
      value: newNoticeType,
    });
  }
};

// 로그인 상태 변화 감지하여 즐겨찾기 목록 재로드
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
    // 먼저 searchQuery와 filterOptions를 동기적으로 설정
    if (searchLogicRef.value) {
      searchQuery.value = searchLogicRef.value.searchQuery;
      filterOptions.value = searchLogicRef.value.filterOptions;
      pageInfo.value = searchLogicRef.value.pageInfo;
    }

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

// 즐겨찾기 목록 새로고침 메소드 (필요한 경우 외부에서 호출)
const refreshFavorites = async () => {
  await loadFavorites();
};

// 외부에서 접근 가능하도록 expose
defineExpose({
  refreshFavorites,
  loadFavorites,
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

.mini-user-info-container {
  position: relative;
  padding-bottom: 40px; /* space for the button */
  margin-bottom: 1rem;
  border-bottom: 1px solid #eee;
}

.toggle-button {
  position: absolute;
  bottom: 5px;
  right: 0;
  padding: 5px 15px;
  border: 1px solid #ccc;
  border-radius: 20px;
  background-color: #f8f8f8;
  cursor: pointer;
  font-size: 12px;
}

.toggle-button:hover {
  background-color: #eee;
}
</style>
