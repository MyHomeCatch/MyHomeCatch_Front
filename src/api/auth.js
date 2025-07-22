import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/api/auth',
  headers: {
    'Content-Type': 'application/json',
  },
});

export const loginRequest = (payload) => {
  return api.post('/login', payload);
};

export const checkEmailRequest = (email) => {
  return api.get('/check-email', {params: {email}});
};

export const checkNicknameRequest = (nickname) => {
  return api.get('/check-nickname', {params: {nickname}});
};