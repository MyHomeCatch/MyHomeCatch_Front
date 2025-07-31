import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

let refreshTimer = null;

function getTokenExpiration(token) {
  try {
    const payload = token.split('.')[1];
    const decoded = JSON.parse(atob(payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded.exp ? decoded.exp * 1000 : null;
  } catch (e) {
    return null;
  }
}

const refreshAccessToken = async () => {
  try {
    console.log('토큰 갱신 시도 중');
    const response = await api.post('/auth/refresh');
    const newToken = response.data.token;
    
    localStorage.setItem('token', newToken);
    console.log('토큰 갱신 성공:', new Date().toLocaleTimeString());
    
    scheduleTokenRefresh(newToken);
    
    return newToken;
  } catch (error) {
    console.error('토큰 갱신 실패:', error);
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
    throw error;
  }
};

const scheduleTokenRefresh = (token) => {
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

  console.log('토큰 만료까지 남은 시간(ms):', exp - now, ',', Math.floor((exp - now) / 1000), '초');
  console.log(Math.floor(msUntilRefresh / 1000), '초 후 토큰 갱신 예정');

  refreshTimer = setTimeout(() => {
    refreshAccessToken();
  }, msUntilRefresh);
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log('401 에러로 인한 토큰 갱신 시도');
        const newToken = await refreshAccessToken();
        
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
  async kakaoLogin(code) {
    let body = { code: code };
    const { data } = await api.post('/auth/kakao', body);
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      scheduleTokenRefresh(data.token);
      console.log('카카오 로그인 성공, 토큰 갱신 스케줄링 시작');
    }
    
    return data;
  },

  async googleLogin(code) {
    const body = { code };
    const { data } = await api.post('/auth/login/google', body);
    
    if (data.token) {
      localStorage.setItem('token', data.token);
      scheduleTokenRefresh(data.token);
      console.log('구글 로그인 성공, 토큰 갱신 스케줄링 시작');
    }
    
    return data;
  },

  async checkEmail(email) {
    const { data } = await api.get('/auth/check-email', { params: { email } });
    return data;
  },

  async checkNickname(nickname) {
    const { data } = await api.get('/auth/check-nickname', {
      params: { nickname },
    });
    return data;
  },

  async signup(payload) {
    const { data } = await api.post('/auth/signup', payload);
    return data;
  },
  
  async sendToEmail(payload) {
    const { data } = await api.post('/email/send', payload);
    return data;
  },

  async checkEmailCode(payload) {
    const { data } = await api.post('/email/check', payload);
    return data;
  },

  async resetPassword(payload) {
    const { data } = await api.post('/auth/password/reset', payload);
    return data;
  },

  async logout() {
    try {
      const { data } = await api.post('/auth/logout');
      
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
      }
      
      localStorage.removeItem('token');
      console.log('로그아웃 완료, 토큰 갱신 타이머 정리');
      
      return data;
    } catch (error) {
      console.error('로그아웃 요청 실패:', error);
      if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
      }
      localStorage.removeItem('token');
      throw error;
    }
  },

  async refreshToken() {
    return await refreshAccessToken();
  },

  startTokenRefresh() {
    const token = localStorage.getItem('token');
    if (token) {
      scheduleTokenRefresh(token);
      console.log('토큰 갱신 스케줄링 시작');
    }
  },

  stopTokenRefresh() {
    if (refreshTimer) {
      clearTimeout(refreshTimer);
      refreshTimer = null;
      console.log('토큰 갱신 스케줄링 중지');
    }
  }
};

export const loginRequest = (payload) => {
  return api.post('/auth/login', payload);
};
