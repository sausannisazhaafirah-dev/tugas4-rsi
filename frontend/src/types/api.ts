// Bentuk data yang dikirim backend (Tugas 2–3). Disamakan dengan DTO di backend.

export type Role = 'admin' | 'owner' | 'customer';

export interface User {
  id: number;
  name: string;
  email: string;
  role: Role;
}

export interface Stall {
  id: number;
  ownerId: number;
  name: string;
  category: string | null;
  location: string | null;
  description: string | null;
  avgRating: number;
  reviewCount: number;
  isPopular: boolean;
}

// Respons sukses: { status: 'success', data }
export interface ApiSuccess<T> {
  status: 'success';
  data: T;
}

// Respons daftar dengan pagination: { status, meta: { page, limit, total }, data }
export interface PageMeta {
  page: number;
  limit: number;
  total: number;
}

export interface ApiList<T> extends ApiSuccess<T[]> {
  meta: PageMeta;
}

// Respons gagal dari errorHandler backend: { status: 'fail', message, errors? }
export interface FieldError {
  field: string;
  message: string;
}

export interface LoginResult {
  token: string;
  tokenType: 'Bearer';
  expiresIn: string;
  user: User;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface StallInput {
  name: string;
  category?: string | null;
  location?: string | null;
  description?: string | null;
}

export interface StallQuery {
  search?: string;
  category?: string;
  location?: string;
  page?: number;
  limit?: number;
}