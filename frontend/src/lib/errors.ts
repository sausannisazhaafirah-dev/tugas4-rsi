import { ApiError } from './http';

// Mengubah error apa pun menjadi { status, message, fields } supaya mudah ditampilkan di UI.
// fields berisi pesan validasi per input, contoh: { email: 'format email tidak valid' }.
export function readError(err: unknown) {
  if (err instanceof ApiError) {
    const fields: Record<string, string> = {};
    for (const item of err.errors) {
      if (!fields[item.field]) fields[item.field] = item.message;
    }
    return { status: err.status, message: err.message, fields };
  }
  return { status: 0, message: 'Terjadi kesalahan yang tidak terduga', fields: {} as Record<string, string> };
}