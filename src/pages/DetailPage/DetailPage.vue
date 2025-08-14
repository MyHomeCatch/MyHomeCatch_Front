<template>
  <div v-if="loading" class="container py-5 text-center">
    <div class="spinner-border" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>

  <div v-else-if="error" class="container py-5 text-center">
    <div class="alert alert-danger" role="alert">
      {{ error }}
    </div>
  </div>

  <template v-else-if="houseData && houseData.danzi">
    <main class="container py-4">
      <div class="d-flex justify-content-between align-items-start position-relative mb-4">
        <div>
          <h1 class="h3 fw-bold text-dark">{{ houseData.danzi.bzdtNm }}</h1>
          <p class="text-muted mt-1">
            {{ houseData.danzi.lctAraAdr }} {{ houseData.danzi.lctAraDtlAdr }}
          </p>
        </div>
        <button
          id="likeButton"
          class="like-btn btn d-flex align-items-center px-3 py-1 gap-2"
          :class="{ liked: isLiked, 'not-liked': !isLiked }"
          @click="toggleLike"
        >
          <span id="likeText">{{ isLiked ? '즐겨찾기 추가완료' : '즐겨찾기 추가' }}</span>
        </button>
      </div>
    </main>

    <div v-if="selfCheckMatchResult" class="container">
      <div class="text-center" role="alert">
        {{ authStore.user.nickname }} 님은 현재 이 공고에
        <span class="fw-bold"> {{ selfCheckMatchResult }} </span>한 것으로 확인됩니다.
      </div>
    </div>

    <div class="custom-layout">
      <div class="custom-left">
        <div class="section-title">📍 단지 위치 및 인프라 정보</div>
        <DetailMap v-if="houseCard" :houses="[houseCard]" :selectedCategory="selectedCategory" />
      </div>

      <div class="custom-right">
        <div class="section-title">🏠 공급 정보</div>
        <InfoPanel
          :danzi-info="houseData.danzi"
          :apply-info="houseData.applies"
          :notices="houseData.notices"
          :bookmark-count="bookmarkCount"
        />
      </div>
    </div>

    <section class="container image-section-wrapper mb-4">
      <div class="section-title">🏘️ 단지 이미지</div>
      <ImageSection :images="images" />
    </section>

    <Comments v-if="houseData.danzi.danziId" :danziId="houseData.danzi.danziId" />
  </template>

  <!-- ✅ 폴백: 빈 화면 방지 + 응답 구조 확인 -->
  <div v-else class="container py-5">
    <div class="alert alert-warning">표시할 단지 정보가 없습니다. (houseData에 danzi가 없음)</div>
    <pre class="bg-light p-3 rounded small" style="white-space:pre-wrap;">{{ pretty(houseData) }}</pre>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  getHouseCardById,
  getHouseDetailById,
  getBookmarksByHouseId,
  getHouseDetailByIdWithSelfCheck,
  getDynamicSummary,
} from '@/api/detailPageApi';
import ImageSection from '@/components/DetailPage/ImageSection.vue';
import InfoPanel from '../../components/DetailPage/InfoPanel.vue';
import Comments from '@/components/DetailPage/Comments.vue';
import DetailMap from '@/components/DetailPage/DetailMap.vue';
import { useAuthStore } from '@/stores/auth.js';
import selfCheckAPI from '@/api/selfCheck.js';
import bookmarkApi from '@/api/bookmarkApi.js';

const route = useRoute();
const houseData = ref(null);
const loading = ref(true);
const error = ref(null);
const summaryError = ref('');
const houseCard = ref(null);
const selectedCategory = ref('');
const authStore = useAuthStore();
const isLiked = ref(false);
const selfCheckMatchResult = ref(null);
const bookmarkCount = ref(0);

// 보기 좋게 출력
const pretty = (v) => (v ? JSON.stringify(v, null, 2) : 'null');

// 이미지 URL 배열
const images = computed(() => {
  if (houseData.value?.attachments) {
    return houseData.value.attachments.map((att) => att.downloadUrl);
  }
  return [];
});

// 서버 응답 정규화: 키 이름/구조 변화에도 최소 렌더 보장
function normalizeHouseDetail(raw) {
  if (!raw || typeof raw !== 'object') return null;

  console.log('🔍 normalizeHouseDetail - raw data:', raw);

  const danzi =
    raw.danzi ??
    raw.danziDto ??
    raw.house ??
    raw.houseDto ??
    null;

  const notices = raw.notices ?? raw.noticeList ?? raw.notice ?? [];
  const attachments = raw.attachments ?? raw.danziAtt ?? raw.images ?? raw.att ?? [];
  const applies = raw.applies ?? raw.applyInfo ?? raw.apply ?? [];

  const normalized = { ...raw, danzi, notices, attachments, applies };
  
  console.log('🔍 normalizeHouseDetail - normalized data:', normalized);
  console.log('🔍 danzi:', danzi);
  console.log('🔍 notices:', notices);
  console.log('🔍 attachments:', attachments);
  console.log('🔍 applies:', applies);
  
  return normalized;
}

// 공고 요약 (기존 로직 유지; 필요 시 사용)
const summaryMarkdown = ref('');
const showSummary = ref(false);
const loadingSummary = ref(false);

const loadSummaryMarkdownWithParams = async (danziId, pdfUrl) => {
  try {
    loadingSummary.value = true;
    summaryError.value = '';
    const res = await getDynamicSummary(danziId, pdfUrl);
    summaryMarkdown.value = res.data || '';
  } catch (err) {
    console.error('📄 요약 불러오기 실패:', err);
    summaryError.value = '요약 데이터를 불러올 수 없습니다.';
  } finally {
    loadingSummary.value = false;
  }
};

const handleShowSummaryClick = async () => {
  showSummary.value = true;
  loadingSummary.value = true;
  summaryError.value = '';
  summaryMarkdown.value = '';

  const danziId = route.params.id;
  
  // PDF URL을 찾는 로직 개선
  console.log('🔍 houseData.value:', houseData.value);
  console.log('🔍 notices:', houseData.value?.notices);
  
  let pdfUrl = null;
  
  // 다양한 경로에서 PDF URL 찾기
  if (houseData.value?.notices?.[0]?.noticeAttachments?.[0]?.ahflUrl) {
    pdfUrl = houseData.value.notices[0].noticeAttachments[0].ahflUrl;
  } else if (houseData.value?.notices?.[0]?.attachments?.[0]?.ahflUrl) {
    pdfUrl = houseData.value.notices[0].attachments[0].ahflUrl;
  } else if (houseData.value?.notices?.[0]?.ahflUrl) {
    pdfUrl = houseData.value.notices[0].ahflUrl;
  } else if (houseData.value?.attachments?.[0]?.ahflUrl) {
    pdfUrl = houseData.value.attachments[0].ahflUrl;
  }
  
  console.log('🔍 found pdfUrl:', pdfUrl);

  if (!pdfUrl) {
    summaryError.value = '공고 PDF를 찾을 수 없습니다. 공고 정보를 확인해주세요.';
    console.error('❌ PDF URL not found in data structure');
    loadingSummary.value = false;
    return;
  }
  
  await loadSummaryMarkdownWithParams(danziId, pdfUrl);
};

onMounted(async () => {
  const danziId = route.params.id;
  if (!danziId) {
    error.value = '잘못된 접근입니다. 주택 ID가 없습니다.';
    loading.value = false;
    return;
  }

  try {
    loading.value = true;

    await loadHouseDetail();

    const houseCardPromise = getHouseCardById(danziId);
    const bookmarkPromise = getBookmarksByHouseId(danziId).catch((err) => {
      console.error('북마크 정보 로드 실패:', err);
      return { data: 0 };
    });

    const [houseCardResponse, bookmarkResponse] = await Promise.all([
      houseCardPromise,
      bookmarkPromise,
    ]);

    houseCard.value = houseCardResponse.data;
    bookmarkCount.value = bookmarkResponse.data;
  } catch (err) {
    console.error('데이터 로드 실패:', err);
    error.value = '데이터를 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
});

const loadHouseDetail = async () => {
  const danziId = route.params.id;
  if (!danziId) {
    error.value = '잘못된 접근입니다. 주택 ID가 없습니다.';
    loading.value = false;
    return;
  }

  try {
    console.log('🔍 Loading house detail for danziId:', danziId);
    
    // 로그인 상태와 관계없이 기본 API 사용
    console.log('🔍 Using basic API for consistent data structure');
    const response = await getHouseDetailById(danziId);

    console.log('🔍 API response:', response);

    if (response?.data) {
      const normalized = normalizeHouseDetail(response.data);
      houseData.value = normalized;

      // 로그인된 경우에만 self-check 결과를 별도로 가져오기
      if (authStore.isLoggedIn) {
        try {
          console.log('🔍 User is logged in, fetching self-check result separately');
          const selfCheckResult = await selfCheckAPI.getSelfCheckResult();
          console.log('🔍 Self-check result:', selfCheckResult);
          
          // self-check 결과를 별도로 저장
          if (selfCheckResult) {
            selfCheckMatchResult.value = selfCheckResult;
          }
        } catch (selfCheckErr) {
          console.warn('⚠️ Self-check result fetch failed:', selfCheckErr);
          // self-check 실패는 전체 데이터 로딩에 영향을 주지 않음
        }
      }
      
      // 데이터 구조 확인
      console.log('🔍 Final houseData:', houseData.value);
      console.log('🔍 danziId in normalized data:', normalized?.danzi?.danziId);
      console.log('🔍 notices count:', normalized?.notices?.length);
      console.log('🔍 attachments count:', normalized?.attachments?.length);
    } else {
      error.value = '데이터 응답이 비어 있습니다.';
      console.error('❌ Empty response data');
    }
  } catch (err) {
    console.error('❌ House detail-데이터 로드 실패:', err);
    error.value = `데이터를 불러오는 데 실패했습니다: ${err.message}`;
    throw err;
  }
};

const toggleLike = async () => {
  const danziId = route.params.id;
  try {
    if (!authStore.isLoggedIn) {
      alert('로그인이 필요합니다.');
      return;
    }

    const bookmarkData = {
      userId: authStore.user.id,
      danziId,
    };

    if (isLiked.value) {
      await bookmarkApi.deleteBookmark(bookmarkData);
      bookmarkCount.value--;
    } else {
      await bookmarkApi.createBookmark(bookmarkData);
      bookmarkCount.value++;
    }
    isLiked.value = !isLiked.value;
  } catch (err) {
    console.error('좋아요 처리 실패:', err);
    alert('서버 오류가 발생했습니다.');
  }
};
</script>

<style scoped>
.section-title {
  font-weight: 700;
  font-size: 1.25rem;
  color: #222;
  margin-bottom: 12px;
  padding-bottom: 6px;
  user-select: none;
}
.image-section-wrapper { position: relative; border-radius: 12px; padding: 12px; }
.like-btn { position: absolute; top: 1rem; right: 1rem; border-radius: 9999px; font-size: 0.875rem; transition: all 0.2s ease; }
.liked { background-color: #f67280; color: white; border: none; }
.not-liked { color: #f67280; border: 1px solid #f67280; }
.not-liked:hover { background-color: #f67280; color: white; font-weight: bolder; }
.custom-layout { display: flex; align-items: center; gap: 5px; margin-bottom: 2rem; }
.custom-left, .custom-right { background: white; border-radius: 8px; padding: 10px; min-height: 600px; }
.custom-left { flex: 7; margin-left: 6rem; }
.custom-right { flex: 5; margin-right: 6rem; }
@media (max-width: 992px) {
  .custom-layout { flex-direction: column; }
  .custom-left, .custom-right { min-height: auto; }
}
.info-panel-wrapper { position: relative; }
</style>