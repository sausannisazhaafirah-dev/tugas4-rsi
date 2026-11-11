import axios, { type AxiosError } from 'axios';
import { tokenStorage } from './tokenStorage';
import type { FieldError } from '../types/api';

// Satu instance Axios untuk seluruh aplikasi.
// Base URL diambil dari .env, jadi alamat backend cukup diubah di satu tempat.
export const http = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Error yang sudah dirapikan: status code, pesan dari backend, dan error per field (zod).
export class ApiError extends Error {
  status: number;
  errors: FieldError[];

  constructor(status: number, message: string, errors: FieldError[] = []) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

// Dipanggil saat token ditolak backend (401), diisi oleh AuthContext.
let onUnauthorized: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null): void {
  onUnauthorized = handler;
}

// REQUEST: tempelkan token JWT ke header Authorization (sesuai backend Tugas 3).
http.interceptors.request.use((config) => {
  const token = tokenStorage.get();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// RESPONSE: ubah semua error menjadi ApiError dengan format yang sama.
http.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; errors?: FieldError[] }>) => {
    // Tidak ada respons sama sekali = backend mati / jaringan putus.
    if (!error.response) {
      return Promise.reject(
        new ApiError(0, 'Tidak dapat terhubung ke server. Pastikan backend sudah berjalan.'),
      );
    }

    const { status, data } = error.response;
    const message = data?.message ?? 'Terjadi kesalahan pada server';

    // 401 di luar endpoint login = token hilang/kedaluwarsa → sesi diakhiri.
    const isLoginRequest = error.config?.url?.includes('/auth/login') ?? false;
    if (status === 401 && !isLoginRequest) {
      tokenStorage.clear();
      onUnauthorized?.();
    }

    return Promise.reject(new ApiError(status, message, data?.errors ?? []));
  },
);