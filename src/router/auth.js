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
  {
    path: '/auth/loading',
    name: 'Loading',
    component: () => import('../pages/auth/KakaoLoadingPage.vue'),
  },
  {
    path: '/auth/googleloading',
    name: 'GoogleLoading',
    component: () => import('../pages/auth/GoogleLoadingPage.vue'),
  },
];
