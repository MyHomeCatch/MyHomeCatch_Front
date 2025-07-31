import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// 응답 인터셉터 - 토큰 자동 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // 토큰 갱신 시도
        const response = await api.post('/auth/refresh');
        const newToken = response.data.token;
        
        localStorage.setItem('token', newToken);
        
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// 요청 인터셉터 - 토큰 자동 첨부
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default {
  // 카카오 로그인
  async kakaoLogin(code) {
    let body = { code: code };
    const { data } = await api.post('/auth/kakao', body);
    return data;
  },

  // 구글 로그인
  async googleLogin(code) {
    const body = { code };
    const { data } = await api.post('/auth/login/google', body);
    return data;
  },

  // 이메일 중복 확인
  async checkEmail(email) {
    const { data } = await api.get('/auth/check-email', { params: { email } });
    return data;
  },

  // 닉네임 중복 확인
  async checkNickname(nickname) {
    const { data } = await api.get('/auth/check-nickname', {
      params: { nickname },
    });
    return data;
  },

  // 회원가입
  async signup(payload) {
    const { data } = await api.post('/auth/signup', payload);
    return data;
  },
  // 인증 이메일 전송
  async sendToEmail(payload) {
    const { data } = await api.post('/email/send', payload);
    return data;
  },

  // 이메일 인증번호 검증
  async checkEmailCode(payload) {
    const { data } = await api.post('/email/check', payload);
    return data;
  },

  // 비밀번호 재설정
  async resetPassword(payload) {
    const { data } = await api.post('/auth/password/reset', payload);
    return data;
  },

  // 로그아웃
  async logout() {
    const { data } = await api.post('/auth/logout');
    return data;
  },

  // 토큰 갱신
  async refreshToken() {
    const { data } = await api.post('/auth/refresh');
    return data;
  },
};

export const loginRequest = (payload) => {
  return api.post('/auth/login', payload);
};
