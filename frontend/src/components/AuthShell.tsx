import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Logo } from './Logo';

// Tata letak dua kolom untuk halaman Masuk dan Daftar.
export function AuthShell({ heading, description, children }: { heading: string; description: string; children: ReactNode }) {
  return (
    <div className="grid min-h-screen bg-page md:grid-cols-[1.05fr_1fr]">
      <aside className="relative m-4 hidden flex-col justify-between overflow-hidden rounded-[2rem] bg-brand p-12 text-white md:flex">
        {/* Bentuk lembut sebagai aksen */}
        <span className="absolute -top-16 -right-16 size-64 rounded-full bg-mint/25" aria-hidden="true" />
        <span className="absolute -bottom-24 -left-10 size-72 rounded-full bg-[#F4B6C4]" aria-hidden="true" />
        <Link to="/" className="relative">
          <Logo inverted />
        </Link>
        <div className="relative">
          <h2 className="font-display max-w-md text-5xl leading-[1.1]">{heading}</h2>
          <p className="mt-5 max-w-sm leading-relaxed text-white/85">{description}</p>
        </div>
        <p className="relative text-xs text-white/70">Praktikum RSI 2026</p>
      </aside>
      <section className="flex items-center justify-center p-8">
        <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-[0_8px_30px_rgba(14,110,122,0.08)] ring-1 ring-line">{children}</div>
      </section>
    </div>
  );
}