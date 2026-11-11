import { createContext, useContext } from 'react';
import type { LoginInput, RegisterInput, User } from '../types/api';

export interface AuthContextValue {
  user: User | null; // null = belum login
  checking: boolean; // true selama token lama sedang dicek ke GET /auth/me
  login: (input: LoginInput) => Promise<User>;
  register: (input: RegisterInput) => Promise<User>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}