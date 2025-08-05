export default [
  {
    path: '/detail/:id',
    name: 'DetailPage',
      component: () => import('../pages/DetailPage/DetailPage.vue'),
  },
    {
    // path: '/notices/:id/user-status',
    // name: 'detailpages',
    //   component: () => import('../pages/DetailPage/DetailPage.vue'),
  },
];
