// Kelas Tailwind yang dipakai berulang, supaya tampilan tombol dan input konsisten.
const base =
  'inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60';

export const btn = {
  primary: `${base} bg-brand text-white hover:bg-brand-hover`,
  secondary: `${base} border border-line bg-white text-brand-dark hover:border-brand hover:bg-brand-soft`,
  danger: `${base} border border-red-200 bg-white text-red-700 hover:bg-red-50`,
  dangerSolid: `${base} bg-red-700 text-white hover:bg-red-800`,
  small: 'px-3.5 py-1.5 text-xs',
};

export const inputClass =
  'w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/70 focus:border-brand focus:ring-4 focus:ring-mint/60';