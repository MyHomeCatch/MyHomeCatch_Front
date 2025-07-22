export default [
  {
    path: '/pageB/one',
    name: 'pageBOne',
    component: () => import('../pages/PageB/PageB1.vue'),
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
  {
    path: '/pageB/loading',
    name: 'Loading',
    component: () => import('../pages/PageB/LoadingPage.vue'),
  },
];
