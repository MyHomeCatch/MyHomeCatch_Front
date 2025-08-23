<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="start-modal">
      <h2>자가진단을 시작하시겠습니까?</h2>
      <div class="modal-btns">
        <button class="start-btn" @click="$emit('start')">예</button>
        <button class="cancel-btn" @click="$emit('cancel')">아니오</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
});
const emit = defineEmits(['start', 'cancel']);
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  z-index: 2000;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.18);
  display: flex;
  align-items: center;
  justify-content: center;
}
.start-modal {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.13);
  padding: 48px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}
.start-modal h2 {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 12px;
}
.modal-btns {
  display: flex;
  gap: 32px;
}
.start-btn {
  font-size: 1.15rem;
  background: #a6bfa0;
  color: #fff;
  border: none;
  border-radius: 12px;
  padding: 16px 48px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.start-btn:hover {
  background: #7fa87f;
}
.cancel-btn {
  font-size: 1.15rem;
  background: #e0e0e0;
  color: #555;
  border: none;
  border-radius: 12px;
  padding: 16px 48px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.2s;
}
.cancel-btn:hover {
  background: #bdbdbd;
}
</style> 