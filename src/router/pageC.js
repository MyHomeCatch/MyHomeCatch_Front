export default [
  {
    path: '/pageC/one',
    name: 'pageCOne',
    component: () => import('../pages/PageC/PageC1.vue'),
  },
  {
    path: '/pageC/two',
    name: 'pageCTwo',
    component: () => import('../pages/PageC/PageC2.vue'),
  },
  {
    path: '/pageC/three',
    name: 'pageCThree',
    component: () => import('../pages/PageC/PageC3.vue'),
  },
];
