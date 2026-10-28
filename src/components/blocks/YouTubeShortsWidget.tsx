import Button from '../primitives/Button';
import RevealOnScroll from '../primitives/RevealOnScroll';
import ShortThumb from '../primitives/ShortThumb';

const SHORTS = [
  { id: 'IGZnO8Y21zU' },
  { id: 'uXDuRixnpKc' },
  { id: 'oYPDdrlIlas' },
  { id: 'BV1gqM_Aci8' },
];

const CHANNEL_URL = 'https://www.youtube.com/@HorizonsGetaways/';

export default function YouTubeShortsWidget() {
  return (
    <section data-zone="light" className="bg-bone py-20 px-6 md:py-28 md:px-12 lg:px-16">
      <div className="max-w-content mx-auto">
        <RevealOnScroll className="mb-10 md:mb-14">
          {/* Same heading treatment as VillaCascade's section headings ("Life Outside the Villa") */}
          <h2
            className="font-display text-ink md:whitespace-nowrap"
            style={{ fontVariationSettings: '"opsz" 144, "SOFT" 50, "WONK" 0', fontWeight: 380, fontSize: 'clamp(2rem, 4.5vw, 3.8rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}
          >
            A Glimpse of Your Getaway
          </h2>
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
