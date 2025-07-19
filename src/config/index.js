export default {
  title: 'MyHomeCatch', // 메인 타이틀
  subtitle: 'KB Final Project', // 서브 타이틀
  menus: [
    // 메인 메뉴 구성 정보
    {
      title: 'PageA1',
      url: '/pageA/one',
      icon: 'fa-solid fa-paste',
    },
    {
      title: 'PageB1',
      url: '/pageB/one',
      icon: 'fa-solid fa-plane-departure',
    },
    {
      title: 'PageC1',
      url: '/pageC/one',
      icon: 'fa-regular fa-images',
    },
  ],
  accoutMenus: {
    // 인증 관련 메뉴 정보
    login: {
      url: '/pageB/two',
      title: 'PageB2',
      icon: 'fa-solid fa-right-to-bracket',
    },
    join: {
      url: '/pageB/three',
      title: 'PageB3',
      icon: 'fa-solid fa-user-plus',
    },
  },
};
