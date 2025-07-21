export default [
  {
    path: '/pageB/one',
    name: 'pageBOne',
    component: () => import('../pages/PageB/PageB1.vue'),
  },
  {
    path: '/pageB/Login',
    name: 'pageBTwo',
    component: () => import('../pages/PageB/LoginPage.vue'),
  },
  {
    path: '/pageB/three',
    name: 'pageBThree',
    component: () => import('../pages/PageB/PageB3.vue'),
  },
];
