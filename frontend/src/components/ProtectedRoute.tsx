import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/auth';
import type { Role } from '../types/api';
import { Spinner } from './ui';
import ForbiddenPage from '../pages/ForbiddenPage.tsx';

// Penjaga halaman:
// - belum login  → diarahkan ke /login (setara 401)
// - role tidak sesuai → halaman 403
export function ProtectedRoute({ roles, children }: { roles?: Role[]; children: ReactNode }) {
  const { user, checking } = useAuth();
  const location = useLocation();

  if (checking) return <Spinner label="Memeriksa sesi…" />;

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname, reason: 'Kamu perlu masuk dulu untuk membuka halaman ini.' }}
      />
    );
  }

  if (roles && !roles.includes(user.role)) return <ForbiddenPage />;

  return children;
}