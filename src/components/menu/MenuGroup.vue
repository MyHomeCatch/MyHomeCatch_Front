<template>
  <div class="menu-group">
    <div
      v-for="(menu, index) in menus"
      :key="index"
      class="menu-item"
      @mouseenter="activeMenuIndex = index"
      @mouseleave="activeMenuIndex = null"
    >
      <button
        class="menu-button"
        :class="{ active: activeMenuIndex === index }"
        @click="toggleSubMenu(index)"
      >
        <i :class="menu.icon" class="menu-icon" />
        <span class="menu-title">{{ menu.title }}</span>
        <i
          class="fas fa-chevron-down dropdown-arrow"
          :class="{ rotated: activeMenuIndex === index }"
        />
      </button>

      <div class="dropdown-menu" :class="{ show: activeMenuIndex === index }">
        <div class="dropdown-content">
          <MenuItem
            v-for="child in menu.children"
            :key="child.title"
            :menu="child"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import MenuItem from './MenuItem.vue';

defineProps({
  menus: {
    type: Array,
    required: true,
  },
});

const activeMenuIndex = ref(null);

const toggleSubMenu = (index) => {
  if (activeMenuIndex.value === index) {
    activeMenuIndex.value = null;
  } else {
    activeMenuIndex.value = index;
  }
};
</script>

<style scoped>
.menu-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-item {
  position: relative;
}

.menu-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
  position: relative;
  overflow: hidden;
}

.menu-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s ease;
}

.menu-button:hover::before {
  left: 100%;
}

.menu-button:hover,
.menu-button.active {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-icon {
  font-size: 14px;
  width: 16px;
  text-align: center;
}

.menu-title {
  font-weight: 600;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
}

.dropdown-arrow {
  font-size: 10px;
  transition: transform 0.2s ease;
  margin-left: 4px;
}

.dropdown-arrow.rotated {
  transform: rotate(180deg);
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  margin-top: 8px;
  min-width: 200px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 16px;
  box-shadow: 0 8px 32px rgba(102, 126, 234, 0.2);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1000;
}

.dropdown-menu.show {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-content {
  padding: 12px 0;
}

/* 반응형 디자인 */
@media (max-width: 768px) {
  .menu-group {
    gap: 6px;
  }

  .menu-button {
    padding: 8px 12px;
    font-size: 13px;
  }

  .menu-icon {
    font-size: 13px;
    width: 14px;
  }

  .dropdown-menu {
    min-width: 180px;
    margin-top: 6px;
  }
}

/* 다크 모드 지원 */
@media (prefers-color-scheme: dark) {
  .menu-button {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.15);
  }

  .menu-button:hover,
  .menu-button.active {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.25);
  }

  .dropdown-menu {
    background: rgba(255, 255, 255, 0.9);
    border-color: rgba(255, 255, 255, 0.25);
  }
}
</style>
