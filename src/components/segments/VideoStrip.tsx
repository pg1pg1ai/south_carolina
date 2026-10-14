import type { Segment } from '../data/segments';
import RevealOnScroll from '../primitives/RevealOnScroll';
import ShortThumb from '../primitives/ShortThumb';

export default function VideoStrip({ video }: { video: Segment['video'] }) {
  return (
    <section data-zone="light" className="bg-bone px-6 py-20 md:px-12 md:py-28 lg:px-16">
      <div className="max-w-content mx-auto">
        <RevealOnScroll className="mb-10 md:mb-14">
          <h2 className="display-h2 text-ink text-[clamp(26px,3.6vw,44px)]">{video.heading}</h2>
        </RevealOnScroll>
        <RevealOnScroll variant="stagger-parent" className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {video.shorts.map((id, i) => (
            <RevealOnScroll variant="stagger-child" key={id}>
              <ShortThumb id={id} label={`Play video ${i + 1}`} />
            </RevealOnScroll>
          ))}
        </RevealOnScroll>
      </div>
    </section>
  );
}
