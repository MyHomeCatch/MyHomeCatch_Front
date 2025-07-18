import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '../views/auth/LoginPage.vue';

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: LoginPage,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
