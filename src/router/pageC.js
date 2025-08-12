export default [
  {
    path: '/statics',
    name: 'staticsPage',
    component: () => import('../pages/PageC/StaticsPage.vue'),
  },
  {
    path: '/prolog',
    name: 'prologuePage',
    component: () => import('../pages/PageC/ProloguePage.vue'),
  },
  {
    path: '/pageC/three',
    name: 'pageCThree',
    component: () => import('../pages/PageC/PageC3.vue'),
  },
];
