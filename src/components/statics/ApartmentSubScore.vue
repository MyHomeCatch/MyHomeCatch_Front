<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

// ✅ [테스트용] 고정된 지역 번호 사용
const region = '01';

const regionMap = {
  '01': '서울',
  '02': '부산',
  '03': '대구',
  '04': '인천',
  '05': '광주',
  '06': '대전',
  '07': '울산',
  '08': '세종',
  '09': '경기',
  10: '강원',
  11: '충북',
  12: '충남',
  13: '전북',
  14: '전남',
  15: '경북',
  16: '경남',
  17: '제주',
};

// 추후 수정 후 사용
//  const props = defineProps({ region: String })

const apartments = ref([]);

const fetchApartments = async () => {
  try {
    const { data } = await axios.get('/api/winner-stats/low-score', {
      params: { region },
      // test 이후 region → props.region 으로 바꿀 것
    });
    apartments.value = data;
  } catch (error) {
    console.error('Error fetching apartment data:', error);
  }
};

onMounted(() => {
  fetchApartments();
});
</script>

<template>
  <div>
    <h2 class="title">
      {{ regionMap[region] }} 지역 가점 부담이 적은 아파트 목록 (Top 5)
    </h2>

    <ul v-if="apartments.length" class="grid-container">
      <li v-for="apt in apartments" :key="apt.id" class="grid-item">
        <h3>{{ apt.HOUSE_NM }}</h3>
        <p><span class="star">*</span>최저 가점: {{ apt.LWET_SCORE }}</p>
        <p>평균 가점: {{ apt.AVRG_SCORE }}</p>
        <p>최대 가점: {{ apt.TOP_SCORE }}</p>
      </li>
    </ul>

    <p v-else class="no-data">
      데이터를 불러오는 중이거나, 해당 지역의 아파트 정보가 없습니다.
    </p>
  </div>
</template>

<style scoped>
.title {
  font-size: 1.2rem; /* 타이틀 크기 */
  font-weight: 600;
  margin-bottom: 1rem;
  color: #1f2937;
}

.grid-container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  padding: 0;
  margin: 0 auto;
  max-width: 1200px;
  list-style: none;
}

.grid-item {
  border: 1px solid #d1d5db;
  padding: 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);

  font-size: 0.8rem; /* 타이틀 대비 약 1/3 크기 */
  color: #374151;
}

.grid-item h3 {
  font-size: 0.7rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #111827;
}

.grid-item p {
  margin: 0.15rem 0;
  line-height: 1.2;
  text-align: center;
}

.star {
  display: inline-block;
  width: 12px;
  margin-right: 4px;
  color: #ef4444;
}

.no-data {
  color: #6b7280;
  text-align: center;
  font-size: 1rem;
  margin-top: 3rem;
}

div {
  padding: 1rem;
  border: 1px solid #d1d5db;
  border-radius: 0.5rem;
}
</style>
