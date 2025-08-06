<template>
  <div class="modal-backdrop">
    <div class="modal-wrapper">
      <div class="modal-header">
        <span class="modal-title">{{ title }}</span>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <div class="modal-content">
        <div v-for="event in events" :key="event.danzi_id" class="event-item">
          <div class="event-header">
            <div
              class="cal-modal-type"
              :style="getEventStyle(event.noticeTypeCode)"
            >
              {{ event.noticeTypeName }}
            </div>
            <div class="cal-modal-addr">{{ event.address }}</div>
            <!-- <div class="type">{{ event.pan_gbn_nm }}</div>
            <div class="addr">{{ event.hssply_address }}</div> -->
          </div>

          <div class="apt-name">
            {{ event.danziName }}
            <button class="detail-btn" @click="goToPage(event.danzi_id)">
              공고 보러가기
            </button>
          </div>

          <div class="period">
            신청 기간:
            <span v-if="event.startDate === event.endDate">
              {{ event.startDate }}
            </span>
            <span v-else> {{ event.startDate }} ~ {{ event.endDate }} </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { calendarColorMap } from '@/assets/calendarColorMap.js'; // 코드-색상-라벨 매핑
import { useRouter } from 'vue-router';

const router = useRouter();

function goToPage(id) {
  console.log(id);
  router.push(`detail/${id}`); // 이동할 경로
  // router.push({ name: 'DetailPage', params: { id: id} })
}

defineProps({
  events: Array,
  title: String,
});
defineEmits(['close']);

const getEventStyle = (code) => {
  const color = calendarColorMap[code]?.color || '#86A788'; // 기본색
  return {
    border: `1.7px solid ${color}`,
    color: color,
  };
};
</script>
