import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

// Tata letak dua kolom untuk halaman Masuk dan Daftar.
export function AuthShell({ heading, description, children }: { heading: string; description: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <aside className="hidden flex-col justify-between bg-brand p-10 text-white md:flex">
        <Link to="/">
          <Logo inverted />
        </Link>
        <div>
          <h2 className="text-3xl leading-tight font-semibold">{heading}</h2>
          <p className="mt-3 max-w-sm leading-relaxed text-white/80">{description}</p>
        </div>
        <p className="text-xs text-white/60">Praktikum RSI 2026</p>
      </aside>
      <section className="flex items-center justify-center bg-white p-8">
        <div className="w-full max-w-sm">{children}</div>
      </section>
    </div>
  );
}