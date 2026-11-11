import { useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { authApi } from '../lib/api';
import { readError } from '../lib/errors';
import { roleLabel } from '../lib/roles.ts';
import { initials } from '../lib/format';
import { btn } from '../lib/styles';
import { Alert, Spinner } from '../components/ui';
import type { User } from '../types/api';

// Informasi pengguna yang sedang login, diambil langsung dari GET /auth/me.
export default function AccountPage() {
  const [me, setMe] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let active = true;
    authApi
      .me()
      .then((data) => active && setMe(data))
      .catch((err) => active && setError(readError(err).message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [reloadKey]);

  function reload() {
    setLoading(true);
    setError(null);
    setReloadKey((key) => key + 1);
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-brand-dark">Akun saya</h1>
          <p className="mt-1 text-muted">Data akun yang sedang masuk.</p>
        </div>
        <button type="button" onClick={reload} className={btn.secondary}>
          <RefreshCw className="size-4" aria-hidden="true" />
          Muat ulang
        </button>
      </div>

      {loading && <Spinner label="Mengambil data akun…" />}
      {!loading && error && <Alert tone="error">{error}</Alert>}
      {!loading && me && (
        <div className="rounded-xl border border-line bg-white p-6">
          <div className="flex items-center gap-4">
            <span className="grid size-14 place-items-center rounded-full bg-brand text-lg font-semibold text-white">
              {initials(me.name)}
            </span>
            <div>
              <p className="text-lg font-semibold">{me.name}</p>
              <p className="text-sm text-muted">{me.email}</p>
            </div>
            <span className="ml-auto rounded-md bg-brand-soft px-2.5 py-1 text-xs font-medium text-brand-dark">
              {roleLabel[me.role]}
            </span>
          </div>
          <dl className="mt-6 grid grid-cols-2 gap-y-3 border-t border-line pt-4 text-sm">
            <dt className="text-muted">ID pengguna</dt>
            <dd className="text-right font-medium">#{me.id}</dd>
            <dt className="text-muted">Role</dt>
            <dd className="text-right font-medium">{me.role}</dd>
          </dl>
        </div>
      )}
    </div>
  );
}