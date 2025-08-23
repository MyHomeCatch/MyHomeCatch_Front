<template>
  <div class="nav-buttons">
    <button v-if="!isFirst" class="nav-btn prev left-btn" @click="$emit('prev')">이전</button>
    <span v-else class="nav-btn-placeholder left-btn"></span>
    <div class="nav-btn-gap"></div>
    <button
      v-if="!isLast"
      class="nav-btn next right-btn"
      :disabled="!allAnswered"
      @click="$emit('next')"
    >다음</button>
    <button
      v-if="isLast"
      class="nav-btn submit right-btn"
      :disabled="!allAnswered"
      @click="$emit('submit')"
    >결과보기</button>
  </div>
</template>

<script setup>
const props = defineProps({
  isFirst: Boolean,
  isLast: Boolean,
  allAnswered: Boolean,
});
</script>

<style scoped>
.nav-buttons {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 32px;
  width: 100%;
  max-width: 1400px;
  height: 64px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  pointer-events: none;
}
.left-btn {
  position: absolute;
  left: 40px;
  bottom: 32px;
  pointer-events: auto;
}
.right-btn {
  position: absolute;
  right: 40px;
  bottom: 32px;
  pointer-events: auto;
}
.nav-btn {
  min-width: 120px;
  padding: 14px 0;
  border-radius: 12px;
  border: none;
  font-size: 1.1rem;
  font-weight: bold;
  background: #a6bfa0;
  color: #fff;
  cursor: pointer;
  transition: background 0.2s;
}
.nav-btn:disabled {
  background: #d3d3d3;
  cursor: not-allowed;
}
.prev {
  background: #b7c7b7;
}
.next {
  background: #a6bfa0;
}
.submit {
  background: #7fa87f;
}
.nav-btn-placeholder {
  min-width: 120px;
  height: 48px;
  display: inline-block;
  visibility: hidden;
}
.nav-btn-gap {
  flex: 1;
}

@media (max-width: 1024px) {
  .nav-buttons {
    bottom: 24px;
    height: 56px;
  }
  .left-btn {
    left: 16px;
    bottom: 24px;
  }
  .right-btn {
    right: 16px;
    bottom: 24px;
  }
  .nav-btn {
    min-width: 104px;
    padding: 12px 0;
    font-size: 1rem;
  }
}
</style> 