import { Link, NavLink, Outlet } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/auth';
import { canManageStalls, roleLabel } from '../lib/roles';
import { initials } from '../lib/format';
import { btn } from '../lib/styles';
import { Logo } from './Logo';

const navClass = ({ isActive }: { isActive: boolean }) =>
  `rounded-full px-4 py-2 text-sm font-semibold transition ${
    isActive ? 'bg-brand-soft text-brand-dark' : 'text-muted hover:text-ink'
  }`;

export function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-line bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-3.5">
          <div className="flex items-center gap-8">
            <Link to="/">
              <Logo />
            </Link>
            <nav className="flex gap-1">
              <NavLink to="/" end className={navClass}>
                Warung
              </NavLink>
              {/* Menu Kelola hanya muncul untuk owner dan admin */}
              {canManageStalls(user) && (
                <NavLink to="/kelola" className={navClass}>
                  Kelola
                </NavLink>
              )}
            </nav>
          </div>

          {user ? (
            <div className="flex items-center gap-3">
              <Link to="/akun" className="flex items-center gap-2.5 rounded-full py-1 pr-3 pl-1 hover:bg-brand-soft">
                <span className="grid size-9 place-items-center rounded-full bg-rose-soft text-xs font-bold text-rose">
                  {initials(user.name)}
                </span>
                <span className="text-left leading-tight">
                  <span className="block text-sm font-semibold">{user.name}</span>
                  <span className="block text-xs text-muted">{roleLabel[user.role]}</span>
                </span>
              </Link>
              <button type="button" onClick={logout} className={`${btn.secondary} ${btn.small}`}>
                <LogOut className="size-3.5" aria-hidden="true" />
                Keluar
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Link to="/login" className={btn.secondary}>
                Masuk
              </Link>
              <Link to="/register" className={btn.primary}>
                Daftar
              </Link>
            </div>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">
        <Outlet />
      </main>

      <footer className="border-t border-line bg-white">
        <div className="mx-auto flex max-w-6xl justify-between px-6 py-5 text-xs text-muted">
          <span>Lapak Kantin, Tugas 4 Praktikum RSI</span>
          <span>{user ? `Masuk sebagai ${roleLabel[user.role]}` : 'Belum masuk'}</span>
        </div>
      </footer>
    </div>
  );
}