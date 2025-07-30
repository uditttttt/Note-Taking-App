import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Interceptor to add the JWT token to every request
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;