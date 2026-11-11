import { Store } from 'lucide-react';

export function Logo({ inverted = false }: { inverted?: boolean }) {
  return (
    <span className={`flex items-center gap-2.5 ${inverted ? 'text-white' : 'text-brand-dark'}`}>
      <span className={`grid size-9 place-items-center rounded-xl ${inverted ? 'bg-white text-brand' : 'bg-brand text-white'}`}>
        <Store className="size-5" aria-hidden="true" />
      </span>
      <span className="font-display text-lg">
        Lapak<span className={inverted ? 'text-mint' : 'text-rose'}> Kantin</span>
      </span>
    </span>
  );
}