<script setup>
import config from '@/config';
import MenuGroup from './menu/MenuGroup.vue';
import AccountMenuGroup from './menu/AccountMenuGroup.vue';
import { reactive, computed, ref } from 'vue';

const state = reactive({ isNavShow: false });

const navClass = computed(() =>
  state.isNavShow ? 'collapse navbar-collapse show' : 'collapse navbar-collapse'
);

const toggleNavShow = () => {
  state.isNavShow = !state.isNavShow;
};
</script>

<template>
  <header class="header">
    <div class="header-container">
      <!-- 왼쪽 네비게이션 -->
      <nav class="header-nav">
        <router-link
          :to="{ name: 'CalendarPage' }"
          class="nav-link"
          active-class="nav-link-active"
        >
          📅 공고 캘린더
        </router-link>
        <router-link
          :to="{ name: 'SelfCheck' }"
          class="nav-link"
          active-class="nav-link-active"
          @click="state.isNavShow = false"
        >
          📝 유형진단
        </router-link>
      </nav>

      <!-- 가운데 로고 -->
      <router-link class="header-logo" to="/">
        <img
          src="../assets/images/MyHomeCatchLogo.png"
          alt="MyHomeCatch"
          class="logo-image"
        />
        <span class="logo-text">MyHomeCatch</span>
      </router-link>

      <!-- 오른쪽 계정 메뉴 -->
      <div class="header-right">
        <AccountMenuGroup />
      </div>

      <!-- 모바일 메뉴 토글 버튼 -->
      <button
        class="mobile-menu-toggle"
        @click="toggleNavShow"
        :class="{ active: state.isNavShow }"
        aria-label="메뉴 열기/닫기"
      >
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
        <span class="hamburger-line"></span>
      </button>
    </div>

    <!-- 모바일 메뉴 -->
    <div class="mobile-menu" :class="{ show: state.isNavShow }">
      <div class="mobile-menu-content">
        <nav class="mobile-nav">
          <router-link
            :to="{ name: 'CalendarPage' }"
            class="mobile-nav-link"
            active-class="mobile-nav-link-active"
            @click="state.isNavShow = false"
          >
            📅 공고 캘린더
          </router-link>
          <router-link
            :to="{ name: 'SelfCheck' }"
            class="mobile-nav-link"
            active-class="mobile-nav-link-active"
            @click="state.isNavShow = false"
          >
            📝 유형진단
          </router-link>
        </nav>
        <div class="mobile-account">
          <AccountMenuGroup />
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header {
  position: static;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin-top: 20px;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 24px;
  height: 72px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.header-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
  z-index: 1002;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header-logo:hover {
  transform: translateX(-50%);
}

.logo-image {
  height: 40px;
  width: auto;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  letter-spacing: -0.5px;
  text-shadow: none;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: 32px;
}

.nav-link {
  color: #374151;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 600;
  padding: 8px 16px;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #1f40af;
}

.nav-link-active {
  color: #1e40af;
  font-weight: 700;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.mobile-menu-toggle {
  display: none;
  flex-direction: column;
  justify-content: space-between;
  width: 32px;
  height: 24px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  position: relative;
  z-index: 1001;
}

.hamburger-line {
  width: 100%;
  height: 3px;
  background: #374151;
  border-radius: 2px;
  transition: all 0.3s ease;
  transform-origin: center;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.mobile-menu-toggle.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(6px, 6px);
}

.mobile-menu-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -6px);
}

.mobile-menu {
  position: absolute;
  top: 72px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  transform: translateY(-100%);
  opacity: 0;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 999;
}

.mobile-menu.show {
  transform: translateY(0);
  opacity: 1;
  pointer-events: all;
}

.mobile-menu-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mobile-nav {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mobile-nav-link {
  color: #374151;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 600;
  padding: 16px 20px;
  border-radius: 12px;
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.1);
  transition: all 0.3s ease;
}

.mobile-nav-link:hover {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
  color: #1f40af;
}

.mobile-nav-link-active {
  background: rgba(59, 130, 246, 0.15);
  border-color: rgba(59, 130, 246, 0.3);
  color: #1e40af;
}

.mobile-account {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  padding-top: 20px;
}

/* 반응형 디자인 */
@media (max-width: 1024px) {
  .header-container {
    padding: 0 20px;
  }

  .header-nav {
    gap: 24px;
  }

  .nav-link {
    padding: 6px 12px;
    font-size: 0.9rem;
  }
}

@media (max-width: 768px) {
  .header-container {
    height: 64px;
    padding: 0 16px;
  }

  .header-nav {
    display: none;
  }

  .header-right {
    display: none;
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .logo-text {
    font-size: 1.25rem;
  }

  .logo-image {
    height: 36px;
  }

  .mobile-menu {
    top: 64px;
  }
}

@media (max-width: 480px) {
  .header-container {
    padding: 0 12px;
  }

  .logo-text {
    display: none;
  }

  .mobile-menu-content {
    padding: 20px 16px;
  }

  .mobile-nav-link {
    padding: 14px 16px;
    font-size: 1rem;
  }
}

/* 애니메이션 */
@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.header {
  animation: fadeInDown 0.6s ease-out;
}

/* 다크 모드 지원 */
@media (prefers-color-scheme: dark) {
  .header {
    background: rgba(26, 26, 26, 0.95);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .header-scrolled {
    background: rgba(26, 26, 26, 0.98);
    border-bottom-color: rgba(255, 255, 255, 0.15);
  }

  .logo-text {
    color: white;
    text-shadow: none;
  }

  .hamburger-line {
    background: white;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  }

  .mobile-menu {
    background: rgba(26, 26, 26, 0.95);
    border-bottom-color: rgba(255, 255, 255, 0.1);
  }

  .nav-link {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .nav-link:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .nav-link-active {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .mobile-nav-link {
    color: white;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
  }

  .mobile-nav-link:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.3);
  }

  .mobile-nav-link-active {
    background: rgba(255, 255, 255, 0.25);
    border-color: rgba(255, 255, 255, 0.4);
  }

  .mobile-account {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }
}
</style>
