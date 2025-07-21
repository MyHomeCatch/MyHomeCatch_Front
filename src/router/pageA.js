export default [
  {
    path: '/pageA/one',
    name: 'pageAOne',
    component: () => import('../pages/PageA/PageA1.vue'),
  },
  {
    path: '/pageA/two',
    name: 'pageATwo',
    component: () => import('../pages/PageA/PageA2.vue'),
  },
  {
    path: '/pageA/three',
    name: 'pageAThree',
    component: () => import('../pages/PageA/PageA3.vue'),
  },
];
