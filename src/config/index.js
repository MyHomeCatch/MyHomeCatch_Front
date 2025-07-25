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
      title: '통계',
      url: '/statics',
      icon: 'fa-regular fa-images',
    },
  ],
  accoutMenus: {
    // 인증 관련 메뉴 정보
    login: {
      url: '/login',
      title: '로그인',
      icon: 'fa-solid fa-right-to-bracket',
    },
    join: {
      url: '/join',
      title: '회원가입',
      icon: 'fa-solid fa-user-plus',
    },
    logout: {
      url: '/logout',
      title: '로그아웃',
      icon: 'fa-solid fa-right-from-bracket',
    },
  },
};
