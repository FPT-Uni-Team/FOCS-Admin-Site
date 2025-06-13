import axiosClient from '../api/axiosClient';
import endpoints from '../api/endpoint';

export const login = async (data: { email: string; password: string }) => {
  return axiosClient.post(endpoints.auth.login(), data);
};

export const refreshToken = async () => {
  const refresh_token = localStorage.getItem('refreshToken');
  if (!refresh_token) {
    throw new Error('No refresh token available');
  }
  return axiosClient.post('/auth/refresh', { refresh_token });
}; 