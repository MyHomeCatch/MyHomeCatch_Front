import axios from 'axios';

let refreshTimer = null;

function getTokenExpiration(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
    );
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch (e) {
    return null;
  }
}

const refreshAccessToken = async (api) => {
  try {
    console.log('토큰 갱신 시도 중');
    const response = await api.post('/auth/refresh');
    const newToken = response.data.token;

    localStorage.setItem('token', newToken);
    console.log('토큰 갱신 성공:', new Date().toLocaleTimeString());

    scheduleTokenRefresh(newToken, api);

    return newToken;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw error;
  }
};

const scheduleTokenRefresh = (token, api) => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
  }
  if (!token) {
    token = localStorage.getItem('token');
  }
  if (!token) return;

  const exp = getTokenExpiration(token);
  if (!exp) return;
  const now = Date.now();
  let msUntilRefresh = exp - now;
  msUntilRefresh = Math.max(Math.floor(msUntilRefresh * 0.9), 5000);
  if (msUntilRefresh < 1000) msUntilRefresh = 1000;

  console.log(
    '토큰 만료까지 남은 시간(ms):',
    exp - now,
    ',',
    Math.floor((exp - now) / 1000),
    '초'
  );
  console.log(Math.floor(msUntilRefresh / 1000), '초 후 토큰 갱신 예정');

  refreshTimer = setTimeout(() => {
    refreshAccessToken(api);
  }, msUntilRefresh);
};

// 공통 API 설정 함수
export const setupInterceptors = (api) => {
  // 응답 인터셉터 - 토큰 갱신 처리
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          console.log('401 에러로 인한 토큰 갱신 시도');
          const newToken = await refreshAccessToken(api);

          originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

          return api(originalRequest);
        } catch (refreshError) {
          console.error('토큰 갱신 실패로 로그인 페이지로 이동');
          return Promise.reject(refreshError);
        }
      }

      return Promise.reject(error);
    }
  );

  // 요청 인터셉터 - 토큰 자동 추가
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
};

// 토큰 갱신 관리 함수들
export const startTokenRefresh = (api) => {
  const token = localStorage.getItem('token');
  if (token) {
    scheduleTokenRefresh(token, api);
    console.log('토큰 갱신 스케줄링 시작');
  }
};

export const stopTokenRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
    console.log('토큰 갱신 스케줄링 중지');
  }
};

export const refreshToken = (api) => {
  return refreshAccessToken(api);
}; 