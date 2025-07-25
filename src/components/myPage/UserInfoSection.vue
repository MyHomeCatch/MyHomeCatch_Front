<script setup>
defineProps({
  userInfo: {
    type: Object,
    required: true,
    default: () => ({
      name: '',
      residence: '',
      preferredRegions: [],
      noHousePeriod: '',
      hasSubscriptionAccount: '',
      isMarried: '',
    }),
  },
});
</script>

<template>
  <div class="info-section border-top border-bottom py-3 mt-2">
    <h3 class="fw-bold">내 정보 ✏️</h3>
    <div class="row">
      <div class="col-md-6">
        <p>이름: {{ userInfo.name }}</p>
        <p>거주지: {{ userInfo.residence }}</p>
        <p>선호 지역: {{ userInfo.preferredRegions.join(', ') }}</p>
      </div>
      <div class="col-md-6">
        <p>
          무주택 기간: <strong>{{ userInfo.noHousePeriod }}</strong>
        </p>
        <p class="mt-2">청약통장: {{ userInfo.hasSubscriptionAccount }}</p>
        <p>혼인 여부: {{ userInfo.isMarried }}</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.info-section {
  margin-left: 2rem;
  margin-right: 2rem;
}

.border-top,
.border-bottom {
  border-color: #dee2e6 !important;
}

small.text-danger {
  font-size: 0.75rem;
}
</style>
