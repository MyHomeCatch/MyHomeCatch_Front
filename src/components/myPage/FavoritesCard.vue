<template>
  <div class="card flex-shrink-0" style="width: 180px">
    <img
      :src="item.image"
      class="card-img-top"
      alt="..."
      style="height: 110px; object-fit: cover"
    />
    <div class="card-body p-2">
      <h6 class="card-title mb-1 text-truncate">{{ item.title }}</h6>
      <p class="card-text small text-muted text-truncate">{{ item.desc }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({ item: Object });
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}
.card-img-top {
  border-top-left-radius: 12px;
  border-top-right-radius: 12px;
}
</style>
