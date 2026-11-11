// Inisial nama untuk avatar, contoh: "Bu Tini" → "BT", "Sausan" → "SA".
export function initials(name: string): string {
  const words = name.trim().split(/\s+/);
  if (words.length >= 2) return (words[0][0] + words[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

// Format harga Rupiah, contoh: 15000 → "Rp15.000".
export function rupiah(value: number): string {
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);
}