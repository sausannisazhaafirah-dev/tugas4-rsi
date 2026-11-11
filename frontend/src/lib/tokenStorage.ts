// Token JWT disimpan di localStorage supaya sesi tetap ada setelah halaman di-refresh.
const KEY = 'lapak_kantin_token';

export const tokenStorage = {
  get: (): string | null => localStorage.getItem(KEY),
  set: (token: string): void => localStorage.setItem(KEY, token),
  clear: (): void => localStorage.removeItem(KEY),
};