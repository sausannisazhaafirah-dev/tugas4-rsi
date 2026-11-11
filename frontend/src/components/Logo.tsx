import { Store } from 'lucide-react';

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className={`flex items-center gap-2.5 text-base font-semibold ${inverted ? 'text-white' : 'text-brand-dark'}`}>
      <span className={`grid size-8 place-items-center rounded-lg ${inverted ? 'bg-white text-brand' : 'bg-brand text-white'}`}>
        <Store className="size-4.5" aria-hidden="true" />
      </span>
      Lapak Kantin
    </span>
  );
}