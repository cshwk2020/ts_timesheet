// src/services/authApi.ts
import axiosClient from './axiosClient';
import type { LoginResponse, User } from '../types/auth'; // Adjust import based on your types location

export const loginUser = async (credentials: { email: string; password: string }): Promise<LoginResponse> => {
  const response = await axiosClient.post<LoginResponse>('/login', credentials);
  
  // Save token and user details to localStorage upon successful login
  if (response.data.access_token) {
    localStorage.setItem('access_token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

export const getUserProfile = async (): Promise<User> => {
  const response = await axiosClient.get<User>('/user-profile');
  return response.data;
};

export const logoutUser = async () => {
  try {
    await axiosClient.post('/logout');
  } finally {
    // Always clear storage even if backend fails
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  }
};