import { http } from './http';
import type {
  MenuItem,
  ApiList,
  ApiSuccess,
  LoginInput,
  LoginResult,
  RegisterInput,
  Stall,
  StallInput,
  StallQuery,
  User,
} from '../types/api';

// Semua request ke backend dikumpulkan di file ini, supaya mudah dicari dan dirawat.

export const authApi = {
  register: (input: RegisterInput) =>
    http.post<ApiSuccess<{ user: User }>>('/auth/register', input).then((res) => res.data.data.user),

  login: (input: LoginInput) =>
    http.post<ApiSuccess<LoginResult>>('/auth/login', input).then((res) => res.data.data),

  me: () => http.get<ApiSuccess<User>>('/auth/me').then((res) => res.data.data),
};

export const stallsApi = {
  // Query parameter: search, category, page, limit. Nilai kosong tidak dikirim.
  list: (query: StallQuery = {}) => {
    const params = Object.fromEntries(
      Object.entries(query).filter(([, value]) => value !== undefined && value !== ''),
    );
    return http.get<ApiList<Stall>>('/stalls', { params }).then((res) => res.data);
  },

  // Path parameter: id warung.
  get: (id: number) => http.get<ApiSuccess<Stall>>(`/stalls/${id}`).then((res) => res.data.data),

    // Menu sebuah warung (endpoint sudah ada di backend, hanya dibaca).
  menus: (id: number) => http.get<ApiSuccess<MenuItem[]>>(`/stalls/${id}/menus`).then((res) => res.data.data),
  
  create: (input: StallInput) =>
    http.post<ApiSuccess<Stall>>('/stalls', input).then((res) => res.data.data),

  update: (id: number, input: StallInput) =>
    http.put<ApiSuccess<Stall>>(`/stalls/${id}`, input).then((res) => res.data.data),

  remove: (id: number) => http.delete(`/stalls/${id}`).then(() => undefined),
};