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
            <button class="detail-btn">공고 보러가기</button>
          </div>

          <div class="period">
            신청 기간: {{ event.startDate }} ~ {{ event.endDate }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import { calendarColorMap } from '@/assets/calendarColorMap.js'; // 코드-색상-라벨 매핑

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
