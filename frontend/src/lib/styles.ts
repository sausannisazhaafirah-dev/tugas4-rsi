// Kelas Tailwind yang dipakai berulang, supaya tampilan tombol dan input konsisten.
const base =
  'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60';

export const btn = {
  primary: `${base} bg-brand text-white hover:bg-brand-hover`,
  secondary: `${base} border border-line bg-white text-ink hover:bg-brand-soft`,
  danger: `${base} border border-red-200 bg-white text-red-700 hover:bg-red-50`,
  dangerSolid: `${base} bg-red-700 text-white hover:bg-red-800`,
  small: 'px-3 py-1.5 text-xs',
};

export const inputClass =
  'w-full rounded-lg border bg-white px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-2 focus:ring-brand/20';