<template>
  <main class="container py-4">
    <div
      class="d-flex justify-content-between align-items-start position-relative"
    >
      <div>
        <h1 class="h3 fw-bold text-dark">디에이치클래스트</h1>
        <p class="text-muted mt-1">서울 서초구 반포동 810</p>
      </div>
      <button
        id="likeButton"
        class="like-btn btn d-flex align-items-center px-3 py-1 gap-2 not-liked"
        onclick="toggleLike()"
      >
        <i class="fa-solid fa-heart"></i>
        <span id="likeText">찜</span>
      </button>
    </div>
  </main>

  <!-- 이미지 및 정보 -->
  <ImageSection />

  <div class="container px-4 py-5">
    <!-- 좌측 콘텐츠 영역 -->
    <div class="row">
      <div class="category-button-wrapper">
        <button :class="{'category-button': true,selected: selectedCategory === 'MT1',}"
            @click="selectedCategory = 'MT1'"
        >대형마트
        </button>

        <button :class="{'category-button': true,selected: selectedCategory === 'CS2',}"
            @click="selectedCategory = 'CS2'"
        >편의점
        </button>

        <button :class="{'category-button': true,selected: selectedCategory === 'PS3',}"
            @click="selectedCategory = 'PS3'"
        >어린이집
        </button>

        <button :class="{'category-button': true,selected: selectedCategory === 'SC4',}"
            @click="selectedCategory = 'SC4'"
        >학교
        </button>

        <button :class="{'category-button': true,selected: selectedCategory === 'AC5',}"
            @click="selectedCategory = 'AC5'"
        >학원
        </button>

        <button :class="{'category-button': true,selected: selectedCategory === 'OL7',}"
            @click="selectedCategory = 'OL7'"
        >주유소
        </button>

        <button
            :class="{'category-button': true,selected: selectedCategory === 'SW8',}"
            @click="selectedCategory = 'SW8'"
        >지하철역
        </button>

        <button :class="{'category-button': true,selected: selectedCategory === 'BK9',}"
            @click="selectedCategory = 'BK9'"
        >은행
        </button>

        <button :class="{'category-button': true,selected: selectedCategory === 'PO3',}"
            @click="selectedCategory = 'PO3'"
        >공공기관
        </button>

        <button :class="{'category-button': true,selected: selectedCategory === 'HP8',}"
            @click="selectedCategory = 'HP8'"
        >병원
        </button>

        <button :class="{'category-button': true,selected: selectedCategory === 'PM9',}"
            @click="selectedCategory = 'PM9'"
        >약국
        </button>

        <button :class="{'category-button': true,selected: selectedCategory === 'CT1',}"
            @click="selectedCategory = 'CT1'"
        >문화시설
        </button>
      </div>
      <div class="col-12 col-lg-7">
        <DetailMap
            v-if="houseDetail"
        :initialLat="houseDetail.lat"
        :initialLng="houseDetail.lng"
        :houses="[houseDetail]"
        :selectedCategory="selectedCategory"
        style="height: 600px;"/>
      </div>
      <!-- 우측 패널 영역 -->
      <div class="col-12 col-lg-5">
        <InfoPanel />
      </div>
    </div>
  </div>

  <!-- 게시판 -->
  <Comments />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from "vue-router";
// import axios from 'axios';
import ImageSection from '@/components/DetailPage/ImageSection.vue';
import InfoPanel from '../../components/DetailPage/InfoPanel.vue';
import Comments from '@/components/DetailPage/Comments.vue';
import DetailMap from '@/components/DetailPage/DetailMap.vue';

const route = useRoute();
const houseDetail = ref(null);
const selectedCategory = ref('');

const isLiked = ref(false);
const viewCount = ref(127);
const likeCount = ref(2);

const thumbnails = ref([
  '단지 배치도',
  '단지전경도',
  '지역위치도',
  '토지이용계획도',
]);

onMounted(() => {
  const danziId = route.query.danziId;
  console.log(danziId);

  const storedHouseData = localStorage.getItem('currentHouseDetail');

  if (storedHouseData) {
    try {
      houseDetail.value = JSON.parse(storedHouseData);
    } catch (e) {
      console.error('storedHouseData 파싱 오류');
      houseDetail.value = null;
    }
  } else {
    console.warn('localStroage에 houseData 없음. 직접URL 접근 또는 데이터 유실 가능성');
  }
  console.log(houseDetail.value);

})


const toggleLike = () => {
  isLiked.value = !isLiked.value;
  likeCount.value += isLiked.value ? 1 : -1;
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
