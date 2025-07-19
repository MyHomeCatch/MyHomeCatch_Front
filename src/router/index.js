import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import pageARoutes from './pageA';
import pageBRoutes from './pageB';
import pageCRoutes from './pageC';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    ...pageARoutes,
    ...pageBRoutes,
    ...pageCRoutes,
  ],
});

export default router;
