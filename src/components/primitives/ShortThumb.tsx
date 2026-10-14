import { useState } from 'react';
import { Play } from 'lucide-react';

// Facade pattern: a plain <img> thumbnail is all that loads up front. YouTube's
// embed script only reaches the page once a visitor actually clicks play.
export default function ShortThumb({ id, label }: { id: string; label?: string }) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative aspect-[9/16] overflow-hidden rounded-2xl bg-night">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&playsinline=1`}
          title="Horizons Sandhills — YouTube Short"
          className="absolute inset-0 h-full w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label={label ?? 'Play video'}>
          <img
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0"
            style={{ background: 'linear-gradient(to top, rgba(10,8,5,0.55), transparent 45%)' }}
          />
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="grid h-14 w-14 place-items-center rounded-full bg-linen/90 text-ink shadow-lg transition-transform group-hover:scale-110">
              <Play size={22} strokeWidth={1.6} fill="currentColor" style={{ marginLeft: 2 }} />
            </span>
          </span>
        </button>
      )}
    </div>
  );
}
