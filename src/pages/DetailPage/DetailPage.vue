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
      <div
        class="d-flex justify-content-between align-items-start position-relative mb-4"
      >
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
          <span id="likeText">{{
            isLiked ? '즐겨찾기 추가완료' : '즐겨찾기 추가'
          }}</span>
        </button>
      </div>
    </main>
    <div v-if="selfCheckMatchResult" class="container">
      <div class="text-center" role="alert">
        {{ authStore.user.nickname }} 님은 현재 이 공고에
        <span class="fw-bold"> {{ selfCheckMatchResult }} </span>한 것으로
        확인됩니다.
      </div>
    </div>

    <!-- dailymap과 infopanel 가로 배치 -->
    <div class="custom-layout">
      <div class="custom-left">
        <div class="section-title">📍 단지 위치 및 인프라 정보</div>
        <DetailMap
          v-if="houseCard"
          :houses="[houseCard]"
          :selectedCategory="selectedCategory"
        />
      </div>

      <div class="custom-right">
        <div class="section-title">🏠 공급 정보</div>
        <InfoPanel
          :danzi-info="houseData.danzi"
          :apply-info="houseData.applies"
          :notices="houseData.notices"
          :bookmark-count="bookmarkCount"
          @request-summary="handleShowSummaryClick"
          @showSummary="showSummary = true"
        />
      </div>
    </div>

    <PdfSummary
      :summaryData="summaryMarkdown"
      :loading="loadingSummary"
      :error="summaryError"
      :title="houseData.danzi ? houseData.danzi.bzdtNm : ''"
    />

    <!-- 이미지 섹션 -->
    <section class="container image-section-wrapper mb-4">
      <div class="section-title">🏘️ 단지 이미지</div>
      <ImageSection :images="images" />
    </section>

    <!-- 댓글 -->
    <Comments :danziId="houseData.danzi.danziId" />
  </template>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import { useRoute } from 'vue-router';
import {
  getHouseCardById,
  getHouseDetailById,
  getBookmarksByHouseId,
  getHouseDetailByIdWithSelfCheck,
} from '@/api/detailPageApi';
import ImageSection from '@/components/DetailPage/ImageSection.vue';
import InfoPanel from '@/components/DetailPage/InfoPanel.vue';
import Comments from '@/components/DetailPage/Comments.vue';
import DetailMap from '@/components/DetailPage/DetailMap.vue';
import PdfSummary from '@/components/DetailPage/PdfSummary.vue';

import { useAuthStore } from '@/stores/auth.js';
import selfCheckAPI from '@/api/selfCheck.js';
import bookmarkApi from '@/api/bookmarkApi.js';
import { getDynamicSummary } from '@/api/detailPageApi';

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

// 공고 요약
const summaryMarkdown = ref('');
const showSummary = ref(false);
const loadingSummary = ref(false);

// 공고 요약 로드
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
  // ★ 오버레이 먼저 열기
  // showSummary.value = true;
  loadingSummary.value = true;
  summaryError.value = '';
  summaryMarkdown.value = '';

  const danziId = route.params.id;
  const pdfUrl =
    houseData.value?.notices?.[0]?.noticeAttachments?.[0]?.ahflUrl || null;

  // pdfUrl이 아직 없을 수도 있으니, 없어도 오버레이는 열린 상태로 유지
  if (!pdfUrl) {
    // 데이터가 늦게 들어오는 구조면, watch로 houseData를 감지하여 재시도하는 것도 가능
    summaryError.value = '공고 PDF를 찾는 중입니다... 잠시만요.';
    loadingSummary.value = false;
    return;
  }

  await loadSummaryMarkdownWithParams(danziId, pdfUrl);
};

// API 응답에서 이미지 URL만 추출하여 새로운 배열을 만듭니다.
const images = computed(() => {
  if (houseData.value && houseData.value.attachments) {
    return houseData.value.attachments.map((att) => att.downloadUrl);
  }
  return [];
});

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
    const bookmarkPromise = getBookmarksByHouseId(danziId).catch((error) => {
      console.error('북마크 정보 로드 실패:', error);
      return { data: 0 }; // Return a default value on failure
    });

    const [houseCardResponse, bookmarkResponse] = await Promise.all([
      houseCardPromise,
      bookmarkPromise,
    ]);

    houseCard.value = houseCardResponse.data;
    bookmarkCount.value = bookmarkResponse.data;

    // 📌 공고 PDF 요약은 메인 로딩과 분리해서 비동기로 “발사만” 함
    const pdfUrl =
      houseData.value?.notices?.[0]?.noticeAttachments?.[0]?.ahflUrl || null;

    if (pdfUrl) {
      // await ❌ —> onMounted를 막지 않도록
      loadingSummary.value = true;
      loadSummaryMarkdownWithParams(danziId, pdfUrl)
        .catch((e) => {
          console.error('요약 로드 실패:', e);
          summaryError.value = '요약 데이터를 불러올 수 없습니다.';
        })
        .finally(() => {
          loadingSummary.value = false;
        });
    }
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
    let response;
    if (authStore.isLoggedIn) {
      const selfCheckResult = await selfCheckAPI.getSelfCheckResult();
      response = await getHouseDetailByIdWithSelfCheck(
        authStore.user.id,
        selfCheckResult,
        danziId
      );
    } else {
      response = await getHouseDetailById(danziId);
    }

    if (response && response.data) {
      // 로그인했을때 response.data: Map(House, selfCheckMatchResult)
      if (authStore.isLoggedIn) {
        houseData.value = response.data.house;
        if (response.data.selfCheckMatchResult) {
          selfCheckMatchResult.value = response.data.selfCheckMatchResult;
        }
        // 로그아웃 했을때 response.data: House
      } else {
        houseData.value = response.data;
      }
    }
  } catch (error) {
    console.error('House detail-데이터 로드 실패:', error);
    // 여기서 에러를 다시 던져 Promise.all이 catch하도록 할 수 있습니다.
    throw error;
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
      danziId: danziId,
    };

    if (isLiked.value) {
      await bookmarkApi.deleteBookmark(bookmarkData);
      bookmarkCount.value--;
    } else {
      await bookmarkApi.createBookmark(bookmarkData);
      bookmarkCount.value++;
    }
    isLiked.value = !isLiked.value;
  } catch (error) {
    console.error('좋아요 처리 실패:', error);
    alert('서버 오류가 발생했습니다.');
  }
};
</script>

<style scope>
.section-title {
  font-weight: 700;
  font-size: 1.25rem;
  color: #222;
  margin-bottom: 12px;
  padding-bottom: 6px;
  user-select: none;
}

.image-section-wrapper {
  position: relative;
  border-radius: 12px;
  padding: 12px;
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
}

.like-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}
.liked {
  background-color: #f67280;
  color: white;
  border: none;
}
.not-liked {
  /* background-color: #fce7f3; */
  color: #f67280;
  border: 1px solid #f67280;
}
.not-liked:hover {
  background-color: #f67280;
  color: white;
  font-weight: bolder;
}

.custom-layout {
  display: flex;
  align-items: center;
  gap: 5px; /* 좌우 여백 */
  margin-bottom: 2rem; /* 아래 여백 */
}

.custom-left,
.custom-right {
  background: white; /* 필요 시 배경색 */
  border-radius: 8px;
  padding: 10px;
  min-height: 600px; /* 높이 맞춤 */
}

.custom-left {
  flex: 7; /* 비율 7 */
  margin-left: 6rem;
}

.custom-right {
  flex: 5; /* 비율 5 */
  margin-right: 6rem;
}

@media (max-width: 992px) {
  .custom-layout {
    flex-direction: column;
  }
  .custom-left,
  .custom-right {
    min-height: auto;
  }
}

.info-panel-wrapper {
  position: relative;
}
</style>
