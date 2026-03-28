import axios from 'axios';
import { getStoredUser } from '@/features/auth/authStore';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

apiClient.interceptors.request.use((config) => {
  const user = getStoredUser();
  if (user?.id) config.headers['x-user-id'] = user.id;
  return config;
});

export default apiClient;
