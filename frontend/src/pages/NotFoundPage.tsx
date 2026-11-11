import { Link } from 'react-router-dom';
import { btn } from '../lib/styles';

export default function NotFoundPage() {
  return (
    <div className="mx-auto max-w-md py-16 text-center">
      <p className="text-sm font-semibold tracking-wide text-muted">404</p>
      <h1 className="mt-1 text-2xl font-semibold text-brand-dark">Halaman tidak ditemukan</h1>
      <p className="mt-2 text-muted">Alamat yang kamu buka tidak ada.</p>
      <Link to="/" className={`${btn.primary} mt-6`}>
        Kembali ke daftar warung
      </Link>
    </div>
  );
}