<template>
  <div class="homepage">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1 class="hero-title">
          나만의 <span class="highlight">꿈의 집</span>을 찾아보세요
        </h1>
        <p class="hero-subtitle">
          청약 정보부터 가점 계산까지, 모든 것을 한 곳에서
        </p>
        <div class="hero-actions">
          <button class="btn-primary" @click="goToSelfCheck">
            <span class="btn-icon">🏠</span>
            자가진단 시작하기
          </button>
          <button class="btn-secondary" @click="goToScore">
            <span class="btn-icon">📊</span>
            가점 계산하기
          </button>
        </div>
      </div>
      <div class="hero-visual">
        <div class="floating-card card-1">
          <div class="card-icon">🏢</div>
          <div class="card-text">청약 정보</div>
        </div>
        <div class="floating-card card-2">
          <div class="card-icon">📅</div>
          <div class="card-text">청약 일정</div>
        </div>
        <div class="floating-card card-3">
          <div class="card-icon">🎯</div>
          <div class="card-text">가점 분석</div>
        </div>
      </div>
    </section>

    <!-- Features Grid -->
    <section class="features-section">
      <div class="container">
        <div class="features-grid">
          <!-- 지원 가능한 유형 -->
          <div class="feature-card" :class="{ 'logged-in': auth.isLoggedIn }">
            <div class="feature-header">
              <div class="feature-icon">
                <span class="icon">🎯</span>
              </div>
              <h3 class="feature-title">지원 가능한 유형</h3>
            </div>
            <div class="feature-content">
              <div v-if="auth.isLoggedIn && supportableList.length > 0">
                <div class="supportable-types">
                  <div
                    v-for="type in supportableList"
                    :key="type"
                    class="type-tag"
                  >
                    {{ type }}
                  </div>
                </div>
              </div>
              <div v-else-if="auth.isLoggedIn && supportableList.length === 0">
                <p class="feature-description">
                  자가진단을 통해 지원 가능한 유형을 확인하세요!
                </p>
              </div>
              <div v-else>
                <p class="feature-description">
                  자가진단을 통해 지원 가능한 유형을 확인하세요!
                </p>
              </div>
              <div class="feature-status">
                <span @click="goToSelfCheck" class="status-badge">
                  {{
                    auth.isLoggedIn && supportableList.length > 0
                      ? '다시 진단하기'
                      : '진단하기'
                  }}
                </span>
              </div>
            </div>
          </div>

          <!-- 나의 청약 가점 -->
          <div class="feature-card" :class="{ 'logged-in': auth.isLoggedIn }">
            <div class="feature-header">
              <div class="feature-icon">
                <span class="icon">📊</span>
              </div>
              <h3 class="feature-title">나의 청약 가점</h3>
            </div>
            <div class="feature-content">
              <div v-if="auth.isLoggedIn && additionalPoint !== null">
                <div class="point-display">
                  <div class="point-left">
                    <div class="point-number">{{ additionalPoint }}점</div>
                  </div>
                  <div class="point-right">
                    <div class="point-bar-container">
                      <div
                        class="point-bar"
                        :style="{ height: (additionalPoint / 100) * 100 + '%' }"
                      ></div>
                    </div>
                    <div class="point-percentage">
                      {{ Math.round((additionalPoint / 100) * 100) }}%
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="auth.isLoggedIn && additionalPoint === null">
                <p class="feature-description">
                  가점진단을 통해 현재 수준을 파악하세요!
                </p>
              </div>
              <div v-else>
                <p class="feature-description">
                  가점진단을 통해 현재 수준을 파악하세요!
                </p>
              </div>
              <div class="feature-status">
                <span @click="goToScore" class="status-badge">{{
                  auth.isLoggedIn && additionalPoint !== null > 0
                    ? '다시 진단하기'
                    : '진단하기'
                }}</span>
              </div>
            </div>
          </div>

          <!-- 민간분양 당첨 가능성 -->
          <div class="feature-card" :class="{ 'logged-in': auth.isLoggedIn }">
            <div class="feature-header">
              <div class="feature-icon">
                <span class="icon">🎲</span>
              </div>
              <h3 class="feature-title">당첨 가능성</h3>
            </div>
            <div class="feature-content">
              <div v-if="auth.isLoggedIn && additionalPoint !== null">
                <div class="winning-probability">
                  <div class="probability-display">
                    <div class="probability-left">
                      <div
                        class="probability-grade-large"
                        :class="getPointGradeClass(additionalPoint)"
                      >
                        {{ getPointGrade(additionalPoint) }}
                      </div>
                    </div>
                    <div class="probability-right">
                      <div
                        class="probability-message"
                        :class="getPointGradeClass(additionalPoint)"
                      >
                        {{ getProbabilityMessage(additionalPoint) }}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div v-else-if="auth.isLoggedIn && additionalPoint === null">
                <p class="feature-description">
                  가점진단을 통해 당첨 가능성을 확인하세요!
                </p>
              </div>
              <div v-else>
                <p class="feature-description">
                  가점진단 후 당첨 가능성을 확인하세요!
                </p>
              </div>
              <div
                v-if="!auth.isLoggedIn && additionalPoint === null"
                class="feature-status"
              >
                <span @click="goToScore" class="status-badge">진단하기</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 공고 scroll -->
    <section class="scroll-section">
      <HorizontalCardScroller
        :title="'서울에 자취한다면 봐야할 공고'"
        :cards="seoulHouses"
        :loading="seoulHousesLoading"
        :key-field="'danziId'"
        :favorite-list="favoriteList"
        @card-click="handleCardClick"
        @toggle-favorite="handleToggleFavorite"
        @empty-action="handleRefresh"
      />
    </section>

    <section class="scroll-section">
      <HorizontalCardScroller
        :title="'경기도에 자취한다면 봐야할 공고'"
        :cards="geunggiHouses"
        :loading="geunggiHousesLoading"
        :key-field="'danziId'"
        :favorite-list="favoriteList"
        @card-click="handleCardClick"
        @toggle-favorite="handleToggleFavorite"
        @empty-action="handleRefresh"
      />
    </section>

    <!-- Action Cards -->
    <!-- <section class="actions-section">
      <div class="container">
        <div class="actions-grid">
          <div class="action-card primary" @click="goToSelfCheck">
            <div class="action-content">
              <div class="action-icon">🔍</div>
              <h3 class="action-title">자가진단 시작하기</h3>
              <p class="action-description">
                간단한 질문으로 지원 가능한 청약 유형을 확인해보세요
              </p>
              <div class="action-arrow">→</div>
            </div>
            <div class="action-bg"></div>
          </div>

          <div class="action-card secondary" @click="goToScore">
            <div class="action-content">
              <div class="action-icon">🧮</div>
              <h3 class="action-title">가점계산 하기</h3>
              <p class="action-description">
                정확한 가점 계산으로 청약 전략을 세워보세요
              </p>
              <div class="action-arrow">→</div>
            </div>
            <div class="action-bg"></div>
          </div>

          <div class="action-card accent" @click="goToCalendar">
            <div class="action-content">
              <div class="action-icon">📅</div>
              <h3 class="action-title">청약 캘린더</h3>
              <p class="action-description">
                중요한 청약 일정을 놓치지 마세요!
              </p>
              <div class="action-arrow">→</div>
            </div>
            <div class="action-bg"></div>
          </div>
        </div>
      </div>
    </section> -->

    <section></section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import user from '../api/user';
import axios from 'axios';
import HorizontalCardScroller from '../components/house/HorizontalCardScroller.vue';
import { getBookmarks } from '../api/bookmardApi';

const router = useRouter();

// Auth
const auth = useAuthStore();

const supportableList = ref([]);
const additionalPoint = ref(null);
const favoriteList = ref([]); // 즐겨찾기 목록 추가

const seoulHousesLoading = ref(false);
const seoulHouses = ref([]);
const geunggiHousesLoading = ref(false);
const geunggiHouses = ref([]);

// Navigation methods
const goToSelfCheck = () => {
  router.push('/self-check');
};

const goToScore = () => {
  router.push('/mypage');
};

const goToCalendar = () => {
  router.push('/calendar');
};

// 로그인 상태 변화 감지하여 즐겨찾기 목록 재로드
watch(
  () => auth.isLoggedIn,
  async (newValue, oldValue) => {
    if (newValue !== oldValue) {
      await loadFavorites();
    }
  },
  { immediate: false }
);

const loadUserSupportableList = async () => {
  const data = await user.getSupportableList();
  supportableList.value = data.map((str) => str.split(' ')[0]);
};

const loadUser = async () => {
  const data = await user.getUserInfo();
  additionalPoint.value = data.additionalPoint;
};

const loadFavorites = async () => {
  if (!auth.isLoggedIn) {
    favoriteList.value = [];
    return;
  }

  try {
    const response = await getBookmarks(auth.token);
    favoriteList.value = response.bookmarks || [];
    console.log('즐겨찾기 목록 로드 완료:', favoriteList.value.length); // 디버깅용
  } catch (error) {
    console.error('즐겨찾기 목록 로드 실패:', error);
    favoriteList.value = [];
  }
};

// 점수 등급 계산 함수
const getPointGrade = (point) => {
  if (point <= 10) return '낮음';
  if (point <= 30) return '보통';
  if (point <= 50) return '높음';
  return '매우 높음';
};

// 점수 등급별 CSS 클래스 반환 함수
const getPointGradeClass = (point) => {
  if (point <= 10) return 'low';
  if (point <= 30) return 'medium';
  if (point <= 50) return 'high';
  return 'very-high';
};

// 당첨 확률 메시지 계산 함수
const getProbabilityMessage = (point) => {
  if (point <= 10)
    return '당첨 확률이 매우 낮습니다. 청약 전략을 다시 검토해보세요.';
  if (point <= 30)
    return '당첨 확률이 낮습니다. 청약 전략을 다시 검토해보세요.';
  if (point <= 50)
    return '당첨 확률이 높습니다. 청약 전략을 다시 검토해보세요.';
  return '당첨 확률이 매우 높습니다. 청약 전략을 다시 검토해보세요.';
};

const getQueryUrl = () => {
  return;
};

const loadSeoulHouses = async () => {
  try {
    seoulHousesLoading.value = true;
    const params = new URLSearchParams();
    params.append('page', '0');
    params.append('size', 15);
    params.append('cnpCdNm', '서울');

    const { data } = await axios.get(`/api/api/house?${params.toString()}`);
    seoulHouses.value = data.housingList || [];
    console.log('서울 주택 목록 로드 완료:', seoulHouses.value.length);
  } catch (error) {
    console.error('서울 주택 목록 로드 실패:', error);
    seoulHouses.value = [];
  } finally {
    seoulHousesLoading.value = false;
  }
};

const loadGeunggiHouses = async () => {
  try {
    geunggiHousesLoading.value = true;
    const params = new URLSearchParams();
    params.append('page', '0');
    params.append('size', 15);
    params.append('cnpCdNm', '경기');

    const { data } = await axios.get(`/api/api/house?${params.toString()}`);
    geunggiHouses.value = data.housingList || [];
    console.log('경기 주택 목록 로드 완료:', geunggiHouses.value.length);
  } catch (error) {
    console.error('경기 주택 목록 로드 실패:', error);
    geunggiHouses.value = [];
  } finally {
    geunggiHousesLoading.value = false;
  }
};

// 이벤트 핸들러 함수들
const handleCardClick = (event) => {
  console.log('Card clicked:', event);
  // 카드 클릭 시 처리 로직
};

const handleToggleFavorite = (event) => {
  console.log('Toggle favorite:', event);
  // 즐겨찾기 토글 처리 로직
};

const handleRefresh = () => {
  console.log('Refresh requested');
  loadSeoulHouses();
  loadGeunggiHouses();
  loadFavorites();
};

// 컴포넌트 마운트 시 실행
onMounted(() => {
  loadUserSupportableList();
  loadUser();
  loadFavorites();
  loadSeoulHouses();
  loadGeunggiHouses();
});
</script>

<style scoped>
.homepage {
  min-height: 100vh;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
}

/* Hero Section */
.hero-section {
  position: relative;
  padding: 40px 0 60px; /* 전체 높이 절반 정도로 축소 */
  text-align: center;
  overflow: hidden;
  background: linear-gradient(135deg, #f8fafc 0%, #e2f0e5 100%);
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-title {
  font-size: 2.5rem; /* 폰트 크기 줄임 */
  font-weight: 800;
  color: #1e293b;
  margin-bottom: 16px; /* 간격 줄임 */
  line-height: 1.2;
}

.highlight {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  font-size: 1rem; /* 약간 줄임 */
  color: #64748b;
  margin-bottom: 24px; /* 간격 줄임 */
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-actions {
  display: flex;
  gap: 12px; /* 간격 축소 */
  justify-content: center;
  flex-wrap: wrap;
}

.btn-primary,
.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 6px; /* 아이콘과 텍스트 간격 줄임 */
  padding: 12px 24px; /* 패딩 줄임 */
  border-radius: 50px;
  font-size: 0.9rem; /* 폰트 크기 줄임 */
  font-weight: 600;
  text-decoration: none;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 3px 15px rgba(0, 0, 0, 0.1);
}

.btn-primary {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.4);
}

.btn-secondary {
  background: white;
  color: #4caf50;
  border: 2px solid #4caf50;
}

.btn-secondary:hover {
  background: #4caf50;
  color: white;
}

.btn-icon {
  font-size: 1rem; /* 아이콘 크기도 줄임 */
}

.btn-primary.large {
  padding: 16px 32px;
  font-size: 1rem;
}

/* Hero Visual */
.hero-visual {
  position: absolute;
  top: 0;
  right: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

.floating-card {
  position: absolute;
  background: white;
  border-radius: 20px;
  padding: 12px; /* 카드 안쪽 패딩 줄임 */
  box-shadow: 0 15px 45px rgba(226, 240, 229, 0.15);
  animation: float 6s ease-in-out infinite;
  border: 1px solid rgba(226, 240, 229, 0.1);
  width: 100px; /* 카드 크기 줄임 */
  text-align: center;
}

.floating-card:nth-child(1) {
  top: 20%;
  right: 15%;
  animation-delay: 0s;
}

.floating-card:nth-child(2) {
  top: 50%;
  right: 25%;
  animation-delay: 2s;
}

.floating-card:nth-child(3) {
  top: 80%;
  right: 35%;
  animation-delay: 4s;
}

.card-icon {
  font-size: 1.5rem; /* 아이콘 크기 줄임 */
  margin-bottom: 6px; /* 간격 줄임 */
}

.card-text {
  font-weight: 600;
  color: #334155;
  font-size: 0.9rem; /* 텍스트 크기 줄임 */
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-15px); /* 살짝 줄임 */
  }
}

/* Features Section */
.features-section {
  padding: 30px 0 0 0;
  background: white;
}

.section-title {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: #1e293b;
  margin-bottom: 60px;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
  gap: 30px;
}

.feature-card {
  background: white;
  border-radius: 24px;
  max-height: 150px;
  padding: 20px 24px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.07);
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
  transition: all 0.3s ease;
}

.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  transform: scaleX(0);
  transition: transform 0.3s ease;
}

.feature-card:hover::before {
  transform: scaleX(1);
}

.feature-card:hover {
  border-color: #4caf50;
}

.feature-card.logged-in {
  border-color: #4caf50;
}

.feature-card.logged-in::before {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
}

.feature-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.feature-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-card.logged-in .feature-icon {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
}

.icon {
  font-size: 1.75rem;
}

.feature-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1e293b;
}

.feature-description {
  color: #64748b;
  line-height: 1.4;
  text-align: center;
  margin-bottom: 12px;
  font-size: 0.85rem;
}

.feature-status {
  position: absolute;
  bottom: 14px;
  right: 16px;
  justify-content: flex-end;
}

.status-badge {
  color: #4caf50;
  text-decoration: underline;
  cursor: pointer;
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.status-badge:hover {
  background: rgba(59, 130, 246, 0.1);
  color: #1d4ed8;
}

.supportable-types {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 10px;
  max-height: 40px;
  overflow-y: auto;
}

.type-tag {
  background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 14px;
  font-size: 0.8rem;
  font-weight: 600;
  box-shadow: 0 2px 6px rgba(59, 130, 246, 0.3);
}

.point-display {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 16px;
}

.point-left {
  text-align: left;
}

.point-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #3b82f6;
  margin-bottom: 8px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.point-label {
  color: #64748b;
  font-weight: 600;
  font-size: 0.875rem;
}

.point-right {
  flex-grow: 1;
  text-align: right;
}

.point-bar-container {
  width: 30px;
  height: 80px;
  background-color: #e2e8f0;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 8px;
  position: relative;
}

.point-bar {
  width: 100%;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 15px;
  transition: height 0.3s ease-in-out;
  position: absolute;
  bottom: 0;
  height: 0;
}

.point-percentage {
  font-size: 0.875rem;
  font-weight: 600;
  color: #64748b;
}

.winning-probability {
  margin-bottom: 16px;
}

.probability-display {
  display: flex;
  align-items: center;
  gap: 20px;
}

.probability-left {
  text-align: left;
}

.probability-right {
  flex-grow: 1;
  text-align: left;
}

.probability-bar-container {
  width: 30px;
  height: 80px;
  background-color: #e2e8f0;
  border-radius: 15px;
  overflow: hidden;
  margin-bottom: 8px;
  position: relative;
}

.probability-bar {
  width: 100%;
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  border-radius: 15px;
  transition: height 0.3s ease-in-out;
  position: absolute;
  bottom: 0;
  height: 0;
}

.probability-grade {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.probability-grade-large {
  font-size: 2rem;
  font-weight: 800;
  text-align: center;
  padding: 20px;
  border-radius: 16px;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 2px solid rgba(255, 255, 255, 0.3);
  min-width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.probability-grade-large.low {
  color: #ef4444;
  border-color: rgba(239, 68, 68, 0.5);
  background: rgba(239, 68, 68, 0.1);
}

.probability-grade-large.medium {
  color: #f59e0b;
  border-color: rgba(245, 158, 11, 0.5);
  background: rgba(245, 158, 11, 0.1);
}

.probability-grade-large.high {
  color: #10b981;
  border-color: rgba(16, 185, 129, 0.5);
  background: rgba(16, 185, 129, 0.1);
}

.probability-grade-large.very-high {
  color: #8b5cf6;
  border-color: rgba(139, 92, 246, 0.5);
  background: rgba(139, 92, 246, 0.1);
}

.point-grade {
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 8px;
}

.point-grade.high {
  color: #10b981;
}

.point-grade.very-high {
  color: #8b5cf6;
}

.point-grade.medium {
  color: #f59e0b;
}

.point-grade.low {
  color: #ef4444;
}

.probability-message {
  font-size: 0.875rem;
  color: #64748b;
  margin-top: 8px;
}

.probability-message.low {
  color: #ef4444;
}

.probability-message.medium {
  color: #f59e0b;
}

.probability-message.high {
  color: #10b981;
}

.probability-message.very-high {
  color: #8b5cf6;
}

/* Actions Section */
.actions-section {
  padding: 20px 0;
}

.scroll-section {
  background: white;
  max-width: 1200px;
  margin-left: auto;
  margin-right: auto;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 30px;
}

.action-card {
  position: relative;
  border-radius: 24px;
  padding: 40px;
  cursor: pointer;
  overflow: hidden;
  transition: all 0.3s ease;
}

.action-card:hover {
  transform: translateY(-8px);
}

.action-card.primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.action-card.secondary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}

.action-card.accent {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
  color: white;
}

.action-content {
  position: relative;
  z-index: 2;
}

.action-icon {
  font-size: 3rem;
  margin-bottom: 20px;
}

.action-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 16px;
}

.action-description {
  line-height: 1.6;
  margin-bottom: 24px;
  opacity: 0.9;
}

.action-arrow {
  font-size: 1.5rem;
  font-weight: 700;
  opacity: 0.8;
}

.action-bg {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.1);
  transform: scaleX(0);
  transition: transform 0.3s ease;
  transform-origin: left;
}

.action-card:hover .action-bg {
  transform: scaleX(1);
}

/* Stats Section */
.stats-section {
  padding: 60px 0;
  background: white;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 30px;
}

.stat-card {
  text-align: center;
  padding: 40px 20px;
}

.stat-number {
  font-size: 3rem;
  font-weight: 800;
  color: #3b82f6;
  margin-bottom: 8px;
}

.stat-label {
  color: #64748b;
  font-weight: 600;
}

/* CTA Section */
.cta-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
  color: white;
  text-align: center;
}

.cta-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 24px;
}

.cta-description {
  font-size: 1.125rem;
  color: #cbd5e1;
  max-width: 600px;
  margin: 0 auto 40px;
  line-height: 1.6;
}

.cta-actions {
  display: flex;
  justify-content: center;
}

/* Responsive Design */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .actions-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .floating-card {
    display: none;
  }
}

@media (max-width: 480px) {
  .hero-section {
    padding: 60px 0 80px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .section-title {
    font-size: 2rem;
  }

  .feature-card {
    padding: 30px 20px;
  }

  .action-card {
    padding: 30px 20px;
  }
}
</style>
