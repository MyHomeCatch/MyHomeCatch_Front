import { defineStore } from 'pinia';
import axios from 'axios';

import userApi from '../api/user';

export const useMyPageStore = defineStore('mypage', {
  state: () => ({
    // 🧍 기본 유저 정보
    userInfo: {
      name: '-',
      nickname: '-',
      email: '-',
      residence: '-',
      // preferredRegions: ['-'],
      // hasSubscriptionAccount: '-',
      additionalPoint: 0,
    },

    // // 💰 청약 가점
    // subscriptionScore: 0,

    // // 🏠 세대/자금 관련 정보
    // householdInfo: {
    //   householdSize: '4인',
    //   incomeLevel: '80% 이하',
    //   totalAssets: '3억 5,000만 원 이하',
    //   vehicle: 'TESLA X',
    //   type: '청년',
    // },
    // financialInfo: {
    //   monthlyIncome: '999만',
    //   cash: '9,999만',
    //   monthlySaving: '99만',
    // },

    // 🏠 세대/가점 관련 정보
    householdInfo: {
      residencePeriod: '-', // 거주 기간
      isHomeless: '-', // 무주택 여부
      isMarried: '-', // 혼인 여부
      householdSize: '-', // 세대 구성
      hasSubscriptionAccount: '-', // 청약 가입 여부
      targetGroup: '-', // 대상 그룹

      incomeLevel: '-', // 소득구간
      monthlyIncome: '-', // 월평균 소득
      totalAssets: '-', // 총 자산
      vehicle: '-', // 자동차 자산
      realEstate: '-', // 부동산 자산
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
    supportableList: [],
    householdInfoError: true, //
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
        // this.userInfo.preferredRegions = data.preferredRegions || [];
        // this.userInfo.hasSubscriptionAccount = data.hasSubscriptionAccount;
        this.userInfo.additionalPoint = data.additionalPoint;
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
    async getHouseholdInfo(getAuthConfig) {
      try {
        const data = await userApi.getHouseholdInfo(getAuthConfig);
        console.log(data);

        // ✅ householdInfo 전용 세팅
        this.householdInfo.residencePeriod = data.residencePeriod;
        this.householdInfo.isHomeless = data.isHomeless;
        this.householdInfo.isMarried = data.maritalStatus;
        this.householdInfo.householdSize = data.houseHoldMembers;
        this.householdInfo.hasSubscriptionAccount = data.subscriptionPeriod;
        this.householdInfo.targetGroup = data.targetGroups;

        this.householdInfo.monthlyIncome = data.monthlyIncome;
        this.householdInfo.totalAssets = data.totalAssets;
        this.householdInfo.vehicle = data.carValue; // ✅
        this.householdInfo.realEstate = data.realEstateValue; // ✅

        this.householdInfoError = false;

        // (선택) incomeLevel 필드가 필요하다면 추가
        this.householdInfo.incomeLevel = data.incomeLevel || '-';
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
        this.householdInfoError = true;
      }
    },
    async updateAdditionalPoint(getAuthConfig, additionalPoint) {
      const body = {
        email: this.userInfo.email,
        additionalPoint: additionalPoint,
      };
      try {
        const data = await userApi.updateAdditionalPoint(getAuthConfig, body);

        // ✅ 업데이트 후 사용자 정보 재조회
        await this.getUserInfo(getAuthConfig);
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
    async getSupportableList(getAuthConfig) {
      try {
        const resultList = await userApi.getSupportableList(getAuthConfig); // 예: [{ userId: 6, result: "공공분양 가능" }, ...]
        console.log('지원 가능 목록:', resultList);

        this.supportableList = resultList.map((resultStr) => {
          const [name, available] = resultStr.split(' ');
          return { name, available };
        });
      } catch (err) {
        console.error('지원 가능 목록 조회 실패:', err);
        this.supportableList = [];
      }
    },
  },
});
