<script setup>
import { ref } from 'vue';
import { useMyPageStore } from '@/stores/mypage';
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

// 🎯 상태 정의
const showModal = ref(false);
const score = ref(0); // ✅ 점수 상태 추가
</script>

<template>
  <div class="mypage-wrapper">
    <div class="row">
      <div class="col-md-3 d-flex flex-column align-items-center">
        <ProfileCard />
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
</template>

<style scoped>
.mypage-wrapper {
  background-image: url('../../assets/images/background1.png');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  min-height: 100vh; /* 페이지 전체 높이 확보 */
  padding: 2rem;
}
</style>
