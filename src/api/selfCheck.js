import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 쿠키를 포함하여 요청
});

// 토큰 갱신 타이머
let refreshTimer = null;

// 토큰 갱신 함수
const refreshAccessToken = async () => {
  try {
    console.log('🔄 토큰 갱신 시도 중...');
    const response = await api.post('/auth/refresh');
    const newToken = response.data.token;
    
    localStorage.setItem('token', newToken);
    console.log('✅ 토큰 갱신 성공:', new Date().toLocaleTimeString());
    
    return newToken;
  } catch (error) {
    console.error('❌ 토큰 갱신 실패:', error);
    localStorage.removeItem('token');
    window.location.href = '/auth/login';
    throw error;
  }
};

// 응답 인터셉터 - 토큰 자동 갱신
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // 401 에러이고 아직 재시도하지 않은 경우
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        console.log('🔄 401 에러로 인한 토큰 갱신 시도...');
        const newToken = await refreshAccessToken();
        
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ 토큰 갱신 실패로 로그인 페이지로 이동');
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// 요청 인터셉터 - 토큰 자동 첨부
api.interceptors.request.use(
  async (config) => {
    let token = null;
    try {
      // Pinia store 접근
      const authModule = await import('../stores/auth');
      const authStore = authModule.useAuthStore();
      token = authStore.token;
    } catch (error) {
      // Pinia store 접근 실패 시 localStorage에서 가져오기
      token = localStorage.getItem('token');
    }
    
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
  // 국민임대 자체진단
  async getKookminDiagnosis(diagnosisData) {
    const { data } = await api.post('/self-check/diagnosis/Kookmin', diagnosisData);
    return data;
  },

  // 행복주택 자체진단
  async getHengBokDiagnosis(diagnosisData) {
    const { data } = await api.post('/self-check/diagnosis/HengBok', diagnosisData);
    return data;
  },

  // 공공임대 자체진단
  async getGongGongDiagnosis(diagnosisData) {
    const { data } = await api.post('/self-check/diagnosis/GongGong', diagnosisData);
    return data;
  },

  // 09공공임대 자체진단
  async get09Diagnosis(diagnosisData) {
    const { data } = await api.post('/self-check/diagnosis/09', diagnosisData);
    return data;
  },

  // 기존 자체진단 결과 초기화
  async initializeDiagnosis() {
    const { data } = await api.delete('/self-check/init');
    return data;
  },

  // 진단 내용 저장
  async saveContent(diagnosisData) {
    const { data } = await api.post('/self-check/content/save', diagnosisData);
    return data;
  },

  // 진단 내용 삭제
  async deleteContent() {
    const { data } = await api.delete('/self-check/content/delete');
    return data;
  },

};
