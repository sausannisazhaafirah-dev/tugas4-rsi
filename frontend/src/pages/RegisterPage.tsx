import { useState, type FormEvent } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useAuth } from '../context/auth';
import { readError } from '../lib/errors';
import { btn } from '../lib/styles';
import { AuthShell } from '../components/AuthShell';
import { Alert, Field } from '../components/ui';

export default function RegisterPage() {
  const { user, register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});
    try {
      const created = await register(form); // POST /auth/register → 201
      navigate('/login', { state: { registeredEmail: created.email } });
    } catch (err) {
      const { message, fields } = readError(err);
      setError(message); // contoh: "Email sudah terdaftar" (409)
      setFieldErrors(fields);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <AuthShell
      heading="Buat akun baru"
      description="Akun yang mendaftar sendiri otomatis menjadi pelanggan. Akun pemilik warung dan admin dibuat oleh pengelola kantin."
    >
        <h1 className="font-display text-3xl text-brand-dark">Daftar</h1>
      <p className="mt-1 mb-6 text-sm text-muted">
        Sudah punya akun?{' '}
        <Link to="/login" className="font-medium text-brand hover:underline">
          Masuk
        </Link>
      </p>

      {error && (
        <div className="mb-4">
          <Alert tone="error">{error}</Alert>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
        <Field
          label="Nama"
          name="name"
          autoComplete="name"
          placeholder="Nama lengkap"
          value={form.name}
          onChange={(name) => setForm({ ...form, name })}
          error={fieldErrors.name}
        />
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
          autoComplete="new-password"
          placeholder="Minimal 8 karakter"
          value={form.password}
          onChange={(password) => setForm({ ...form, password })}
          error={fieldErrors.password}
        />
        <button type="submit" disabled={submitting} className={`${btn.primary} mt-2 w-full py-2.5`}>
          {submitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
          {submitting ? 'Memproses…' : 'Daftar'}
        </button>
      </form>
    </AuthShell>
  );
}