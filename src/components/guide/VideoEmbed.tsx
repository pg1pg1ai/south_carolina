import { useState } from 'react';
import { Play } from 'lucide-react';

interface Props { id: string; title: string; duration: string; kicker: string }

export default function VideoEmbed({ id, title, duration, kicker }: Props) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="no-print guide-card overflow-hidden rounded-2xl border border-divider bg-night">
      {playing ? (
        <iframe
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          className="aspect-video w-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button onClick={() => setPlaying(true)} className="group relative block w-full" aria-label={`Play video: ${title}`}>
          <img
            src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
            alt=""
            className="aspect-video w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid h-16 w-16 place-items-center rounded-full bg-signal text-linen transition-transform group-hover:scale-105">
              <Play size={22} strokeWidth={1.8} fill="currentColor" />
            </span>
          </span>
          <span className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-4" style={{ background: 'linear-gradient(transparent, rgba(10,8,5,0.8))' }}>
            <span className="text-left">
              <span className="eyebrow block text-linen/70">{kicker}</span>
              <span className="font-display font-light text-linen text-lg">{title}</span>
            </span>
            <span className="eyebrow text-linen/70">{duration}</span>
          </span>
        </button>
      )}
    </div>
  );
}
