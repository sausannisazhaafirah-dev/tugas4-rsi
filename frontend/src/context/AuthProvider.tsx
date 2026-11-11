import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { authApi } from '../lib/api';
import { setUnauthorizedHandler } from '../lib/http';
import { tokenStorage } from '../lib/tokenStorage';
import type { LoginInput, RegisterInput, User } from '../types/api';
import { AuthContext, type AuthContextValue } from './auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  // Kalau ada token tersimpan, cek dulu ke backend sebelum menampilkan halaman terlindungi.
  const [checking, setChecking] = useState(() => tokenStorage.get() !== null);

  // Kalau backend membalas 401 (token kedaluwarsa), user dianggap keluar.
  useEffect(() => {
    setUnauthorizedHandler(() => setUser(null));
    return () => setUnauthorizedHandler(null);
  }, []);

  // Saat aplikasi dibuka: token lama divalidasi lewat GET /auth/me.
  useEffect(() => {
    if (!tokenStorage.get()) return;
    authApi
      .me()
      .then(setUser)
      .catch(() => {
        tokenStorage.clear();
        setUser(null);
      })
      .finally(() => setChecking(false));
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      checking,
      login: async (input: LoginInput) => {
        const result = await authApi.login(input); // POST /auth/login
        tokenStorage.set(result.token);
        setUser(result.user);
        return result.user;
      },
      register: (input: RegisterInput) => authApi.register(input), // POST /auth/register
      // Backend memakai JWT stateless (tidak ada endpoint logout),
      // jadi logout = token dihapus dari browser.
      logout: () => {
        tokenStorage.clear();
        setUser(null);
      },
    }),
    [user, checking],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}