import { defineStore } from 'pinia';
import axios from 'axios';

import userApi from '../api/user';

export const useMyPageStore = defineStore('mypage', {
  state: () => ({
    // 🧍 기본 유저 정보
    userInfo: {
      name: '유저1',
      nickname: '꿍실냐옹',
      email: 'asd@gmail.com',
      residence: '대구 수성구',
      preferredRegions: ['대구'],
      hasSubscriptionAccount: '보유',
    },

    // 💰 청약 가점
    subscriptionScore: 0,

    // 🏠 세대/자금 관련 정보
    householdInfo: {
      householdSize: '4인',
      incomeLevel: '80% 이하',
      totalAssets: '3억 5,000만 원 이하',
      vehicle: 'TESLA X',
      type: '청년',
    },
    financialInfo: {
      monthlyIncome: '999만',
      cash: '9,999만',
      monthlySaving: '99만',
    },

    // 🌄 프로필 이미지
    profileImage: new URL(
      '@/assets/images/userProfileImage.png',
      import.meta.url
    ).href,

    // ⭐ 관심 공고
    favorites: [
      {
        id: 101,
        title: 'LH 청년전세임대 (서울 서초구)',
        desc: '접수: 2025.08.01 ~ 08.07',
        image: new URL('@/assets/images/MyHomeCatchLogo.png', import.meta.url)
          .href,
        status: 'active',
      },
      {
        id: 102,
        title: 'SH 행복주택 (서울 강서지구)',
        desc: '접수: 2025.07.10 ~ 07.25',
        image: new URL('@/assets/images/MyHomeCatchLogo.png', import.meta.url)
          .href,
        status: 'active',
      },
      {
        id: 103,
        title: 'LH 매입임대 (인천 연수구)',
        desc: '접수 마감: 2025.07.10',
        image: new URL('@/assets/images/MyHomeCatchLogo.png', import.meta.url)
          .href,
        status: 'upcoming',
      },
      {
        id: 104,
        title: 'LH 전세임대 (대구 수성구)',
        desc: '접수: 2025.08.05 ~ 08.11',
        image: new URL('@/assets/images/MyHomeCatchLogo.png', import.meta.url)
          .href,
        status: 'upcoming',
      },
      {
        id: 105,
        title: '공공분양 (하남 감일지구)',
        desc: '접수: 2025.07.01 ~ 07.31',
        image: new URL('@/assets/images/MyHomeCatchLogo.png', import.meta.url)
          .href,
        status: 'closed',
      },
      {
        id: 106,
        title: '신혼희망타운 (부산 기장군)',
        desc: '접수 마감: 2025.07.15',
        image: new URL('@/assets/images/MyHomeCatchLogo.png', import.meta.url)
          .href,
        status: 'closed',
      },
    ],

    // ✅ 지원 가능 여부 리스트
    supportableList: [
      { name: 'LH 청년매입임대', available: true },
      { name: 'SH 청년매입임대', available: true },
      { name: 'LH 청년전세임대', available: true },
      { name: 'LH 청년채플주택', available: false },
      { name: 'LH 청년동주택', available: false },
    ],
  }),

  actions: {
    setScore(score) {
      this.subscriptionScore = score;
    },
    updateUserInfo(newInfo) {
      this.userInfo = { ...this.userInfo, ...newInfo };
    },
    updateHouseholdInfo(newInfo) {
      this.householdInfo = { ...this.householdInfo, ...newInfo };
    },
    updateFinancialInfo(newInfo) {
      this.financialInfo = { ...this.financialInfo, ...newInfo };
    },
    setProfileImage(imageUrl) {
      this.profileImage = imageUrl;
    },
    async getUserInfo(getAuthConfig) {
      try {
        const data = await userApi.getUserInfo(getAuthConfig);
        console.log(data);

        this.userInfo.name = data.name;
        this.userInfo.nickname = data.nickname;
        this.userInfo.email = data.email;
        this.userInfo.residence = data.address; // 매핑
        this.userInfo.preferredRegions = data.preferredRegions || [];
        this.userInfo.hasSubscriptionAccount = data.hasSubscriptionAccount;
      } catch (err) {
        console.error('사용자 정보 조회 실패:', err);
        this.message = '사용자 정보를 불러오는 데 실패했습니다.';
        if (
          err.response &&
          (err.response.status === 401 || err.response.status === 403)
        ) {
          this.message =
            '인증 정보가 만료되었거나 유효하지 않습니다. 다시 로그인해주세요.';
        }
      }
    },
  },
});
