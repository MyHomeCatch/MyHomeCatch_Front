<template>
  <div class="housing-card">
    <div class="housing-header-row">
      <div class="housing-header">서울에서 경쟁률이 낮은 매물</div>
      <select
        class="housing-dropdown"
        v-model="selectedOption"
        @change="fetchLowPopular"
      >
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
        >
          {{ option.label }}
        </option>
      </select>
    </div>

    <div class="housing-list">
      <div
        class="housing-content"
        v-for="item in housingList"
        :key="item.PBLANC_NO"
      >
        <div class="housing-info-row">
          <p id="housing-name">{{ item.HOUSE_NM }}</p>
          <p id="housing-rate">{{ parseFloat(item.CMPET_RATE).toFixed(2) }}</p>
        </div>
        <div class="housing-progressBar">
          <div
            class="progress-value"
            :style="{ width: calculateProgress(item) + '%' }"
          ></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '@/api/staticsAPI';

const region = '서울'; // 현재 지역 고정
const resideList = ['해당지역', '기타지역', '기타경기'];
const rankList = [1, 2];

const options = [];
resideList.forEach((reside) => {
  rankList.forEach((rank) => {
    options.push({
      label: `${reside}_${rank}순위`,
      value: `${reside}-${rank}`,
    });
  });
});

const selectedOption = ref(options[0].value);
const housingList = ref([]);

const fetchLowPopular = async () => {
  const [reside, rank] = selectedOption.value.split('-');
  try {
    const data = await api.getLowPopular(region, reside, rank);
    housingList.value = data;
  } catch (error) {
    console.error('경쟁률 낮은 매물 API 에러:', error);
  }
};

const calculateProgress = (item) => {
  const req = parseInt(item.REQ_CNT);
  const sup = parseInt(item.SUPLY_HSHLDCO);
  if (isNaN(req) || isNaN(sup) || sup === 0) return 0;
  return Math.min(100, Math.round((req / sup) * 100));
};

onMounted(fetchLowPopular);

// // 임시 테스트용 mock 데이터
// const mockData = [
//   {
//     PBLANC_NO: '0001',
//     HOUSE_NM: '테스트아파트1',
//     CMPET_RATE: '1.2',
//     SUPLY_HSHLDCO: 100,
//     REQ_CNT: 80,
//     HOUSE_TY: '84㎡',
//     RCEPT_ENDDE: '2025-08-01',
//     SUBSCRPT_AREA_CODE_NM: '서울특별시',
//   },
//   {
//     PBLANC_NO: '0002',
//     HOUSE_NM: '테스트아파트2',
//     CMPET_RATE: '0.9',
//     SUPLY_HSHLDCO: 50,
//     REQ_CNT: 30,
//     HOUSE_TY: '59㎡',
//     RCEPT_ENDDE: '2025-08-01',
//     SUBSCRPT_AREA_CODE_NM: '서울특별시',
//   },
//   {
//     PBLANC_NO: '0003',
//     HOUSE_NM: '테스트아파트3',
//     CMPET_RATE: '1.7',
//     SUPLY_HSHLDCO: 120,
//     REQ_CNT: 140,
//     HOUSE_TY: '74㎡',
//     RCEPT_ENDDE: '2025-08-01',
//     SUBSCRPT_AREA_CODE_NM: '서울특별시',
//   },
//   {
//     PBLANC_NO: '0004',
//     HOUSE_NM: '테스트아파트4',
//     CMPET_RATE: '2.5',
//     SUPLY_HSHLDCO: 60,
//     REQ_CNT: 90,
//     HOUSE_TY: '101㎡',
//     RCEPT_ENDDE: '2025-08-01',
//     SUBSCRPT_AREA_CODE_NM: '서울특별시',
//   },
//   {
//     PBLANC_NO: '0005',
//     HOUSE_NM: '테스트아파트5',
//     CMPET_RATE: '1.1',
//     SUPLY_HSHLDCO: 30,
//     REQ_CNT: 25,
//     HOUSE_TY: '46㎡',
//     RCEPT_ENDDE: '2025-08-01',
//     SUBSCRPT_AREA_CODE_NM: '서울특별시',
//   },
// ];

// const fetchLowPopular = async () => {
//   const [reside, rank] = selectedOption.value.split('-');
//   try {
//     const data = await api.getLowPopular(region, reside, rank);
//     if (!data || data.length === 0) {
//       console.warn(
//         'API 응답이 없거나 비어 있습니다. 임시 데이터를 사용합니다.'
//       );
//       housingList.value = mockData;
//     } else {
//       housingList.value = data;
//     }
//   } catch (error) {
//     console.error('경쟁률 낮은 매물 API 에러:', error);
//     housingList.value = mockData; // 에러 발생 시에도 mock 데이터 사용
//   }
// };

// const calculateProgress = (item) => {
//   const req = parseInt(item.REQ_CNT);
//   const sup = parseInt(item.SUPLY_HSHLDCO);
//   if (isNaN(req) || isNaN(sup) || sup === 0) return 0;
//   return Math.min(100, Math.round((req / sup) * 100));
// };

// onMounted(fetchLowPopular);
</script>
