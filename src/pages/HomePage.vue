<script setup>
import { ref, computed } from 'vue';
import KakaoMapViewer from '@/components/KakaoMapViewer.vue';

// LH Housing 데이터 (DTO 형태로 직접 정의)
const lhHousingData = ref([
  {
    id: '0000060880',
    complexName: '양주회천(택) A24',
    lct_ara_adr: '경기도 양주시 덕계동',
    lct_ara_dtl_adr: '일원 양주회천 택지개발지구 내 A24블록',
  },
  {
    id: '0000060881',
    complexName: '평택소사벌B-5BL(07.기) B-5',
    lct_ara_adr: '경기도 평택시 평남로 962',
    lct_ara_dtl_adr: '(비전동,엘에이치 이곡마을 6단지)',
  },
  {
    id: '0000060881',
    complexName: '안성아양B-4(공임리츠) B-4',
    lct_ara_adr: '경기도 안성시 아양로 73',
    lct_ara_dtl_adr: '(아양동,서희스타힐스 NHF)',
  },
  {
    id: '0000060881',
    complexName: '평택소사벌B-2(공임리츠) B2',
    lct_ara_adr: '경기도 평택시 비전4로 175',
    lct_ara_dtl_adr: '(비전동)',
  },
  {
    id: '0000060881',
    complexName: '평택고덕AB-10(공임리츠) Ab-10',
    lct_ara_adr: '경기도 평택시 고덕국제2로 73',
    lct_ara_dtl_adr: '(고덕동,고덕신동아파밀리에엔에이치에프7단지)',
  },
  {
    id: '0000060881',
    complexName: '안성아양B-6(공임리츠) B-6',
    lct_ara_adr: '경기도 안성시 아양로 61-19',
    lct_ara_dtl_adr: '(아양동,안성하우스디엔에이치에프)',
  },
  {
    id: '0000060881',
    complexName: '평택고덕국제화계획 Aab1(공임리츠) A-1',
    lct_ara_adr: '경기도 평택시 고덕갈평3로 50',
    lct_ara_dtl_adr: '(고덕동,평택고덕 센트레빌 엔에이치에프 3단지)',
  },
  {
    id: '0000060884',
    complexName: '익산평화(08,주환) 1',
    lct_ara_adr: '전북특별자치도 익산시 평화동',
    lct_ara_dtl_adr: '395',
  },
  {
    id: '0000060886',
    complexName: '부산명지B8(공임리츠) B8',
    lct_ara_adr: '부산광역시 강서구 명지국제5로 165',
    lct_ara_dtl_adr: '(명지동)',
  },
  {
    id: '0000060888',
    complexName: '양산물금2 41',
    lct_ara_adr: '경상남도 양산시 물금읍 새실로 54',
    lct_ara_dtl_adr: '(양산신도시엘에이치아파트5단지)',
  },
  {
    id: '0000060889',
    complexName: '거제하청(09,주1) 01',
    lct_ara_adr: '경상남도 거제시 하청면 거제북로 554',
    lct_ara_dtl_adr: '(거제하청엘에이치아파트)',
  },
  {
    id: '0000060890',
    complexName: '마산현동GB(05,국민3) S-1',
    lct_ara_adr: '경상남도 창원시 마산합포구 묘촌1길 28',
    lct_ara_dtl_adr: '(현동,엘에이치그린품애)',
  },
  {
    id: '0000060895',
    complexName: '화성봉담2 S-1(공임리츠) S-1',
    lct_ara_adr: '경기도 화성시 봉담읍 상리',
    lct_ara_dtl_adr: '수영리, 동화리 일원 화성봉담2 공공주택지구내 S-1블록',
  },
  {
    id: '0000060895',
    complexName: '화성남양뉴타운 B6(공임리츠) B6',
    lct_ara_adr: '경기도 화성시 남양읍 남양리',
    lct_ara_dtl_adr: ',북양리, 신남리 일원 화성남양뉴타운 도시개발구역내 B-6블록',
  },
  {
    id: '0000060897',
    complexName: '평택소사벌B-5BL(07.기) B-5',
    lct_ara_adr: '경기도 평택시 평남로 962',
    lct_ara_dtl_adr: '(비전동,엘에이치 이곡마을 6단지)',
  },
  {
    id: '0000060897',
    complexName: '안성아양B-4(공임리츠) B-4',
    lct_ara_adr: '경기도 안성시 아양로 73',
    lct_ara_dtl_adr: '(아양동,서희스타힐스 NHF)',
  },
  {
    id: '0000060897',
    complexName: '평택소사벌B-2(공임리츠) B2',
    lct_ara_adr: '경기도 평택시 비전4로 175',
    lct_ara_dtl_adr: '(비전동)',
  },
  {
    id: '0000060897',
    complexName: '평택고덕AB-10(공임리츠) Ab-10',
    lct_ara_adr: '경기도 평택시 고덕국제2로 73',
    lct_ara_dtl_adr: '(고덕동,고덕신동아파밀리에엔에이치에프7단지)',
  },
  {
    id: '0000060897',
    complexName: '안성아양B-6(공임리츠) B-6',
    lct_ara_adr: '경기도 안성시 아양로 61-19',
    lct_ara_dtl_adr: '(아양동,안성하우스디엔에이치에프)',
  },
  {
    id: '0000060897',
    complexName: '평택고덕국제화계획 Aab1(공임리츠) A-1',
    lct_ara_adr: '경기도 평택시 고덕갈평3로 50',
    lct_ara_dtl_adr: '(고덕동,평택고덕 센트레빌 엔에이치에프 3단지)',
  },
  {
    id: '0000060899',
    complexName: '인천영종 A33',
    lct_ara_adr: '인천광역시 중구 하늘중앙로 271',
    lct_ara_dtl_adr: '(중산동)',
  },
  {
    id: '0000060899',
    complexName: '인천영종A37(07,기) A37',
    lct_ara_adr: '인천광역시 중구 은하수로 350',
    lct_ara_dtl_adr: '(중산동)',
  },
  {
    id: '0000060899',
    complexName: '인천영종 A60',
    lct_ara_adr: '인천광역시 중구 은하수로 183',
    lct_ara_dtl_adr: '(중산동,영종국제도시 화성파크드림 오션브릿지)',
  },
  {
    id: '0000060902',
    complexName: '과천지식정보타운 S-7(10년)',
    lct_ara_adr: '경기도 과천시 과천대로8길 68',
    lct_ara_dtl_adr: '(갈현동,과천 그랑레브 데시앙)',
  },
  {
    id: '0000060904',
    complexName: '고양장항 S-1',
    lct_ara_adr: '경기도 고양시 일산동구 장항동',
    lct_ara_dtl_adr: '고양장항 S-1블록 공공분양주택',
  },
  {
    id: '0000060909',
    complexName: '과천지식정보타운 S-7(10년)',
    lct_ara_adr: '경기도 과천시 과천대로8길 68',
    lct_ara_dtl_adr: '(갈현동,과천 그랑레브 데시앙)',
  },
  {
    id: '0000060910',
    complexName: '인천가정(05,택1) 02',
    lct_ara_adr: '인천광역시 서구 봉오재2로 37',
    lct_ara_dtl_adr: '37 (가정동)',
  },
  {
    id: '0000060911',
    complexName: '고양장항 S-1',
    lct_ara_adr: '경기도 고양시 일산동구 장항동',
    lct_ara_dtl_adr: '고양장항 S-1블록 공공분양주택',
  },
  {
    id: '0000060920',
    complexName: '남양주왕숙 A-01',
    lct_ara_adr: '경기도 남양주시 진접읍 남가로 72-100',
    lct_ara_dtl_adr: '남양주왕숙 A-1블록 공공분양주택',
  },
  {
    id: '0000060920',
    complexName: '남양주왕숙 A-01',
    lct_ara_adr: '경기도 남양주시 진접읍 남가로 72-100',
    lct_ara_dtl_adr: '남양주왕숙 A-1블록 공공분양주택',
  },
  {
    id: '0000060912',
    complexName: '부산명지B8(공임리츠) B8',
    lct_ara_adr: '부산광역시 강서구 명지국제5로 165',
    lct_ara_dtl_adr: '(명지동)',
  },
]);

const basicAddressInput = ref('');
const filteredComplexes = computed(() => {
  if (!basicAddressInput.value) {
    return [];
  }
  const searchTerm = basicAddressInput.value.trim();
  return lhHousingData.value.filter(complex =>
    complex.lct_ara_adr.includes(searchTerm)
  );
});

const mapViewerRef = ref(null); // KakaoMapViewer 컴포넌트의 ref

const searchBasicAddress = () => {
  if (filteredComplexes.value.length > 0) {
    // 필터링된 첫 번째 단지의 상세 주소로 지도 이동 및 주변 시설 검색 요청
    mapViewerRef.value.updateMapWithComplex(filteredComplexes.value[0]);
  } else {
    alert('해당 기본 주소에 대한 단지 정보가 없습니다.');
  }
};

const moveMapToComplex = (complex) => {
  mapViewerRef.value.updateMapWithComplex(complex);
};
</script>

<template>
  <div style="display: flex; width: 100%; height: 100vh;">
    <div style="flex: 1; padding: 20px; overflow-y: auto;">
      <h1>LH 주택 단지 검색</h1>
      <div>
        <input type="text" v-model="basicAddressInput" placeholder="기본 주소 (예: 경기도 양주시 덕계동)" @keyup.enter="searchBasicAddress" style="width: 70%; padding: 8px; margin-right: 5px;" />
        <button @click="searchBasicAddress" style="padding: 8px 15px;">검색</button>
      </div>

      <div v-if="filteredComplexes.length > 0" style="margin-top: 20px; max-height: 400px; overflow-y: auto; border: 1px solid #eee; padding: 10px;">
        <h3>검색 결과 ({{ filteredComplexes.length }}개)</h3>
        <ul style="list-style: none; padding: 0;">
          <li v-for="complex in filteredComplexes" :key="complex.id" @click="moveMapToComplex(complex)" style="padding: 8px; border-bottom: 1px solid #eee; cursor: pointer; transition: background-color 0.2s;" @mouseover="event => event.target.style.backgroundColor = '#f0f0f0'" @mouseout="event => event.target.style.backgroundColor = 'white'">
            <strong>{{ complex.complexName }}</strong><br>
            <small>{{ complex.lct_ara_adr }} {{ complex.lct_ara_dtl_adr }}</small>
          </li>
        </ul>
      </div>
      <div v-else-if="basicAddressInput.length > 0" style="margin-top: 20px;">
        <p>검색 결과가 없습니다.</p>
      </div>
    </div>
    <div style="flex: 1; height: 100%;">
      <KakaoMapViewer ref="mapViewerRef" :lhComplexes="filteredComplexes" />
    </div>
  </div>
</template>

<style scoped>
/* 필요한 경우 추가적인 스타일을 여기에 정의합니다. */
</style>
