import axios from 'axios';

export interface User {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
}

export interface UserPayload {
  nome: string;
  sobrenome: string;
  email: string;
  senha?: string;
}

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const login = (data: URLSearchParams) =>
  apiClient.post('/token', data, {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  });

export const getUsers = () => apiClient.get<User[]>('/users/');
export const createUser = (data: UserPayload) => apiClient.post('/users/', data);

export const updateUser = (id: number, data: UserPayload) => apiClient.put(`/users/${id}`, data);
export const deleteUser = (id: number) => apiClient.delete(`/users/${id}`);