<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  doList: Array,
  sigugunMap: Object,
  selectedDo: String,
  selectedSigugun: String,
  show: Boolean,
});

const emit = defineEmits([
  'close',
  'selectDo',
  'selectSigugun',
  'updateAddress',
]);

const handleSelectSigugun = (sigugun) => {
  emit('selectSigugun', sigugun);
  emit('updateAddress');
  // 구/군 선택 후 모달 닫기
  setTimeout(() => {
    emit('close');
  }, 100);
};
</script>

<template>
  <div v-if="show" class="modal-backdrop">
    <div class="modal-content">
      <button class="modal-close" @click="$emit('close')">&times;</button>
      <div v-if="!selectedDo">
        <div class="modal-title">거주지(시/도) 선택</div>
        <div class="modal-btn-group">
          <button
            v-for="doName in doList"
            :key="doName"
            @click="$emit('selectDo', doName)"
            class="modal-btn"
          >
            {{ doName }}
          </button>
        </div>
      </div>
      <div v-else>
        <div class="modal-title">{{ selectedDo }}의 구/군 선택</div>
        <div class="modal-btn-group">
          <button
            v-for="sigugun in sigugunMap[selectedDo]"
            :key="sigugun"
            @click="handleSelectSigugun(sigugun)"
            class="modal-btn"
          >
            {{ sigugun }}
          </button>
        </div>
        <button class="modal-back-btn" @click="$emit('selectDo', '')">
          이전
        </button>
      </div>
    </div>
  </div>
</template>
