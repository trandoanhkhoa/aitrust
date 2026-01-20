import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'https://aitrustapi-production.up.railway.app/api',
  timeout: 20000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});
//Interceptor before send request to API
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    Promise.reject(error);
  },
);
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('❌ API Error:', error);
    return Promise.reject(error);
  },
);
export default axiosClient;
