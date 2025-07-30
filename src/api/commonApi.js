import { useAuthStore } from '../stores/auth';

// 요청 인터셉터 - 토큰 자동 추가
export const setupRequestInterceptor = (api) => {
  api.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();
      const token = authStore.token;
      console.log('토큰 상태:', token ? '토큰 있음' : '토큰 없음');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
        console.log('Authorization 헤더 설정:', config.headers['Authorization']);
      } else {
        console.warn('토큰이 없습니다. 로그인이 필요합니다.');
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );
};

export const setupResponseInterceptor = (api) => {
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    (error) => {
      if (error.response?.status === 401) {
        // 401 오류 시 로그인 페이지로 리다이렉트
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );
};

// 모든 인터셉터 설정
export const setupInterceptors = (api) => {
  setupRequestInterceptor(api);
  setupResponseInterceptor(api);
}; 