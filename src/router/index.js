import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import authRoutes from './AuthRoutes.js';
import detailRoutes from './DetailPageRoutes';
import CalendarRoutes from './CalendarRoutes';
import { useAuthStore } from '../stores/auth';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    ...authRoutes,
    ...CalendarRoutes,
    ...detailRoutes,
    {
      path: '/self-check',
      name: 'SelfCheck',
      component: () => import('../pages/SelfCheckPage.vue'),
    },
    {
      path: '/map',
      name: 'Map',
      component: () => import('../pages/MapPage.vue'),
    },
    {
      path: '/profile/edit',
      name: 'ProfileEdit',
      component: () => import('../components/myPage/ProfileEdit.vue'),
      children: [
        {
          path: '',
          name: 'ProfileForm',
          component: () => import('../components/myPage/ProfileForm.vue'),
        },
        {
          path: 'passwordEdit',
          name: 'PasswordEdit',
          component: () => import('../components/myPage/PasswordEdit.vue'),
        },
        {
          path: 'byeBye',
          name: 'ByeBye',
          component: () => import('../components/myPage/ByeBye.vue'),
        },
      ],
    },
    {
      path: '/byeComplete',
      name: 'ByeComplete',
      component: () => import('../components/myPage/ByeComplete.vue'),
    },
  ],
});

// 로그인이 필요한 페이지들
const protectedRoutes = ['/mypage', '/self-check'];

// 전역 가드 설정
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // 보호된 라우트에 접근하려는 경우
  if (protectedRoutes.includes(to.path)) {
    // 로그인되지 않은 경우 알림 후 로그인 페이지로 리다이렉트
    if (!authStore.isLoggedIn) {
      alert('로그인이 필요한 페이지입니다. 로그인 페이지로 이동합니다.');
      next('/login');
      return;
    }
  }

  // 로그인된 사용자가 로그인/회원가입 페이지에 접근하는 경우 홈으로 리다이렉트
  if (authStore.isLoggedIn && (to.path === '/login' || to.path === '/join')) {
    next('/');
    return;
  }

  next();
});

export default router;
