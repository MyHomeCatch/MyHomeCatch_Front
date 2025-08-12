<script setup>
import { onMounted, ref } from 'vue';
import axios from 'axios';

// ✅ [테스트용] 고정된 지역 번호 사용
const region = '100';
const latestApartment = ref(null);

const formatStatDe = (statDe) => {
  if (!statDe || statDe.length !== 6) return statDe;
  const year = statDe.slice(0, 4);
  const month = statDe.slice(4, 6);
  return `${year}.${month}`;
};

const regionMap = {
  100: '서울특별시',
  200: '경기도',
  300: '부산광역시',
  400: '대구광역시',
  410: '인천광역시',
  420: '광주광역시',
  430: '대전광역시',
  440: '울산광역시',
  450: '세종특별자치시',
  500: '강원특별자치도', // 강원도는 2023년 특별자치도 승격
  510: '충청북도',
  520: '충청남도',
  530: '전라북도',
  540: '전라남도',
  550: '경상북도',
  560: '경상남도',
  570: '제주특별자치도',
};

const fetchSubWinner = async () => {
  try {
    const { data } = await axios.get('/api/winner-stats/region-score', {
      params: { region },
      // test 이후 region → props.region 으로 바꿀 것
    });

    if (data.length > 0) {
      data.sort((a, b) => b.STAT_DE.localeCompare(a.STAT_DE));
      latestApartment.value = data[0];
    }
  } catch (error) {
    console.error('Error fetching winnerScore data:', error);
  }
};

onMounted(() => {
  fetchSubWinner();
});
</script>

<template>
  <div>
    <div v-if="latestApartment" class="latest-box">
      <h2 class="title">
        {{ regionMap[region] }} 청약 가점제 당첨 정보
        <!-- {{ props.regionName }} 로 테스트 이후 바꿀 것 -->
      </h2>

      <p class="date-provision">
        제공연월: {{ formatStatDe(latestApartment.STAT_DE) }}
      </p>

      <div class="score-grid">
        <div class="score-box">
          <h5>가점 평균</h5>
          <p>{{ latestApartment.AVRG_SCORE }}</p>
        </div>
        <div class="score-box">
          <h5>가점 중위</h5>
          <p>{{ latestApartment.MED_SCORE }}</p>
        </div>
        <div class="score-box">
          <h5>가점 최고</h5>
          <p>{{ latestApartment.TOP_SCORE }}</p>
        </div>
        <div class="score-box">
          <h5>가점 최저</h5>
          <p>{{ latestApartment.LWET_SCORE }}</p>
        </div>
      </div>
    </div>

    <p v-else class="no-data">데이터를 불러오는 중입니다.</p>
  </div>
</template>

<style>
.title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.latest-box {
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
  max-width: 800px;
  margin: 0 auto;
}

.date-provision {
  font-size: 0.8rem;
  text-align: right;
  margin-bottom: 1rem;
  color: #6b7280;
}

.score-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr); /* 4칸 분할 */
  gap: 1rem;
}

.score-box {
  background-color: white;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
  padding: 1rem;
  text-align: center;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

.score-box h5 {
  font-size: 0.85rem;
  margin-bottom: 0.3rem;
  color: #111827;
}

.score-box p {
  font-size: 1.2rem;
  font-weight: 600;
  color: #1f2937;
}

.no-data {
  color: #6b7280;
  text-align: center;
  font-size: 1rem;
  margin-top: 3rem;
}
</style>
