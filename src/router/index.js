import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import pageARoutes from './pageA';
import pageBRoutes from './pageB';
import pageCRoutes from './pageC';
import authRoutes from './auth';
import detailRoutes from './DetailPage';
import SelfCheckPage from '../pages/selfCheck/SelfCheckPage.vue';
import CalendarRoutes from './calendar';
import { useAuthStore } from '../stores/auth';
import ProfileEdit from '../components/myPage/ProfileEdit.vue';
import ProfileForm from '../components/myPage/ProfileForm.vue';
import PasswordEdit from '../components/myPage/PasswordEdit.vue';
import ByeBye from '../components/myPage/ByeBye.vue';
import ByeComplete from '../components/myPage/ByeComplete.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    ...pageARoutes,
    ...pageBRoutes,
    ...pageCRoutes,
    ...authRoutes,
    ...CalendarRoutes,
    ...detailRoutes,
    {
      path: '/self-check',
      name: 'SelfCheck',
      component: SelfCheckPage,
    },
    // { path: '/mypage', name: 'MyPage', component: MyPage },
    {
      path: '/profile/edit',
      name: 'ProfileEdit',
      component: ProfileEdit,
      children: [
        {
          path: '',
          name: 'ProfileForm',
          component: ProfileForm,
        },
        {
          path: 'passwordEdit',
          name: 'PasswordEdit',
          component: PasswordEdit,
        },
        {
          path: 'byeBye',
          name: 'ByeBye',
          component: ByeBye,
        },
      ],
    },
    { path: '/byeComplete', name: 'ByeComplete', component: ByeComplete },
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
