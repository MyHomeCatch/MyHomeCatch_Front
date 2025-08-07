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
        class="d-flex justify-content-between align-items-start position-relative"
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
          <i class="fa-solid fa-heart"></i>
          <span id="likeText">{{ isLiked ? '찜 완료' : '찜하기' }}</span>
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
    <!-- 이미지 및 정보 -->
    <ImageSection :images="images" />

    <div class="container px-4 py-5">
      <!-- 좌측 콘텐츠 영역 -->
      <div class="row">
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
        <div class="col-12 col-lg-7">
          <DetailMap
            v-if="houseCard"
            :houses="[houseCard]"
            :selectedCategory="selectedCategory"
          />
        </div>
        <!-- 우측 패널 영역 -->
        <div class="col-12 col-lg-5">
          <InfoPanel
            :danzi-info="houseData.danzi"
            :apply-info="houseData.applies"
            :notices="houseData.notices"
          />
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
import { getHouseCardById, getHouseDetailById } from '@/api/detailPageApi';
import ImageSection from '@/components/DetailPage/ImageSection.vue';
import InfoPanel from '../../components/DetailPage/InfoPanel.vue';
import Comments from '@/components/DetailPage/Comments.vue';
import DetailMap from '@/components/DetailPage/DetailMap.vue';
import { useAuthStore } from '@/stores/auth.js';
import selfCheckAPI from '@/api/selfCheck.js';
import { getHouseDetailByIdWithSelfCheck } from '../../api/detailPageApi';

const route = useRoute();
const houseData = ref(null);
const loading = ref(true);
const error = ref(null);
const houseCard = ref(null);
const selectedCategory = ref('');
const authStore = useAuthStore();
const isLiked = ref(false);
const likeCount = ref(0);
const selfCheckMatchResult = ref(null);

// API 응답에서 이미지 URL만 추출하여 새로운 배열을 만듭니다.
const images = computed(() => {
  if (houseData.value && houseData.value.attachments) {
    return houseData.value.attachments.map((att) => att.downloadUrl);
  }
  return [];
});

// 상세정보 페이지에 쓸 정보 불러오기
onMounted(async () => {
  const danziId = route.params.id;
  if (!danziId) {
    error.value = '잘못된 접근입니다. 주택 ID가 없습니다.';
    loading.value = false;
    return;
  }

  try {
    if (authStore.isLoggedIn) {
      const selfCheckResult = await selfCheckAPI.getSelfCheckResult();
      const response = await getHouseDetailByIdWithSelfCheck(
        authStore.user.id,
        selfCheckResult,
        danziId
      );
      if (response) {
        houseData.value = response.data;
        selfCheckMatchResult.value = response.data.selfCheckMatchResult; // Assuming this field exists in your API response
        console.log('login user data:', houseData.value);
      }
    } else {
      console.log('로그인하지 않은 사용자입니다.');
      const response = await getHouseDetailById(danziId);
      houseData.value = response.data;
    }
    // 좋아요 수와 상태는 API 응답에 없으므로 일단 주석 처리하거나 가상 데이터로 둡니다.
    // likeCount.value = response.data.likeCount || 0;
    // isLiked.value = response.data.isLikedByUser || false;
  } catch (err) {
    console.error('데이터를 불러오는 중 에러 발생:', err);
    error.value = '데이터를 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
});

// HouseCard 불러오기
onMounted(async () => {
  const danziId = route.params.id;
  if (!danziId) {
    error.value = '잘못된 접근입니다. 주택 ID가 없습니다.';
    loading.value = false;
    return;
  }
  try {
    const response = await getHouseCardById(danziId);
    houseCard.value = response.data;
  } catch (err) {
    console.error('데이터를 불러오는 중 에러 발생:', err);
    error.value = '데이터를 불러오는 데 실패했습니다.';
  } finally {
    loading.value = false;
  }
  console.log(houseCard.value);
});

const toggleLike = () => {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
  // 여기에 실제 서버에 좋아요 상태를 업데이트하는 API 호출을 추가할 수 있습니다.
};
</script>

<style scope>
.like-btn {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border-radius: 9999px;
  font-size: 0.875rem;
  transition: all 0.2s ease;
}
.liked {
  background-color: #db2777;
  color: white;
  border: none;
}
.not-liked {
  background-color: #fce7f3;
  color: #db2777;
  border: 1px solid #db2777;
}
.not-liked:hover {
  background-color: #fbcfe8;
}

@media (max-width: 768px) {
  .map {
    display: none;
  }
}

/* Category Button for Map */
.category-button-wrapper {
  display: flex;
  flex-wrap: wrap;
  gap: 6px; /* Increased gap for both horizontal and vertical spacing */
  margin-bottom: 16px; /* Space below the buttons and above the map */
}

.category-button {
  background-color: #f0f0f0; /* Soft light gray background */
  color: #333; /* Dark gray text */
  border: 1px solid #e0e0e0; /* Subtle border */
  padding: 8px 14px; /* Consistent padding */
  border-radius: 6px; /* Slightly rounded corners */
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease-in-out; /* Smooth transitions */
  white-space: nowrap; /* Prevent text wrapping */
}

.category-button:hover {
  background-color: #e5e5e5; /* Slightly darker on hover */
  border-color: #d0d0d0;
}

.category-button.selected {
  background-color: #ffe0e6; /* Soft pink, derived from existing primary color */
  color: #ff385c; /* Primary color for text */
  border-color: #ffcdd2; /* Slightly darker pink border */
  font-weight: 600;
}

.category-button:active {
  transform: translateY(1px); /* Slight press effect */
}
</style>
