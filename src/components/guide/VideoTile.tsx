import { useState } from 'react';
import { Play } from 'lucide-react';
import { guideVideos, type VideoKey } from '../data/guide';

interface Props {
  video: VideoKey;
  /** Width of the tile; the poster keeps the 9:16 shape the videos were shot in. */
  className?: string;
  label?: string;
}

/**
 * Poster first, video only once tapped — the guide warns that cell service is
 * spotty here, so nothing downloads until a guest asks for it. The videos carry
 * spoken instructions, so they play with sound rather than muted-autoplay.
 */
export default function VideoTile({ video, className = 'w-[150px]', label }: Props) {
  const [playing, setPlaying] = useState(false);
  const v = guideVideos[video];

  return (
    <figure className={`no-print shrink-0 ${className}`}>
      <div className="relative overflow-hidden rounded-xl border border-divider bg-night">
        {playing ? (
          <video
            className="aspect-[9/16] w-full object-cover"
            src={v.src}
            poster={v.poster}
            controls
            autoPlay
            playsInline
            aria-label={v.title}
          />
        ) : (
          <button
            type="button"
            onClick={() => setPlaying(true)}
            aria-label={`Play video: ${v.title}`}
            className="group relative block w-full"
          >
            <img src={v.poster} alt="" loading="lazy" className="aspect-[9/16] w-full object-cover" />
            <span className="absolute inset-0 grid place-items-center">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-signal/90 text-linen shadow-lg transition-transform duration-300 group-hover:scale-110">
                <Play size={16} fill="currentColor" strokeWidth={0} className="ml-0.5" />
              </span>
            </span>
          </button>
        )}
      </div>
      {label && <figcaption className="mt-2 text-[12px] leading-snug text-ink2">{label}</figcaption>}
    </figure>
  );
}
