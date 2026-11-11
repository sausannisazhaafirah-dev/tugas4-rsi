import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { RefreshCw, Search, Store, X } from 'lucide-react';
import { stallsApi } from '../lib/api';
import { readError } from '../lib/errors';
import { btn, inputClass } from '../lib/styles';
import { StallRow, StallRowSkeleton } from '../components/StallRow';
import type { PageMeta, Stall } from '../types/api';

const LIMIT = 5; // jumlah warung per halaman

export default function StallsPage() {
  // search, kategori, lokasi, dan halaman disimpan di URL (?q=&kategori=&lokasi=&page=)
  // supaya posisi tidak hilang saat kembali dari halaman detail.
  const [params, setParams] = useSearchParams();
  const search = params.get('q') ?? '';
  const category = params.get('kategori') ?? '';
  const location = params.get('lokasi') ?? '';
  const page = Number(params.get('page') ?? '1') || 1;

  const [searchInput, setSearchInput] = useState(search);
  const [stalls, setStalls] = useState<Stall[]>([]);
  const [meta, setMeta] = useState<PageMeta | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  function updateParams(next: { q?: string; kategori?: string; lokasi?: string; page?: number }) {
    const merged = { q: search, kategori: category, lokasi: location, page, ...next };
    const clean = new URLSearchParams();
    if (merged.q) clean.set('q', merged.q);
    if (merged.kategori) clean.set('kategori', merged.kategori);
    if (merged.lokasi) clean.set('lokasi', merged.lokasi);
    if (merged.page > 1) clean.set('page', String(merged.page));
    setParams(clean);
  }

  // Pencarian dikirim 400 ms setelah user berhenti mengetik (tidak request tiap huruf).
  useEffect(() => {
    if (searchInput.trim() === search) return;
    const timer = setTimeout(() => updateParams({ q: searchInput.trim(), page: 1 }), 400);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchInput]);

  // GET /stalls?search=&category=&location=&page=&limit=
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    stallsApi
      .list({ search, category, location, page, limit: LIMIT })
      .then((res) => {
        if (!active) return;
        setStalls(res.data);
        setMeta(res.meta);
      })
      .catch((err) => active && setError(readError(err).message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [search, category, location, page, reloadKey]);

  // Pilihan kategori dan lokasi untuk sidebar, diambil dari data warung di backend.
  useEffect(() => {
    const uniqueSorted = (values: (string | null)[]) =>
      [...new Set(values.filter((v): v is string => !!v))].sort((a, b) => a.localeCompare(b));
    stallsApi
      .list({ limit: 100 })
      .then((res) => {
        setCategories(uniqueSorted(res.data.map((s) => s.category)));
        setLocations(uniqueSorted(res.data.map((s) => s.location)));
      })
      .catch(() => {
        // kalau gagal, sidebar cukup berisi pilihan "Semua"
        setCategories([]);
        setLocations([]);
      });
  }, [reloadKey]);

  const totalPages = meta ? Math.max(1, Math.ceil(meta.total / meta.limit)) : 1;
  const from = meta && meta.total > 0 ? (meta.page - 1) * meta.limit + 1 : 0;
  const to = meta ? Math.min(meta.page * meta.limit, meta.total) : 0;

  const sideItem = (active: boolean) =>
    `flex w-full items-center justify-between rounded-full px-4 py-2 text-left text-sm font-semibold transition ${
      active ? 'bg-brand text-white' : 'text-muted hover:bg-white hover:text-brand-dark'
    }`;

  return (
    <div className="grid gap-8 md:grid-cols-[220px_1fr]">
      <aside className="space-y-6">
        <div>
          <p className="mb-2 px-4 text-sm font-bold text-brand-dark">Lokasi</p>
          {['', ...locations].map((loc) => (
            <button
              key={loc || 'semua'}
              type="button"
              onClick={() => updateParams({ lokasi: loc, page: 1 })}
              className={sideItem(location === loc)}
            >
              {loc || 'Semua lokasi'}
            </button>
          ))}
        </div>
        <div>
          <p className="mb-2 px-4 text-sm font-bold text-brand-dark">Kategori</p>
          {['', ...categories].map((cat) => (
            <button
              key={cat || 'semua'}
              type="button"
              onClick={() => updateParams({ kategori: cat, page: 1 })}
              className={sideItem(category === cat)}
            >
              {cat || 'Semua kategori'}
            </button>
          ))}
        </div>
      </aside>
      <div>
        <section className="relative overflow-hidden rounded-[2rem] bg-brand-soft px-8 py-9">
          <span className="absolute -top-10 right-24 size-40 rounded-full bg-rose-soft" aria-hidden="true" />
          <span className="absolute -right-8 -bottom-14 size-44 rounded-full bg-mint/60" aria-hidden="true" />
          <div className="relative max-w-4xl">
            <h1 className="font-display text-3xl leading-tight text-brand-dark">Mau jajan di warung mana?</h1>
            <p className="mt-2 text-muted">
              Cari warung di kantin kampus, bandingkan rating, lalu lihat detailnya.
            </p>

            <label htmlFor="cari-warung" className="mt-6 mb-2 block text-sm font-semibold text-brand-dark">
              Cari nama warung
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute top-1/2 left-4 size-4.5 -translate-y-1/2 text-muted"
                  aria-hidden="true"
                />
                <input
                  id="cari-warung"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Contoh: bakso, Bu Tini, kedai"
                  className={`${inputClass} border-transparent py-3 pl-11 text-base shadow-sm`}
                />
              </div>
              <button
                type="button"
                onClick={() => setReloadKey((k) => k + 1)}
                className={`${btn.secondary} py-3`}
              >
                <RefreshCw className={`size-4 ${loading ? 'animate-spin' : ''}`} aria-hidden="true" />
                Muat ulang
              </button>
            </div>
            <p className="mt-2 text-xs text-muted">
              Hasil muncul otomatis saat kamu mengetik atau mengganti pilihan.
            </p>
          </div>
        </section>

        <p className="mt-6 mb-3 h-5 text-sm text-muted">
          {!loading &&
            !error &&
            meta &&
            meta.total > 0 &&
            `Menampilkan ${from}–${to} dari ${meta.total} warung${category ? ` kategori ${category}` : ''}${location ? ` di ${location}` : ''}`}
        </p>

        {/* ERROR STATE */}
        {error && (
          <div role="alert" className="rounded-2xl bg-red-50 p-5 text-red-800 ring-1 ring-red-200">
            <p className="font-bold">Gagal memuat warung</p>
            <p className="mt-1 text-sm">{error}</p>
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className={`${btn.secondary} ${btn.small} mt-3`}
            >
              <RefreshCw className="size-3.5" aria-hidden="true" />
              Coba lagi
            </button>
          </div>
        )}

        {/* LOADING STATE */}
        {!error && loading && (
          <ul aria-label="Memuat daftar warung" className="space-y-3">
            {Array.from({ length: LIMIT }, (_, i) => (
              <StallRowSkeleton key={i} />
            ))}
          </ul>
        )}

        {/* EMPTY STATE */}
        {!error && !loading && stalls.length === 0 && (
          <div className="rounded-2xl border-2 border-dashed border-mint bg-white px-6 py-14 text-center">
            <Store className="mx-auto size-8 text-muted" aria-hidden="true" />
            <p className="font-display mt-3 text-lg text-brand-dark">Warung tidak ditemukan</p>
            <p className="mt-1 text-sm text-muted">
              {search ? `Tidak ada warung dengan nama "${search}".` : 'Belum ada warung dengan pilihan ini.'}{' '}
              Coba kata kunci atau kategori lain.
            </p>
            {(search || category || location) && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  setParams(new URLSearchParams());
                }}
                className={`${btn.secondary} ${btn.small} mt-4`}
              >
                <X className="size-3.5" aria-hidden="true" />
                Hapus pencarian
              </button>
            )}
          </div>
        )}

        {/* DATA */}
        {!error && !loading && stalls.length > 0 && (
          <ul className="space-y-3">
            {stalls.map((stall) => (
              <StallRow key={stall.id} stall={stall} />
            ))}
          </ul>
        )}

        {/* PAGINATION */}
        {!error && meta && meta.total > meta.limit && (
          <div className="mt-6 flex items-center justify-between">
            <span className="text-sm text-muted">
              Halaman {page} dari {totalPages}
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                disabled={page <= 1 || loading}
                onClick={() => updateParams({ page: page - 1 })}
                className={`${btn.secondary} ${btn.small}`}
              >
                Sebelumnya
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
                <button
                  key={n}
                  type="button"
                  disabled={loading}
                  onClick={() => updateParams({ page: n })}
                  className={`${n === page ? btn.primary : btn.secondary} ${btn.small} min-w-8`}
                  aria-current={n === page ? 'page' : undefined}
                >
                  {n}
                </button>
              ))}
              <button
                type="button"
                disabled={page >= totalPages || loading}
                onClick={() => updateParams({ page: page + 1 })}
                className={`${btn.secondary} ${btn.small}`}
              >
                Berikutnya
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}