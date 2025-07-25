<template>
  <div class="chart-card">
    <div class="chart-header">
      <div class="chart-header-row">
        <div class="chart-title">{{ region }} 연령대 청약</div>
        <!-- statDe가 존재할 때만 날짜 렌더 -->
        <div class="chart-info-date" v-if="regionAgeData">
          제공 연월 - {{ moment(regionAgeData.statDe).format('YYYY-MM') }}
        </div>
      </div>
    </div>
    <hr class="mt-2 mb-4" />
    <canvas class="mx-4" ref="chartRef" height="120"></canvas>
  </div>
</template>

<script setup>
import api from '@/api/staticsAPI';
import moment from 'moment';
import { onMounted, ref } from 'vue';
import { Chart, registerables } from 'chart.js';
import './chart.css';

Chart.register(...registerables);

// 지역 및 날짜 (예: 서울, 202502)
const region = '서울';
const date = '202505';

const chartRef = ref(null);
const regionAgeData = ref(null);

const applicantData = ref([]);
const winnerData = ref([]);
let chartInstance = null;

const chartData = {
  labels: ['30대 이하', '40대', '50대', '60대 이상'],
  datasets: [
    {
      label: '신청 건수',
      data: applicantData.value,
      backgroundColor: 'rgba(134, 167, 136)',
      barThickness: 40,
      yAxisID: 'left-y',
      order: 2,
    },
    {
      label: '당첨 건수',
      data: winnerData.value,
      type: 'line',
      borderColor: 'rgba(255, 207, 207)',
      backgroundColor: 'rgba(255, 207, 207)',
      tension: 0.3,
      fill: false,
      pointRadius: 4,
      pointBackgroundColor: 'rgba(255, 207, 207)',
      yAxisID: 'right-y',
      order: 1,
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    'left-y': {
      beginAtZero: true,
      position: 'left',
      title: {
        display: true,
        text: '신청 건수',
      },
      ticks: {
        callback: (value) => value.toLocaleString(),
      },
    },
    'right-y': {
      beginAtZero: true,
      position: 'right',
      title: {
        display: true,
        text: '당첨 건수',
      },
      grid: {
        drawOnChartArea: false,
      },
      ticks: {
        callback: (value) => value.toLocaleString(),
      },
    },
  },
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.dataset.label}: ${context.raw.toLocaleString()}명`;
        },
      },
    },
  },
};

onMounted(async () => {
  try {
    const data = await api.getRegionAge(region, date); // 구조분해 할당 제거
    regionAgeData.value = data;

    applicantData.value = [data.age30, data.age40, data.age50, data.age60];
    winnerData.value = [
      data.age30Win,
      data.age40Win,
      data.age50Win,
      data.age60Win,
    ];

    chartData.datasets[0].data = applicantData.value;
    chartData.datasets[1].data = winnerData.value;

    chartInstance = new Chart(chartRef.value, {
      type: 'bar',
      data: chartData,
      options: chartOptions,
    });
  } catch (error) {
    console.error('연령대 통계 API 에러:', error);
  }
});
</script>

<style scoped>
canvas {
  max-height: 300px;
}
</style>
