import { defineStore } from 'pinia';
import authApi, { loginRequest } from '../api/auth';
import axios from 'axios'; // axios 임포트 확인

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // 인증 상태
    token: localStorage.getItem('token') || null,
    isLoggedIn: !!localStorage.getItem('token'),

    loading: false,
    errorMessage: '',
    successMessage: '',

    // 사용자 정보
    user: {
      id: '',
      name: '',
      nickname: '',
      email: '',
      profile: '',
      birthday: '',
      address: '',
    },

    // 회원가입/로그인 입력값
    password: '',

    // 소셜 로그인 구분
    socialType: '', // 'kakao' | 'google' | ''

    // UI 상태
    showAddressModal: false,
    selectedDo: '',
    selectedSigugun: '',

    // 검증 상태
    emailChecked: false,
    nicknameChecked: false,
    emailChecking: false,
    nicknameChecking: false,
    emailCheckMessage: '',
    nicknameCheckMessage: '',

    emailVerified: false,
  }),
  actions: {
    async login({ email, password }) {
      try {
        const response = await loginRequest({ email, password });
        this.setToken(response.data.token);

        if (response.data.user) {
          this.user = {
            ...this.user,
            ...response.data.user,
          };
        }

        await this.fetchUserInfo();
        console.log('로그인 응답 및 user 정보 최신화 완료');

        return { success: true };
      } catch (err) {
        console.error('로그인 실패:', err);
        return {
          success: false,
          message: err.response?.data?.message || '로그인 실패',
        };
      }
    },

    logout() {
      this.token = null;
      this.isLoggedIn = false;
      localStorage.removeItem('token');
      this.resetAll();
    },

    setToken(token) {
      this.token = token;
      this.isLoggedIn = true;
      localStorage.setItem('token', token);
    },

    setSocialInfo({ id, name, nickname, email, profile, birthday, type }) {
      this.user = {
        ...this.user,
        id,
        name,
        nickname,
        email,
        profile,
        birthday,
      };
      this.socialType = type || '';
      this.emailChecked = true;
      if (type === 'kakao') this.password = `KAKAO ${id}`;
      else if (type === 'google') this.password = `GOOGLE ${id}`;
    },

    setUserField(field, value) {
      this.user[field] = value;
    },

    resetAll() {
      this.user = {
        id: '',
        name: '',
        nickname: '',
        email: '',
        profile: '',
        birthday: '',
        address: '',
      };
      this.password = '';
      this.socialType = '';
      this.selectedDo = '';
      this.selectedSigugun = '';
      this.showAddressModal = false;
      this.emailChecked = false;
      this.nicknameChecked = false;
      this.emailChecking = false;
      this.nicknameChecking = false;
      this.emailCheckMessage = '';
      this.nicknameCheckMessage = '';
      this.loading = false;
      this.errorMessage = '';
      this.successMessage = '';
      this.emailVerified = false;
    },

    async checkEmail(email) {
      this.emailChecking = true;
      this.emailCheckMessage = '';
      try {
        const response = await authApi.checkEmail(email);
        this.emailChecked = response.available;
        this.emailCheckMessage =
          response.message ||
          (response.available
            ? '사용 가능한 이메일입니다.'
            : '이미 사용 중인 이메일입니다.');
      } catch (error) {
        this.emailChecked = false;
        this.emailCheckMessage =
          error.response?.data?.message || '이메일 중복 확인에 실패했습니다.';
      } finally {
        this.emailChecking = false;
      }
    },

    async checkNickname(nickname) {
      this.nicknameChecking = true;
      this.nicknameCheckMessage = '';
      try {
        const response = await authApi.checkNickname(nickname);
        this.nicknameChecked = response.available;
        this.nicknameCheckMessage =
          response.message ||
          (response.available
            ? '사용 가능한 닉네임입니다.'
            : '이미 사용 중인 닉네임입니다.');
      } catch (error) {
        this.nicknameChecked = false;
        this.nicknameCheckMessage =
          error.response?.data?.message || '닉네임 중복 확인에 실패했습니다.';
      } finally {
        this.nicknameChecking = false;
      }
    },

    async sendEmail(email) {
      try {
        await authApi.sendToEmail({ email });
      } catch (error) {
        console.error(error);
      }
    },

    async checkEmailCode(email, code) {
      try {
        const response = await authApi.checkEmailCode({ email, code });
        if (response.success) {
          this.emailVerified = true;
          this.emailCheckMessage = '';
        } else {
          this.emailVerified = false;
        }
      } catch (error) {
        this.emailVerified = false;
      }
    },

    // 주소 모달
    openAddressModal() {
      this.showAddressModal = true;
    },
    onSelectDo(doName) {
      this.selectedDo = doName;
      this.selectedSigugun = '';
      this.user.address = doName;
    },
    onSelectSigugun(sigugunName) {
      this.selectedSigugun = sigugunName;
      this.user.address = `${this.selectedDo} ${sigugunName}`;
      this.showAddressModal = false;
    },

    async signup() {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';
      try {
        const response = await authApi.signup({
          ...this.user,
          password: this.password,
        });
        this.successMessage = response.message || '회원가입이 완료되었습니다!';
        return { success: true };
      } catch (error) {
        this.errorMessage =
          error.response?.data?.message || '회원가입에 실패했습니다.';
        return { success: false };
      } finally {
        this.loading = false;
      }
    },

    async resetPassword({ email, newPassword }) {
      try {
        const res = await authApi.resetPassword({ email, newPassword });
        return res;
      } catch (e) {
        return {
          success: false,
          message: '비밀번호 변경 요청에 실패했습니다.',
        };
      }
    },

    async fetchUserInfo() {
      if (!this.token) {
        console.warn(
          'fetchUserInfo: 토큰이 없습니다. 사용자 정보를 불러올 수 없습니다.'
        );
        return;
      }
      this.loading = true;
      try {
        const config = { headers: { Authorization: `Bearer ${this.token}` } };

        const response = await axios.get('/api/user', config);

        console.log(
          'fetchUserInfo: 백엔드로부터 받은 raw 응답 데이터:',
          response.data
        ); // 디버깅용
        this.user = { ...this.user, ...response.data };
        console.log('fetchUserInfo: 유저 정보 불러옴:', this.user.nickname);
      } catch (err) {
        console.error('fetchUserInfo: 유저 정보 불러오기 실패', err);
        this.errorMessage = '사용자 정보를 불러오는 데 실패했습니다.';
        if (err.response?.status === 401 || err.response?.status === 403) {
          this.logout();
        }
      } finally {
        this.loading = false;
      }
    },

    async withdrawUser(payload) {
      this.loading = true;
      this.errorMessage = '';
      this.successMessage = '';
      try {
        const response = await axios.delete('/api/api/auth/withdraw', {
          headers: {
            Authorization: `Bearer ${this.token}`,
          },
          data: {
            email: payload.email,
            currentPassword: payload.currentPassword,
          },
        });

        if (response.status === 200) {
          this.successMessage =
            response.data.message || '회원 탈퇴가 성공적으로 완료되었습니다.';
          this.logout();
          return { success: true, message: this.successMessage };
        } else {
          this.errorMessage =
            response.data.message || '회원 탈퇴에 실패했습니다.';
          return { success: false, message: this.errorMessage };
        }
      } catch (error) {
        console.error('회원 탈퇴 오류:', error);
        this.errorMessage =
          error.response?.data?.message || '회원 탈퇴 중 오류가 발생했습니다.';
        if (error.response?.status === 401 || error.response?.status === 403) {
          this.logout();
          this.errorMessage = this.errorMessage + ' 다시 로그인해주세요.';
        }
        return { success: false, message: this.errorMessage };
      } finally {
        this.loading = false;
      }
    },
  },
});
