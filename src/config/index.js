export default {
  title: 'MyHomeCatch', // 메인 타이틀
  subtitle: 'KB Final Project', // 서브 타이틀
  menus: [
    // 메인 메뉴 구성 정보
    {
      title: '청약 공고',
      icon: 'fas fa-home',
      children: [
        {
          title: '캘린더',
          url: '/calendar',
          icon: 'fas fa-calendar-alt',
        },
      ],
    },
    // {
    //   title: '마이페이지',
    //   url: '/mypage',
    //   icon: 'fas fa-user',
    // },
    {
      title: '통계',
      icon: 'fas fa-chart-bar',
      children: [
        { title: 'StaticsPage', url: '/statics', icon: 'fas fa-chart-pie' },
        { title: 'ProloguePage', url: '/prolog', icon: 'fas fa-book-open' },
      ],
    },
    {
      title: '자가진단',
      icon: 'fas fa-stethoscope',
      children: [{ title: 'MyPage', url: '/mypage', icon: 'fas fa-user-cog' }],
    },
  ],
  accoutMenus: {
    // 인증 관련 메뉴 정보
    login: {
      url: '/login',
      title: '로그인',
      icon: 'fas fa-sign-in-alt',
    },
    join: {
      url: '/join',
      title: '회원가입',
      icon: 'fas fa-user-plus',
    },
    logout: {
      url: '/logout',
      title: '로그아웃',
      icon: 'fas fa-sign-out-alt',
    },
  },
};
