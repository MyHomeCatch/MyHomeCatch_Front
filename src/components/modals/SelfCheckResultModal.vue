<template>
  <div v-if="visible" class="modal-backdrop">
    <div class="result-modal">
      <h2>자가진단 결과</h2>
      <div class="result-content">
        <div v-if="qualifiedHouses.length > 0" class="qualified-section">
          <h3>✅ 자격 요건을 충족하는 주택</h3>
          <ul>
            <li v-for="house in qualifiedHouses" :key="house">{{ house }}</li>
          </ul>
        </div>
        <div v-if="failedHouses.length > 0" class="failed-section">
          <h3>❌ 자격 요건을 충족하지 못하는 주택</h3>
          <ul>
            <li v-for="house in failedHouses" :key="house">{{ house }}</li>
          </ul>
        </div>
        <div v-if="qualifiedHouses.length === 0 && failedHouses.length === 0" class="no-result">
          <p>모든 주택 유형에서 자격 요건을 충족하지 못합니다.</p>
        </div>
        <div class="save-notice">
          <p>진단 결과가 데이터베이스에 저장되었습니다.</p>
        </div>
      </div>
      <div class="modal-btns">
        <button class="confirm-btn" @click="$emit('confirm')">확인</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  visible: Boolean,
  qualifiedHouses: {
    type: Array,
    default: () => []
  },
  failedHouses: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['confirm']);
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

.result-modal {
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 8px 32px 0 rgba(0,0,0,0.13);
  padding: 48px 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
  max-width: 600px;
  max-height: 80vh;
  overflow-y: auto;
}

.result-modal h2 {
  font-size: 1.8rem;
  font-weight: bold;
  margin-bottom: 12px;
  color: #234123;
}

.result-content {
  width: 100%;
  text-align: left;
}

.qualified-section, .failed-section {
  margin-bottom: 24px;
}

.qualified-section h3, .failed-section h3 {
  font-size: 1.2rem;
  font-weight: bold;
  margin-bottom: 12px;
}

.qualified-section h3 {
  color: #2e7d32;
}

.failed-section h3 {
  color: #d32f2f;
}

.result-content ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.result-content li {
  padding: 8px 0;
  border-bottom: 1px solid #f0f0f0;
  font-size: 1rem;
}

.result-content li:last-child {
  border-bottom: none;
}

.no-result {
  text-align: center;
  color: #666;
  font-size: 1.1rem;
}

.save-notice {
  margin-top: 24px;
  padding: 16px;
  background: #f8f9fa;
  border-radius: 12px;
  text-align: center;
  color: #666;
  font-size: 0.95rem;
}

.modal-btns {
  display: flex;
  gap: 16px;
}

.confirm-btn {
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

.confirm-btn:hover {
  background: #7fa87f;
}
</style> 