<template>
  <div v-if="loading" class="detail-container">
    <div class="loading-spinner">
      <div class="spinner"></div>
      <p>로딩 중...</p>
    </div>
  </div>

  <div v-else-if="error" class="detail-container">
    <div class="error-message">
      <i class="fa-solid fa-exclamation-triangle"></i>
      <p>{{ error }}</p>
    </div>
  </div>

  <template v-else-if="houseData && houseData.danzi">
    <main class="detail-main">
      <div class="detail-header">
        <div class="header-content">
          <h1 class="detail-title">{{ houseData.danzi.bzdtNm }}</h1>
          <p class="detail-address">
            {{ houseData.danzi.lctAraAdr }} {{ houseData.danzi.lctAraDtlAdr }}
          </p>
        </div>
        <button
          id="likeButton"
          class="like-btn"
          :class="{ liked: isLiked, 'not-liked': !isLiked }"
          @click="toggleLike"
        >
          <i class="fa-solid fa-heart"></i>
          <span id="likeText">{{
            isLiked ? '즐겨찾기 추가완료' : '즐겨찾기 추가'
          }}</span>
        </button>
      </div>
    </main>

    <div v-if="selfCheckMatchResult" class="self-check-result">
      <div class="result-content">
        <i class="fa-solid fa-info-circle"></i>
        <span
          >{{ authStore.user.nickname }} 님은 현재 이 공고에
          <strong>{{ selfCheckMatchResult }}</strong
          >한 것으로 확인됩니다.</span
        >
      </div>
    </div>

    <!-- 이미지 및 정보 -->
    <ImageSection :images="images" />

    <div class="detail-content">
      <!-- 좌측 콘텐츠 영역 -->
      <div class="content-wrapper">
        <div class="category-section">
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

        <div class="content-grid">
          <div class="map-section">
            <DetailMap
              v-if="houseCard"
              :houses="[houseCard]"
              :selectedCategory="selectedCategory"
            />
          </div>

          <!-- 우측 패널 영역 -->
          <div class="info-section">
            <InfoPanel
              :danzi-info="houseData.danzi"
              :apply-info="houseData.applies"
              :notices="houseData.notices"
              :bookmark-count="bookmarkCount"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 게시판 -->
    <Comments :danziId="houseData.danzi.danziId" />
  </template>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import {
  getHouseCardById,
  getHouseDetailById,
  getBookmarksByHouseId,
  getHouseDetailByIdWithSelfCheck,
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
const houseCard = ref(null);
const selectedCategory = ref('');
const authStore = useAuthStore();
const isLiked = ref(false);
const selfCheckMatchResult = ref(null);
const bookmarkCount = ref(0);

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
      houseData.value = response.data;
      if (response.data.selfCheckMatchResult) {
        selfCheckMatchResult.value = response.data.selfCheckMatchResult;
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

<style scoped>
/* 전체 컨테이너 */
.detail-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
}

/* 로딩 스피너 */
.loading-spinner {
  text-align: center;
  color: #64748b;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

/* 에러 메시지 */
.error-message {
  text-align: center;
  color: #ef4444;
  padding: 2rem;
}

.error-message i {
  font-size: 2rem;
  margin-bottom: 1rem;
}

/* 메인 영역 */
.detail-main {
  background: white;
  padding: 2rem 0;
  border-bottom: 1px solid #e2e8f0;
}

.detail-header {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  position: relative;
}

.header-content {
  max-width: 70%;
}

.detail-title {
  font-size: 2rem;
  font-weight: 800;
  color: #1e293b;
  margin: 0 0 0.5rem 0;
  line-height: 1.2;
}

.detail-address {
  color: #64748b;
  font-size: 1.1rem;
  margin: 0;
  font-weight: 500;
}

/* 좋아요 버튼 */
.like-btn {
  position: absolute;
  top: 0;
  right: 2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.liked {
  background-color: #ef4444;
  color: white;
}

.not-liked {
  background-color: #fef2f2;
  color: #ef4444;
  border: 2px solid #ef4444;
}

.not-liked:hover {
  background-color: #fee2e2;
}

/* 자체점검 결과 */
.self-check-result {
  background: #f0f9ff;
  border: 1px solid #3b82f6;
  border-radius: 12px;
  margin: 2rem auto;
  max-width: 1200px;
  padding: 1rem 2rem;
}

.result-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #1e40af;
  font-weight: 500;
}

.result-content i {
  color: #3b82f6;
  font-size: 1.1rem;
}

/* 콘텐츠 영역 */
.detail-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

.content-wrapper {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

/* 카테고리 섹션 */
.category-section {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.category-button {
  background-color: white;
  color: #475569;
  border: 2px solid #e2e8f0;
  padding: 0.75rem 1.25rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.category-button:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  background-color: #f0f9ff;
}

.category-button.selected {
  background-color: #3b82f6;
  color: white;
  border-color: #3b82f6;
  font-weight: 700;
}

/* 콘텐츠 그리드 */
.content-grid {
  display: grid;
  grid-template-columns: 1fr 400px;
  gap: 2rem;
}

.map-section {
  min-height: 500px;
}

.info-section {
  min-height: 500px;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .content-grid {
    grid-template-columns: 1fr;
  }

  .info-section {
    order: -1;
  }
}

@media (max-width: 768px) {
  .detail-header {
    padding: 0 1rem;
  }

  .detail-content {
    padding: 1rem;
  }

  .detail-title {
    font-size: 1.5rem;
  }

  .like-btn {
    position: relative;
    top: auto;
    right: auto;
    margin-top: 1rem;
    align-self: flex-start;
  }

  .header-content {
    max-width: 100%;
  }

  .category-section {
    gap: 0.5rem;
  }

  .category-button {
    padding: 0.5rem 1rem;
    font-size: 0.8rem;
  }
}
</style>
