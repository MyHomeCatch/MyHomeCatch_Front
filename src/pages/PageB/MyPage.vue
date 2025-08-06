<script setup>
import { ref, onMounted } from 'vue';
import { useMyPageStore } from '@/stores/mypage';
import { useAuthStore } from '@/stores/auth';

import { storeToRefs } from 'pinia';

// 📦 컴포넌트 import
import ProfileCard from '@/components/mypage/ProfileCard.vue';
import SupportableCard from '@/components/mypage/SupportableCard.vue';
import ScoreCard from '@/components/mypage/ScoreCard.vue';
import UserInfoSection from '@/components/mypage/UserInfoSection.vue';
import HouseholdFinanceInfo from '@/components/mypage/HouseholdFinanceInfo.vue';
import FavoritesCarousel from '@/components/mypage/FavoritesCarousel.vue';
import SubscriptionScoreModal from '@/components/mypage/SubscriptionScoreModal.vue'; // ✅ 추가

import logoImage from '@/assets/images/MyHomeCatchLogo.png';

const store = useMyPageStore();
const { userInfo, favorites, supportableList, subscriptionScore } =
  storeToRefs(store);

const authStore = useAuthStore();
const { user, token } = storeToRefs(authStore);

// 🎯 상태 정의
const showModal = ref(false);
const score = ref(0); // ✅ 점수 상태 추가

// ✅ 마운트 시 사용자 정보 가져오기
onMounted(() => {
  store.getUserInfo(); // 사용자 정보 조회
  store.getHouseholdInfo();
  store.getSupportableList(); // ✅ 여기도 추가
});
</script>

<template>
  <div class="mypage-wrapper">
    <div class="container">
      <!-- ✅ 추가: 중앙 정렬 -->
      <div class="row">
        <div class="col-md-3 d-flex flex-column align-items-center">
          <ProfileCard />
          <SupportableCard />
          <ScoreCard :score="score" @openModal="showModal = true" />
        </div>

        <div class="col-md-9">
          <UserInfoSection :userInfo="userInfo" />
          <HouseholdFinanceInfo />
          <FavoritesCarousel :items="favorites" />
        </div>

        <!-- ✅ 모달 위치는 최상단에 -->
        <SubscriptionScoreModal
          v-if="showModal"
          @close="showModal = false"
          @calculated="score = $event"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.mypage-wrapper {
  background-image: url('../../assets/images/background1.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh;
  padding: 1rem 2rem 2rem; /* ✅ 상단 padding 줄이기 */
}

.col-md-3 {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem; /* ✅ 이 줄 추가 */
}
</style>
