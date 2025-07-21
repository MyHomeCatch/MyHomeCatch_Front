export default [
  {
    path: '/login',
    name: 'login',
    component: () => import('../pages/auth/LoginPage.vue'),
  },
  {
    path: '/join',
    name: 'join',
    component: () => import('../pages/auth/JoinPage.vue'),
  },
];
