import axios from 'axios';

const api = axios.create({
  baseURL: 'https://note-taking-app-6jq8.onrender.com',
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
