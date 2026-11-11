import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';
import { useAuth } from '../context/auth';
import { roleLabel } from '../lib/roles.ts';
import { btn } from '../lib/styles';

export default function ForbiddenPage({ message }: { message?: string }) {
  const { user } = useAuth();
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <div className="mx-auto grid size-16 place-items-center rounded-2xl bg-red-50 text-red-700">
        <Lock className="size-7" aria-hidden="true" />
      </div>
      <p className="mt-5 text-sm font-semibold tracking-wide text-muted">403</p>
      <h1 className="mt-1 text-2xl font-semibold text-brand-dark">Akses ditolak</h1>
      <p className="mt-2 leading-relaxed text-muted">
        {message ??
          `Halaman ini hanya untuk pemilik warung dan admin.${user ? ` Akunmu terdaftar sebagai ${roleLabel[user.role]}.` : ''}`}
      </p>
      <Link to="/" className={`${btn.primary} mt-6`}>
        Kembali ke daftar warung
      </Link>
    </div>
  );
}