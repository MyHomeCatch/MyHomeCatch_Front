<script setup>
import { ref } from 'vue';

// 📦 컴포넌트 import
import ProfileCard from '@/components/mypage/ProfileCard.vue';
import SupportableCard from '@/components/mypage/SupportableCard.vue';
import ScoreCard from '@/components/mypage/ScoreCard.vue';
import UserInfoSection from '@/components/mypage/UserInfoSection.vue';
import HouseholdFinanceInfo from '@/components/mypage/HouseholdFinanceInfo.vue';
import FavoritesCarousel from '@/components/mypage/FavoritesCarousel.vue';
import SubscriptionScoreModal from '@/components/mypage/SubscriptionScoreModal.vue'; // ✅ 추가

import logoImage from '@/assets/images/MyHomeCatchLogo.png';

// 🎯 상태 정의
const showModal = ref(false);
const score = ref(0); // ✅ 점수 상태 추가

const myUserInfo = ref({
  name: '유저1',
  residence: '대구광역시 수성구',
  preferredRegions: ['인천', '울산', '부산'],
  noHousePeriod: '3년',
  hasSubscriptionAccount: '미보유',
  isMarried: '미혼',
});

const favorites = [
  {
    title: 'Title A',
    desc: 'Lorem ipsum dolor.',
    image: logoImage,
  },
  {
    title: 'Title B',
    desc: 'Lorem ipsum dolor.',
    image: logoImage,
  },
  {
    title: 'Title C',
    desc: 'Lorem ipsum dolor.',
    image: logoImage,
  },
  {
    title: 'Title D',
    desc: 'Lorem ipsum dolor.',
    image: logoImage,
  },
  {
    title: 'Title E',
    desc: 'Lorem ipsum dolor.',
    image: logoImage,
  },
];

const 지원리스트 = [
  { name: 'LH 청년매입임대', available: true },
  { name: 'SH 청년매입임대', available: true },
  { name: 'LH 청년전세임대', available: true },
  { name: 'LH 청년채플주택', available: false },
  { name: 'LH 청년동주택', available: false },
];
</script>

<template>
  <div class="row">
    <div class="col-md-3">
      <ProfileCard />
      <SupportableCard :list="지원리스트" />
      <ScoreCard :score="score" @openModal="showModal = true" />
    </div>

    <div class="col-md-9">
      <UserInfoSection :userInfo="myUserInfo" />
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
</template>

<style scoped></style>
