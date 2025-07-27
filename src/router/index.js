import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import pageARoutes from './pageA';
import pageBRoutes from './pageB';
import pageCRoutes from './pageC';
import authRoutes from './auth';
import SelfCheckPage from '../pages/selfCheck/SelfCheckPage.vue';
import ProfileEdit from '../components/myPage/ProfileEdit.vue';
import ProfileForm from '../components/myPage/ProfileForm.vue';
import PasswordEdit from '../components/myPage/PasswordEdit.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    ...pageARoutes,
    ...pageBRoutes,
    ...pageCRoutes,
    ...authRoutes,
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
      ],
    },
  ],
});

export default router;
