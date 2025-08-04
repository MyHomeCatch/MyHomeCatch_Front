export default [
  {
    path: '/mypage',
    name: 'pageBOne',
    component: () => import('../pages/PageB/MyPage.vue'),
  },
  {
    path: '/pageB/two',
    name: 'pageBTwo',
    component: () => import('../pages/PageB/PageB2.vue'),
  },
  {
    path: '/pageB/three',
    name: 'pageBThree',
    component: () => import('../pages/PageB/PageB3.vue'),
  },
];
