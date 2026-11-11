import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Pencil, Plus, RefreshCw, Store, Trash2 } from 'lucide-react';
import { stallsApi } from '../lib/api';
import { readError } from '../lib/errors';
import { canDeleteStall, canEditStall } from '../lib/roles';
import { btn } from '../lib/styles';
import { useAuth } from '../context/auth';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Alert, Spinner } from '../components/ui';
import type { Stall } from '../types/api';

// Halaman kelola warung untuk owner dan admin.
// Owner: tambah warung, ubah warung miliknya. Admin: tambah, ubah, dan hapus semua warung.
export default function ManageStallsPage() {
  const { user } = useAuth();
  const notice = (useLocation().state as { notice?: string } | null)?.notice;

  const [stalls, setStalls] = useState<Stall[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [onlyMine, setOnlyMine] = useState(user?.role === 'owner');

  const [toDelete, setToDelete] = useState<Stall | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);
  const [deletedName, setDeletedName] = useState<string | null>(null);

  // GET /stalls?limit=100 (backend membatasi maksimal 100 per halaman)
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    stallsApi
      .list({ limit: 100 })
      .then((res) => active && setStalls(res.data))
      .catch((err) => active && setError(readError(err).message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [reloadKey]);

  // DELETE /stalls/:id (hanya admin)
  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    setDeleteError(null);
    try {
      await stallsApi.remove(toDelete.id);
      setDeletedName(toDelete.name);
      setToDelete(null);
      setReloadKey((k) => k + 1); // muat ulang daftar dari backend
    } catch (err) {
      setDeleteError(readError(err).message);
    } finally {
      setDeleting(false);
    }
  }

  const shown = onlyMine ? stalls.filter((s) => s.ownerId === user?.id) : stalls;

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl text-brand-dark">Kelola warung</h1>
          <p className="mt-1 text-muted">
            {user?.role === 'admin'
              ? 'Sebagai admin, kamu bisa menambah, mengubah, dan menghapus semua warung.'
              : 'Tambah warung baru atau ubah warung milikmu.'}
          </p>
        </div>
        <Link to="/kelola/baru" className={btn.primary}>
          <Plus className="size-4" aria-hidden="true" />
          Tambah warung
        </Link>
      </div>

      <div className="mt-5 space-y-3 empty:hidden">
        {notice && !deletedName && <Alert tone="success">{notice}</Alert>}
        {deletedName && <Alert tone="success">Warung "{deletedName}" dihapus</Alert>}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        {user?.role === 'owner' ? (
          <div className="flex gap-1 rounded-full bg-white p-1 ring-1 ring-line">
            {[
              { value: true, label: 'Warung milikku' },
              { value: false, label: 'Semua warung' },
            ].map((opt) => (
              <button
                key={opt.label}
                type="button"
                onClick={() => setOnlyMine(opt.value)}
                aria-pressed={onlyMine === opt.value}
                className={`rounded-full px-4 py-1.5 text-sm font-semibold transition ${
                  onlyMine === opt.value ? 'bg-brand text-white' : 'text-muted hover:text-brand-dark'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        ) : (
          <span className="text-sm text-muted">
            {!loading && !error && `${stalls.length} warung terdaftar`}
          </span>
        )}
        <button
          type="button"
          onClick={() => setReloadKey((k) => k + 1)}
          className={`${btn.secondary} ${btn.small}`}
        >
          <RefreshCw className={`size-3.5 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
          Muat ulang
        </button>
      </div>

      <div className="mt-4">
        {loading && <Spinner label="Memuat warung…" />}
        {!loading && error && <Alert tone="error">{error}</Alert>}

        {!loading && !error && shown.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-mint bg-white px-6 py-14 text-center">
            <Store className="mx-auto size-8 text-muted" aria-hidden="true" />
            <p className="font-display mt-3 text-lg text-brand-dark">Belum ada warung</p>
            <p className="mt-1 text-sm text-muted">Tambahkan warung pertamamu supaya muncul di daftar.</p>
            <Link to="/kelola/baru" className={`${btn.primary} mt-4`}>
              <Plus className="size-4" aria-hidden="true" />
              Tambah warung
            </Link>
          </div>
        )}

        {!loading && !error && shown.length > 0 && (
          <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-line">
            <table className="w-full text-sm">
              <thead className="bg-brand-soft/60 text-left text-xs text-muted">
                <tr>
                  <th className="px-5 py-3 font-semibold">Nama warung</th>
                  <th className="px-5 py-3 font-semibold">Kategori</th>
                  <th className="px-5 py-3 font-semibold">Lokasi</th>
                  <th className="px-5 py-3 text-right font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-line">
                {shown.map((stall) => {
                  const editable = canEditStall(user, stall);
                  return (
                    <tr key={stall.id}>
                      <td className="px-5 py-3.5">
                        <Link
                          to={`/warung/${stall.id}`}
                          className="font-semibold text-brand-dark hover:text-brand"
                        >
                          {stall.name}
                        </Link>
                        {stall.ownerId === user?.id && (
                          <span className="ml-2 rounded-full bg-rose-soft px-2 py-0.5 text-xs font-semibold text-rose">
                            milikmu
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 text-muted">{stall.category ?? '-'}</td>
                      <td className="px-5 py-3.5 text-muted">{stall.location ?? '-'}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex justify-end gap-2">
                          {editable ? (
                            <Link to={`/kelola/${stall.id}/ubah`} className={`${btn.secondary} ${btn.small}`}>
                              <Pencil className="size-3.5" aria-hidden="true" />
                              Ubah
                            </Link>
                          ) : (
                            <span className="py-1.5 text-xs text-muted">Bukan milikmu</span>
                          )}
                          {canDeleteStall(user) && (
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteError(null);
                                setToDelete(stall);
                              }}
                              className={`${btn.danger} ${btn.small}`}
                            >
                              <Trash2 className="size-3.5" aria-hidden="true" />
                              Hapus
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {toDelete && (
        <ConfirmDialog
          title="Hapus warung?"
          message={`Warung "${toDelete.name}" akan dihapus dari database dan tidak bisa dikembalikan.`}
          confirmLabel="Hapus warung"
          busy={deleting}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={() => setToDelete(null)}
        />
      )}
    </div>
  );
}