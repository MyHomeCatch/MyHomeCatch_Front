<template>
  <!-- 이 컴포넌트는 로직만 담당하므로 UI는 없음 -->
  <div></div>
</template>

<script setup>
import { reactive, ref, watch, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import axios from 'axios';

// Props
const props = defineProps({
  initialQuery: {
    type: Object,
    default: () => ({}),
  },
});

// Emits
const emit = defineEmits([
  'houses-loaded',
  'loading-change',
  'page-info-change',
]);

// Router
const router = useRouter();
const route = useRoute();

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
  size: 15,
  startItem: 1,
  totalCount: 0,
  totalPages: 0,
});

// 필터 옵션 설정
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

// URL 쿼리에서 초기값 설정 (다중 선택 지원)
const parseQueryArray = (value) => {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
};

const searchQuery = reactive({
  region: parseQueryArray(route.query.region),
  noticeType: parseQueryArray(route.query.noticeType),
  noticeStatus: parseQueryArray(route.query.noticeStatus),
  page: parseInt(route.query.page) || 0,
  size: parseInt(route.query.size) || 20,
});

// URL 업데이트 함수 (다중 값 지원)
const updateUrl = () => {
  const query = {};

  if (searchQuery.region.length > 0) {
    query.region =
      searchQuery.region.length === 1
        ? searchQuery.region[0]
        : searchQuery.region;
  }
  if (searchQuery.noticeType.length > 0) {
    query.noticeType =
      searchQuery.noticeType.length === 1
        ? searchQuery.noticeType[0]
        : searchQuery.noticeType;
  }
  if (searchQuery.noticeStatus.length > 0) {
    query.noticeStatus =
      searchQuery.noticeStatus.length === 1
        ? searchQuery.noticeStatus[0]
        : searchQuery.noticeStatus;
  }
  if (searchQuery.page > 0) query.page = searchQuery.page;
  if (searchQuery.size !== 20) query.size = searchQuery.size;

  router.replace({ query });
};

// API URL 생성 (다중 파라미터 지원)
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
  emit('loading-change', true);

  try {
    const { data } = await axios.get(getQueryUrl());

    if (data.housingList) {
      houses.value = data.housingList;
      Object.assign(pageInfo, data.pageInfo);
    } else {
      houses.value = Array.isArray(data) ? data : [];
      pageInfo.totalCount = houses.value.length;
    }

    emit('houses-loaded', houses.value);
    emit('page-info-change', pageInfo);
  } catch (error) {
    console.error('주택 목록 로드 실패:', error);
    houses.value = [];
    pageInfo.totalCount = 0;
    emit('houses-loaded', []);
    emit('page-info-change', pageInfo);
  } finally {
    loading.value = false;
    emit('loading-change', false);
  }
};

// URL 쿼리에서 searchQuery 업데이트
const updateSearchQueryFromUrl = () => {
  searchQuery.region = parseQueryArray(route.query.region);
  searchQuery.noticeType = parseQueryArray(route.query.noticeType);
  searchQuery.noticeStatus = parseQueryArray(route.query.noticeStatus);
  searchQuery.page = parseInt(route.query.page) || 0;
  searchQuery.size = parseInt(route.query.size) || 20;
};

// 필터 이벤트 핸들러
const updateFilter = ({ key, value }) => {
  searchQuery[key] = value;
  searchQuery.page = 0;
  updateUrl();
  loadHouses();
};

const clearFilter = (key) => {
  searchQuery[key] = [];
  searchQuery.page = 0;
  updateUrl();
  loadHouses();
};

const clearAllFilters = () => {
  searchQuery.region = [];
  searchQuery.noticeType = [];
  searchQuery.noticeStatus = [];
  searchQuery.page = 0;
  updateUrl();
  loadHouses();
};

const searchHouses = () => {
  searchQuery.page = 0;
  updateUrl();
  loadHouses();
};

// 페이지네이션 이벤트 핸들러
const changePage = (newPage) => {
  searchQuery.page = newPage;
  updateUrl();
  loadHouses();
  window.scrollTo({ top: 200, behavior: 'smooth' });
};

// URL 변경 감지 (뒤로가기/앞으로가기 대응)
watch(
  () => route.query,
  (newQuery, oldQuery) => {
    if (JSON.stringify(newQuery) !== JSON.stringify(oldQuery)) {
      updateSearchQueryFromUrl();
      loadHouses();
    }
  }
);

// Expose methods and data to parent
defineExpose({
  searchQuery,
  filterOptions,
  pageInfo,
  loading,
  houses,
  loadHouses,
  updateFilter,
  clearFilter,
  clearAllFilters,
  searchHouses,
  changePage,
  updateSearchQueryFromUrl,
});

// 컴포넌트가 마운트되면 즉시 초기화
onMounted(() => {
  // 초기 URL 쿼리 파싱
  updateSearchQueryFromUrl();
});
</script>
