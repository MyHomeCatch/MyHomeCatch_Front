<template>
  <div class="search-results-section">
    <!-- 추천 주택 목록 -->
    <HorizontalCardScroller
      v-if="isLoggedIn"
      :title="'지원 가능한 맞춤공고'"
      :cards="houses"
      :loading="loading"
      :key-field="'houseId'"
      :favorite-list="favoriteList"
      :empty-config="emptyConfig"
      @card-click="$emit('card-click', $event)"
      @toggle-favorite="handleToggleFavorite"
      @empty-action="$emit('refresh')"
    />
    <div v-else>📋 자가진단을 통해 지원가능한 공고를 확인해 보세요!</div>

    <h2 class="search-title">검색한 공고</h2>

    <div v-if="!loading && houses.length > 0" class="house-grid">
      <HouseCard
        v-for="house in houses"
        :key="house.houseId"
        :house="house"
        :favorite-list="favoriteList"
        @card-click="$emit('card-click', $event)"
        @toggle-favorite="handleToggleFavorite"
      />
    </div>

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
      <button @click="$emit('clear-all-filters')" class="clear-button">
        필터 초기화
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';
import HouseCard from './HouseCard.vue';
import user from '../../api/user.js';
import HorizontalCardScroller from './HorizontalCardScroller.vue';

// Props
const props = defineProps({
  searchQuery: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    default: false,
  },
  houses: {
    type: Array,
    default: () => [],
  },
  isLoggedIn: {
    type: Boolean,
    default: false,
  },
  favoriteList: {
    type: Array,
    default: () => [],
  },
});

const emptyConfig = {
  icon: '🔍',
  title: '추천할 주택이 없습니다',
  description:
    '현재 회원님의 조건에 맞는 주택이 없어요.<br />조건을 조정하시거나 나중에 다시 확인해보세요.',
  showButton: true,
  buttonText: '다시 찾아보기',
};

// Emits
const emit = defineEmits([
  'card-click',
  'toggle-favorite',
  'clear-all-filters',
  'go-to-search',
]);

// Router
const router = useRouter();
const route = useRoute();

// 추천 주택 관련 상태
const recommendedHouses = ref([]);
const recommendedLoading = ref(false);
const userPreferences = ref([]);

// favoriteList가 변경될 때마다 자식 컴포넌트들을 강제 리렌더링하기 위한 키
// const favoriteListKey = computed(() => {
//   return props.favoriteList?.length || 0;
// });

const recommendationQuery = computed(() => ({
  aisTpCdNm: userPreferences.value,
}));

// 즐겨찾기 토글 핸들러 - 이벤트를 부모로 전달하면서 로그 추가
const handleToggleFavorite = (data) => {
  emit('toggle-favorite', data);
};

// 추천 주택 관련 메소드
const prefMapper = (pref) => {
  if (pref == '공공분양') return '분양주택';
  return pref;
};

const loadUserPreference = async () => {
  try {
    const pref = await user.getSupportableList();
    const userInfo = await user.getUserInfo();
    const supplyTypes = pref.map((p) => p.split(' ')[0]).map(prefMapper);
    userPreferences.value = supplyTypes;
    return supplyTypes;
  } catch (error) {
    console.error('사용자 선호도 로드 실패:', error);
    return [];
  }
};

const getRecommendedQueryUrl = (maxItems = 10) => {
  const params = new URLSearchParams();
  params.append('page', '0');
  params.append('size', maxItems.toString());

  // 사용자 선호 공급유형을 필터로 추가 (공고유형은 필터값 사용 안함)
  userPreferences.value.forEach((type) => {
    params.append('aisTpCdNm', type);
  });

  // 지역 필터 적용 (필터에서 선택된 지역들)
  if (props.searchQuery.region && props.searchQuery.region.length > 0) {
    props.searchQuery.region.forEach((region) => {
      if (region) params.append('cnpCdNm', region);
    });
  }

  // 공고상태 필터 적용 (필터에서 선택된 상태들, 기본값 포함)
  if (
    props.searchQuery.noticeStatus &&
    props.searchQuery.noticeStatus.length > 0
  ) {
    props.searchQuery.noticeStatus.forEach((status) => {
      if (status) params.append('panSs', status);
    });
  } else {
    // 공고상태가 선택되지 않았으면 기본값 사용
    params.append('panSs', '공고중');
    params.append('panSs', '접수중');
  }

  return `/api/api/house?${params.toString()}`;
};

const loadRecommendedHouses = async () => {
  if (!props.isLoggedIn) {
    recommendedHouses.value = [];
    recommendedLoading.value = false;
    return;
  }

  recommendedLoading.value = true;

  try {
    const preferences = await loadUserPreference();

    if (!preferences || preferences.length === 0) {
      recommendedHouses.value = [];
      return;
    }

    const response = await axios.get(getRecommendedQueryUrl(10));

    const data = response?.data;

    if (data && data.housingList && Array.isArray(data.housingList)) {
      recommendedHouses.value = data.housingList;
    } else if (Array.isArray(data)) {
      recommendedHouses.value = data;
    } else {
      recommendedHouses.value = [];
    }
  } catch (error) {
    console.error('추천 주택 목록 로드 실패:', error);
    recommendedHouses.value = [];
  } finally {
    recommendedLoading.value = false;
  }
};

// 로그인 상태 변경 감지
watch(
  () => props.isLoggedIn,
  async (newVal) => {
    try {
      if (newVal) {
        await loadRecommendedHouses();
      } else {
        recommendedHouses.value = [];
      }
    } catch (error) {
      console.error('로그인 상태 변경 후 추천 로드 오류:', error);
    }
  }
);

// searchQuery 변경 감지하여 추천 주택 자동 업데이트
watch(
  () => [props.searchQuery.region, props.searchQuery.noticeStatus],
  async () => {
    if (props.isLoggedIn) {
      await loadRecommendedHouses();
    }
  },
  { deep: true }
);

// Expose for parent
defineExpose({
  loadRecommendedHouses,
  recommendedHouses,
  recommendedLoading,
  recommendationQuery,
});

// 컴포넌트 마운트 시 초기화
onMounted(async () => {
  if (props.isLoggedIn) {
    await loadRecommendedHouses();
  }
});
</script>

<style scoped>
.search-results-section {
  min-width: 60%;
  margin-right: 20px;
  height: 100vh;
  overflow-y: scroll;
  scrollbar-width: none;
}

.search-results-section::-webkit-scrollbar {
  display: none;
}

.search-title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  color: #234123;
  padding: 40px 0 20px 0;
}

.house-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(210px, 1fr));
  gap: 24px;
  padding: 0;
}

.loading,
.no-results {
  text-align: center;
  padding: 50px 20px;
  background: #fffdfa;
  border-radius: 16px;
  margin: 20px 0;
  border: 1px solid #eaf5e6;
  box-shadow: 0 4px 6px -1px rgba(166, 191, 160, 0.1);
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #eaf5e6;
  border-top: 4px solid #a6bfa0;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
  box-shadow: 0 2px 8px rgba(166, 191, 160, 0.2);
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading p {
  color: #4d6b4d;
  font-size: 16px;
  font-weight: 500;
  margin: 0;
}

.no-results-icon {
  font-size: 48px;
  margin-bottom: 16px;
  display: block;
  filter: grayscale(0.3);
}

.no-results h3 {
  font-size: 18px;
  color: #234123;
  margin: 0 0 8px 0;
  font-weight: 600;
}

.no-results p {
  color: #7fa87f;
  margin: 0 0 20px 0;
  font-size: 14px;
  line-height: 1.4;
}

.clear-button {
  background: linear-gradient(135deg, #a6bfa0 0%, #8baa7f 100%);
  color: white;
  border: none;
  padding: 14px 28px;
  border-radius: 12px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(166, 191, 160, 0.3);
  display: inline-flex;
  align-items: center;
  gap: 8px;
}

.clear-button:hover {
  background: linear-gradient(135deg, #8baa7f 0%, #7fa87f 100%);
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(166, 191, 160, 0.4);
}

.clear-button:active {
  transform: translateY(0);
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .search-results-section {
    min-width: 50%;
    margin-right: 16px;
  }

  .house-grid {
    grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
    gap: 20px;
  }

  .loading,
  .no-results {
    padding: 40px 16px;
  }
}

@media (max-width: 768px) {
  .search-results-section {
    min-width: 100%;
    margin-right: 0;
    height: auto;
    overflow-y: visible;
  }

  .search-title {
    font-size: 18px;
    padding: 30px 0 16px 0;
  }

  .house-grid {
    grid-template-columns: 1fr;
    gap: 16px;
  }

  .loading,
  .no-results {
    padding: 35px 16px;
    margin: 16px 0;
  }

  .loading-spinner {
    width: 40px;
    height: 40px;
    margin-bottom: 12px;
  }

  .loading p {
    font-size: 14px;
  }

  .no-results-icon {
    font-size: 40px;
    margin-bottom: 12px;
  }

  .no-results h3 {
    font-size: 16px;
  }

  .no-results p {
    font-size: 13px;
    margin-bottom: 16px;
  }

  .clear-button {
    padding: 12px 24px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .search-title {
    font-size: 16px;
    padding: 24px 0 12px 0;
  }

  .loading,
  .no-results {
    padding: 30px 12px;
    border-radius: 12px;
  }

  .loading-spinner {
    width: 36px;
    height: 36px;
    margin-bottom: 10px;
  }

  .loading p {
    font-size: 13px;
  }

  .no-results-icon {
    font-size: 36px;
    margin-bottom: 10px;
  }

  .no-results h3 {
    font-size: 15px;
  }

  .no-results p {
    font-size: 12px;
    margin-bottom: 14px;
  }

  .clear-button {
    padding: 10px 20px;
    font-size: 13px;
    border-radius: 10px;
  }
}
</style>
