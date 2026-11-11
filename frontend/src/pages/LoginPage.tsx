import { useState, type FormEvent } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/auth';
import { readError } from '../lib/errors';
import { btn } from '../lib/styles';
import { AuthShell } from '../components/AuthShell';
import { Alert, Field } from '../components/ui';

interface LoginState {
  from?: string;
  reason?: string;
  registeredEmail?: string;
}

export default function LoginPage() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const state = (useLocation().state ?? {}) as LoginState;

  const [form, setForm] = useState({ email: state.registeredEmail ?? '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Sudah login (dan bukan sedang proses masuk) → tidak perlu melihat halaman ini lagi.
  if (user && !submitting) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    try {
      await login(form);
      // Kembali ke halaman yang tadi ingin dibuka (kalau ada), selain itu ke beranda.
      navigate(state.from ?? '/', { replace: true });
    } catch (err) {
      const { message, fields } = readError(err);
      setError(message); // contoh: "Email atau password salah" (401) atau "Validasi gagal" (400)
      setFieldErrors(fields);
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      heading="Kelola warung kantin dari satu tempat"
      description="Pemilik warung bisa menambah dan mengubah warungnya. Pengunjung bisa melihat daftar warung tanpa perlu masuk."
    >
        <h1 className="font-display text-3xl text-brand-dark">Masuk</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Belum punya akun?{' '}
        <Link to="/register" className="font-medium text-brand hover:underline">
          Daftar di sini
        </Link>
      </p>

      <div className="mb-4 flex flex-col gap-3 empty:hidden">
        {state.registeredEmail && !error && <Alert tone="success">Akun berhasil dibuat. Silakan masuk.</Alert>}
        {state.reason && !error && <Alert tone="info">{state.reason}</Alert>}
        {error && <Alert tone="error">{error}</Alert>}
      </div>

      {/* noValidate: validasi dilakukan backend (zod), pesannya ditampilkan di bawah input */}
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Field
          label="Email"
          name="email"
          type="email"
          autoComplete="email"
          placeholder="nama@kantin.test"
          value={form.email}
          onChange={(email) => setForm({ ...form, email })}
          error={fieldErrors.email}
        />
        <Field
          label="Password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={form.password}
          onChange={(password) => setForm({ ...form, password })}
          error={fieldErrors.password}
        />
        <button type="submit" disabled={submitting} className={`${btn.primary} mt-2 w-full py-2.5`}>
          {submitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {submitting ? 'Memproses…' : 'Masuk'}
        </button>
      </form>

      <p className="mt-6 text-center text-xs">
        <Link to="/" className="text-muted hover:text-ink">
          Kembali ke daftar warung
        </Link>
      </p>
    </AuthShell>
  );
}