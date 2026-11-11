import { Link } from 'react-router-dom';
import { ArrowRight, Heart, MapPin, Star } from 'lucide-react';
import { btn } from '../lib/styles';
import type { Stall } from '../types/api';

// Satu warung di halaman daftar.
export function StallRow({ stall }: { stall: Stall }) {
  return (
    <li className="flex items-center gap-5 rounded-2xl bg-white p-5 ring-1 ring-line transition hover:ring-mint">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          {stall.category && (
            <span className="rounded-full bg-brand-soft px-3 py-1 text-xs font-semibold text-brand-dark">{stall.category}</span>
          )}
          {stall.isPopular && (
            <span className="inline-flex items-center gap-1 rounded-full bg-rose-soft px-3 py-1 text-xs font-semibold text-rose">
              <Heart className="size-3 fill-rose" aria-hidden="true" />
              Populer
            </span>
          )}
        </div>
        <Link to={`/warung/${stall.id}`} className="font-display mt-2 block text-lg text-brand-dark hover:text-brand">
          {stall.name}
        </Link>
        <p className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="inline-flex items-center gap-1">
            <MapPin className="size-3.5" aria-hidden="true" />
            {stall.location ?? 'Lokasi belum diisi'}
          </span>
          {stall.description && <span className="truncate">{stall.description}</span>}
        </p>
      </div>

      <div className="shrink-0 text-right">
        <p className="flex items-center justify-end gap-1 text-lg font-bold text-ink">
          <Star className="size-4.5 fill-rose text-rose" aria-hidden="true" />
          {stall.avgRating.toFixed(1)}
        </p>
        <p className="text-xs text-muted">
          {stall.reviewCount > 0 ? `${stall.reviewCount} review` : 'Belum ada review'}
        </p>
      </div>

      <Link to={`/warung/${stall.id}`} className={`${btn.secondary} shrink-0`}>
        Lihat detail
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    </li>
  );
}

// Kerangka abu-abu selama data dimuat (loading state).
export function StallRowSkeleton() {
  return (
    <li className="flex animate-pulse items-center gap-5 rounded-2xl bg-white p-5 ring-1 ring-line">
      <div className="flex-1 space-y-2.5">
        <div className="h-5 w-16 rounded-full bg-brand-soft" />
        <div className="h-5 w-2/5 rounded-full bg-line" />
        <div className="h-3 w-3/5 rounded-full bg-line/70" />
      </div>
      <div className="h-10 w-28 rounded-full bg-line/70" />
    </li>
  );
}