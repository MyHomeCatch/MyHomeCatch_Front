import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import pageARoutes from './pageA';
import pageBRoutes from './pageB';
import pageCRoutes from './pageC';
import authRoutes from './auth';
import SelfCheckPage from '../pages/selfCheck/SelfCheckPage.vue';

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
  ],
});

export default router;
