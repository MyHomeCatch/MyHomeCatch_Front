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
    <div class="mypage-container">
      <!-- 메인 콘텐츠 -->
      <div class="mypage-content">
        <div class="sidebar-section">
          <ProfileCard />
          <SupportableCard />
          <ScoreCard :score="score" @openModal="showModal = true" />
        </div>

        <div class="main-section">
          <UserInfoSection :userInfo="userInfo" />
          <HouseholdFinanceInfo />
          <FavoritesCarousel :items="favorites" />
        </div>
      </div>

      <!-- 모달 -->
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
  min-height: 100vh;

  padding: 2rem 0;
}

.mypage-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.page-header {
  text-align: center;
  margin-bottom: 3rem;
  position: relative;
  overflow: hidden;
}

.header-content {
  position: relative;
  z-index: 2;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #1f2937;
  margin: 0 0 1rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.page-subtitle {
  font-size: 1.1rem;
  color: #6b7280;
  margin: 0;
  font-weight: 500;
}

.header-decoration {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1;
  opacity: 0.1;
}

.decoration-circle {
  position: absolute;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.decoration-circle:nth-child(1) {
  width: 200px;
  height: 200px;
  top: -100px;
  left: -100px;
}

.decoration-circle:nth-child(2) {
  width: 150px;
  height: 150px;
  top: 50px;
  right: -75px;
}

.decoration-circle:nth-child(3) {
  width: 100px;
  height: 100px;
  bottom: -50px;
  left: 50px;
}

.mypage-content {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 2rem;
  align-items: start;
}

.sidebar-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  position: sticky;
  top: 2rem;
}

.main-section {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .mypage-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .sidebar-section {
    position: static;
    order: 2;
  }

  .main-section {
    order: 1;
  }
}

@media (max-width: 768px) {
  .mypage-wrapper {
    padding: 1rem 0;
  }

  .mypage-container {
    padding: 0 1rem;
  }

  .page-header {
    margin-bottom: 2rem;
  }

  .page-title {
    font-size: 2rem;
  }

  .page-subtitle {
    font-size: 1rem;
  }

  .mypage-content {
    gap: 1rem;
  }

  .sidebar-section {
    gap: 1rem;
  }

  .main-section {
    gap: 1rem;
  }
}

@media (max-width: 480px) {
  .mypage-container {
    padding: 0 0.5rem;
  }

  .page-title {
    font-size: 1.8rem;
  }

  .page-subtitle {
    font-size: 0.9rem;
  }
}
</style>
