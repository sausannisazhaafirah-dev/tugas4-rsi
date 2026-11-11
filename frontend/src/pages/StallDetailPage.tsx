import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Heart, MapPin, Pencil, RefreshCw, Star, Trash2 } from 'lucide-react';
import { stallsApi } from '../lib/api';
import { readError } from '../lib/errors';
import { rupiah } from '../lib/format';
import { canDeleteStall, canEditStall } from '../lib/roles';
import { btn } from '../lib/styles';
import { useAuth } from '../context/auth';
import { ConfirmDialog } from '../components/ConfirmDialog';
import { Alert, Spinner } from '../components/ui';
import type { MenuItem, Stall } from '../types/api';

export default function StallDetailPage() {
  const { id } = useParams(); // path parameter: /warung/:id
  const stallId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [stall, setStall] = useState<Stall | null>(null);
  const [error, setError] = useState<{ status: number; message: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  const [menus, setMenus] = useState<MenuItem[] | null>(null);
  const [menuError, setMenuError] = useState<string | null>(null);

  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  // GET /stalls/:id
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    stallsApi
      .get(stallId)
      .then((data) => active && setStall(data))
      .catch((err) => {
        if (!active) return;
        const { status, message } = readError(err);
        setError({ status, message });
      })
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [stallId, reloadKey]);

  // GET /stalls/:id/menus (tambahan, hanya ditampilkan)
  useEffect(() => {
    let active = true;
    stallsApi
      .menus(stallId)
      .then((data) => active && setMenus(data))
      .catch((err) => active && setMenuError(readError(err).message));
    return () => {
      active = false;
    };
  }, [stallId, reloadKey]);

  // DELETE /stalls/:id (hanya admin)
  async function handleDelete() {
    setDeleting(true);
    setDeleteError(null);
    try {
      await stallsApi.remove(stallId);
      navigate('/kelola', { replace: true, state: { notice: `Warung "${stall?.name}" dihapus` } });
    } catch (err) {
      setDeleteError(readError(err).message); // contoh: 403 bila bukan admin
      setDeleting(false);
    }
  }

  if (loading) return <Spinner label="Memuat detail warung…" />;

  if (error) {
    return (
      <div className="mx-auto max-w-lg py-10 text-center">
        <p className="text-sm font-semibold text-muted">{error.status || 'Gagal'}</p>
        <h1 className="font-display mt-1 text-2xl text-brand-dark">
          {error.status === 404 ? 'Warung tidak ditemukan' : 'Gagal memuat warung'}
        </h1>
        <p className="mt-2 text-muted">{error.message}</p>
        <div className="mt-6 flex justify-center gap-2">
          <Link to="/" className={btn.secondary}>
            <ArrowLeft className="size-4" aria-hidden="true" />
            Kembali ke daftar
          </Link>
          {error.status !== 404 && (
            <button type="button" onClick={() => setReloadKey((k) => k + 1)} className={btn.primary}>
              <RefreshCw className="size-4" aria-hidden="true" />
              Coba lagi
            </button>
          )}
        </div>
      </div>
    );
  }

  if (!stall) return null;

  const editable = canEditStall(user, stall);
  const deletable = canDeleteStall(user);

  return (
    <div>
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-brand-dark"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Kembali
      </button>

      {/* Kepala halaman */}
      <section className="relative mt-4 overflow-hidden rounded-[2rem] bg-brand-soft px-8 py-9">
        <span className="absolute -top-12 right-20 size-44 rounded-full bg-rose-soft" aria-hidden="true" />
        <div className="relative flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="flex flex-wrap gap-2">
              {stall.category && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-brand-dark">
                  {stall.category}
                </span>
              )}
              {stall.isPopular && (
                <span className="inline-flex items-center gap-1 rounded-full bg-rose-soft px-3 py-1 text-xs font-semibold text-rose ring-1 ring-rose/20">
                  <Heart className="size-3 fill-rose" aria-hidden="true" />
                  Populer
                </span>
              )}
            </div>
            <h1 className="font-display mt-3 text-4xl leading-tight text-brand-dark">{stall.name}</h1>
            <p className="mt-2 inline-flex items-center gap-1.5 text-muted">
              <MapPin className="size-4" aria-hidden="true" />
              {stall.location ?? 'Lokasi belum diisi'}
            </p>
          </div>

          {(editable || deletable) && (
            <div className="flex gap-2">
              {editable && (
                <Link to={`/kelola/${stall.id}/ubah`} className={btn.secondary}>
                  <Pencil className="size-4" aria-hidden="true" />
                  Ubah warung
                </Link>
              )}
              {deletable && (
                <button type="button" onClick={() => setConfirmDelete(true)} className={btn.danger}>
                  <Trash2 className="size-4" aria-hidden="true" />
                  Hapus
                </button>
              )}
            </div>
          )}
        </div>
      </section>

      <div className="mt-6 grid gap-6 md:grid-cols-[1fr_280px]">
        <div className="space-y-6">
          <section className="rounded-2xl bg-white p-6 ring-1 ring-line">
            <h2 className="font-display text-lg text-brand-dark">Tentang warung</h2>
            <p className="mt-2 leading-relaxed text-ink">
              {stall.description ?? 'Pemilik belum menambahkan deskripsi.'}
            </p>
          </section>

          <section className="rounded-2xl bg-white p-6 ring-1 ring-line">
            <h2 className="font-display text-lg text-brand-dark">Menu</h2>
            {menuError && (
              <div className="mt-3">
                <Alert tone="error">{menuError}</Alert>
              </div>
            )}
            {!menuError && menus === null && <Spinner label="Memuat menu…" />}
            {menus && menus.length === 0 && (
              <p className="mt-2 text-sm text-muted">Warung ini belum mencantumkan menu.</p>
            )}
            {menus && menus.length > 0 && (
              <ul className="mt-3 divide-y divide-line">
                {menus.map((menu) => (
                  <li key={menu.id} className="flex items-center justify-between gap-4 py-3">
                    <span
                      className={`font-semibold ${menu.isAvailable ? 'text-ink' : 'text-muted line-through'}`}
                    >
                      {menu.name}
                    </span>
                    <span className="flex items-center gap-3">
                      <span className="text-sm text-muted">{rupiah(menu.price)}</span>
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                          menu.isAvailable ? 'bg-brand-soft text-brand-dark' : 'bg-rose-soft text-rose'
                        }`}
                      >
                        {menu.isAvailable ? 'Tersedia' : 'Habis'}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <aside className="h-fit rounded-2xl bg-white p-6 ring-1 ring-line">
          <p className="text-sm text-muted">Rating rata-rata</p>
          <p className="mt-1 flex items-center gap-2 text-4xl font-bold text-ink">
            <Star className="size-7 fill-rose text-rose" aria-hidden="true" />
            {stall.avgRating.toFixed(1)}
          </p>
          <p className="mt-1 text-sm text-muted">
            {stall.reviewCount > 0 ? `Dari ${stall.reviewCount} review pelanggan` : 'Belum ada review'}
          </p>
          <dl className="mt-5 space-y-2 border-t border-line pt-4 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">ID warung</dt>
              <dd className="font-semibold">#{stall.id}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted">Kategori</dt>
              <dd className="font-semibold">{stall.category ?? '-'}</dd>
            </div>
          </dl>
        </aside>
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Hapus warung?"
          message={`Warung "${stall.name}" akan dihapus dari database dan tidak bisa dikembalikan.`}
          confirmLabel="Hapus warung"
          busy={deleting}
          error={deleteError}
          onConfirm={handleDelete}
          onCancel={() => {
            setConfirmDelete(false);
            setDeleteError(null);
          }}
        />
      )}
    </div>
  );
}