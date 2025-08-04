import 'bootstrap/dist/css/bootstrap.css';
import 'vue-awesome-paginate/dist/style.css';

import { createApp } from 'vue';
import { createPinia } from 'pinia';
import VueAwesomePaginate from 'vue-awesome-paginate';

import App from './App.vue';
import router from './router';
import authApi from './api/auth';

const app = createApp(App);

app.use(VueAwesomePaginate);
app.use(createPinia());
app.use(router);

// 앱 시작 시 기존 토큰이 있다면 토큰 갱신 스케줄링 시작
const token = localStorage.getItem('token');
if (token) {
  console.log('앱 시작 시 기존 토큰 발견, 토큰 갱신 스케줄링 시작');
  authApi.startTokenRefresh();
}

app.mount('#app');
