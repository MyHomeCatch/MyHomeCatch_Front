<template>
  <transition name="modal-fade">
    <div v-if="show" class="modal-backdrop" @click="close">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="close">&times;</button>
        <img :src="imageUrl" alt="Enlarged image" class="enlarged-image" />
      </div>
    </div>
  </transition>
</template>

<script setup>
import { defineProps, defineEmits, watch } from 'vue';


const props = defineProps({
  show: {
    type: Boolean,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

const emit = defineEmits(['close']);

const close = () => {
  emit('close');
};

const handleKeydown = (event) => {
  if (event.key === 'Escape') {
    close();
  }
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    document.addEventListener('keydown', handleKeydown);
  } else {
    document.removeEventListener('keydown', handleKeydown);
  }
}, { immediate: true });

</script>

<style scoped>
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  position: relative;
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 90vw;
  max-height: 90vh;
  overflow: auto;
}

.enlarged-image {
  max-width: 100%;
  max-height: 100%;
  display: block;
  margin: auto;
}

.close-button {
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 2rem;
  color: #333;
  cursor: pointer;
}
</style>
