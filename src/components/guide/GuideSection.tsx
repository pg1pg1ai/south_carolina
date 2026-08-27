import type { ReactNode } from 'react';
import RevealOnScroll from '../primitives/RevealOnScroll';

interface Props {
  id: string;
  index: string;      // '01' … '11'
  eyebrow: string;    // section label, e.g. 'Start Here'
  title: string;
  sub?: string;
  band?: boolean;     // alternate warm background band
  children?: ReactNode;
}

export default function GuideSection({ id, index, eyebrow, title, sub, band = false, children }: Props) {
  return (
    <section
      id={id}
      data-zone="light"
      className={`scroll-mt-32 py-16 md:py-24 ${band ? 'bg-boneWarm' : 'bg-bone'}`}
    >
      <div className="max-w-content mx-auto px-6 md:px-10">
        <RevealOnScroll className="mb-10 md:mb-14 max-w-3xl">
          <p className="eyebrow text-signal">
            <span className="numeral mr-3 text-ink2">{index}</span>
            {eyebrow}
          </p>
          <h2 className="display-h2 mt-4 text-ink text-[clamp(28px,4vw,48px)]">{title}</h2>
          {sub && <p className="mt-4 text-ink2 text-[15px] md:text-base leading-relaxed">{sub}</p>}
        </RevealOnScroll>
        {children}
      </div>
    </section>
  );
}
