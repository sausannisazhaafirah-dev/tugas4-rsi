import { useEffect, useState, type FormEvent } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { stallsApi } from '../lib/api';
import { readError } from '../lib/errors';
import { canEditStall } from '../lib/roles';
import { btn } from '../lib/styles';
import { useAuth } from '../context/auth';
import { Alert, Field, Spinner } from '../components/ui';
import type { StallInput } from '../types/api';

const emptyForm = { name: '', category: '', location: '', description: '' };

// Satu form untuk dua keperluan:
// /kelola/baru       → POST /stalls (tambah)
// /kelola/:id/ubah   → PUT /stalls/:id (ubah)
export default function StallFormPage() {
  const { id } = useParams();
  const isEdit = id !== undefined;
  const stallId = Number(id);
  const navigate = useNavigate();
  const { user } = useAuth();

  const [form, setForm] = useState(emptyForm);
  const [notOwned, setNotOwned] = useState(false);
  const [loading, setLoading] = useState(isEdit);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [error, setError] = useState<{ status: number; message: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Mode ubah: isi form dengan data lama dari GET /stalls/:id
  useEffect(() => {
    if (!isEdit) return;
    let active = true;
    stallsApi
      .get(stallId)
      .then((stall) => {
        if (!active) return;
        setForm({
          name: stall.name,
          category: stall.category ?? '',
          location: stall.location ?? '',
          description: stall.description ?? '',
        });
        setNotOwned(!canEditStall(user, stall));
      })
      .catch((err) => active && setLoadError(readError(err).message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [isEdit, stallId, user]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setFieldErrors({});

    // Kolom opsional yang dikosongkan dikirim sebagai null.
    const body: StallInput = {
      name: form.name,
      category: form.category.trim() || null,
      location: form.location.trim() || null,
      description: form.description.trim() || null,
    };

    try {
      const saved = isEdit ? await stallsApi.update(stallId, body) : await stallsApi.create(body);
      navigate('/kelola', {
        state: { notice: `Warung "${saved.name}" ${isEdit ? 'diperbarui' : 'ditambahkan'}` },
      });
    } catch (err) {
      const { status, message, fields } = readError(err);
      setError({ status, message }); // 400 validasi, 403 bukan pemilik, 404 tidak ada
      setFieldErrors(fields);
      setSubmitting(false);
    }
  }

  const set = (key: keyof typeof emptyForm) => (value: string) => setForm({ ...form, [key]: value });

  return (
    <div className="mx-auto max-w-2xl">
      <Link
        to="/kelola"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted hover:text-brand-dark"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Kembali ke kelola warung
      </Link>

      <h1 className="font-display mt-4 text-3xl text-brand-dark">
        {isEdit ? 'Ubah warung' : 'Tambah warung'}
      </h1>
      <p className="mt-1 text-muted">
        {isEdit
          ? 'Perbarui data warung, lalu simpan.'
          : 'Isi data warung baru. Pemilik warung otomatis akunmu.'}
      </p>

      {loading && <Spinner label="Memuat data warung…" />}
      {loadError && (
        <div className="mt-6">
          <Alert tone="error">{loadError}</Alert>
        </div>
      )}

      {!loading && !loadError && (
        <form
          onSubmit={handleSubmit}
          noValidate
          className="mt-6 space-y-4 rounded-3xl bg-white p-7 ring-1 ring-line"
        >
          {notOwned && (
            <Alert tone="info">
              Warung ini milik pemilik lain. Server hanya mengizinkan pemiliknya atau admin untuk mengubahnya.
            </Alert>
          )}
          {error && (
            <Alert tone="error">
              {error.status === 403 && <strong>Akses ditolak (403). </strong>}
              {error.message}
            </Alert>
          )}

          <Field
            label="Nama warung"
            name="name"
            placeholder="Contoh: Warung Bu Tini"
            value={form.name}
            onChange={set('name')}
            error={fieldErrors.name}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Kategori"
              name="category"
              placeholder="Contoh: Nasi"
              value={form.category}
              onChange={set('category')}
              error={fieldErrors.category}
            />
            <Field
              label="Lokasi"
              name="location"
              placeholder="Contoh: Kantin FEB"
              value={form.location}
              onChange={set('location')}
              error={fieldErrors.location}
            />
          </div>
          <Field
            label="Deskripsi"
            name="description"
            placeholder="Contoh: Nasi rames dan lauk rumahan"
            value={form.description}
            onChange={set('description')}
            error={fieldErrors.description}
            multiline
          />

          <div className="flex justify-end gap-2 pt-2">
            <Link to="/kelola" className={btn.secondary}>
              Batal
            </Link>
            <button type="submit" disabled={submitting} className={btn.primary}>
              {submitting && <Loader2 className="size-4 animate-spin" aria-hidden="true" />}
              {isEdit ? 'Simpan perubahan' : 'Tambah warung'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}