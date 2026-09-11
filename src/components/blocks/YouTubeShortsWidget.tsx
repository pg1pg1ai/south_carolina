import { useState } from 'react';
import { Play } from 'lucide-react';
import Button from '../primitives/Button';
import RevealOnScroll from '../primitives/RevealOnScroll';

const SHORTS = [
  { id: 'IGZnO8Y21zU' },
  { id: 'uXDuRixnpKc' },
  { id: 'oYPDdrlIlas' },
  { id: 'BV1gqM_Aci8' },
];

const CHANNEL_URL = 'https://www.youtube.com/@HorizonsGetaways/';

// Facade pattern: a plain <img> thumbnail is all that loads up front. YouTube's
// embed script only reaches the page once a visitor actually clicks play.
function ShortThumb({ id }: { id: string }) {
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
        <button onClick={() => setPlaying(true)} className="group absolute inset-0 h-full w-full" aria-label="Play video">
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

export default function YouTubeShortsWidget() {
  return (
    <section data-zone="light" className="bg-bone py-20 px-6 md:py-28 md:px-12 lg:px-16">
      <div className="max-w-content mx-auto">
        <RevealOnScroll className="mb-10 md:mb-14 max-w-3xl">
          <p className="eyebrow text-signal">Featured Videos</p>
          <h2 className="display-h2 mt-4 text-ink text-[clamp(28px,4vw,48px)]">Life at Horizons Sandhills, in 60 seconds.</h2>
        </RevealOnScroll>

        <RevealOnScroll variant="stagger-parent" className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {SHORTS.map((s) => (
            <RevealOnScroll variant="stagger-child" key={s.id}>
              <ShortThumb id={s.id} />
            </RevealOnScroll>
          ))}
        </RevealOnScroll>

        <div className="mt-10 flex justify-center">
          <Button href={CHANNEL_URL} variant="secondary" newTab>Watch More on YouTube</Button>
        </div>
      </div>
    </section>
  );
}
