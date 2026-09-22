import type { ReactNode } from 'react';
import RevealOnScroll from '../primitives/RevealOnScroll';
import VideoTile from './VideoTile';
import type { AmenityBlockData, AmenityGroup } from '../data/guide';

function Group({ group }: { group: AmenityGroup }) {
  const videos = (group.items ?? []).filter((i) => i.video);

  return (
    <div>
      <p className="font-eyebrow text-sm text-ink">{group.title}</p>
      {group.intro && <p className="mt-1.5 text-[13px] leading-relaxed text-ink2">{group.intro}</p>}

      {group.items && (
        <ul className="mt-2 space-y-1">
          {group.items.map((item) => (
            <li key={item.text} className="flex gap-2 text-[13px] leading-snug text-ink2">
              <span aria-hidden className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-signal/60" />
              <span>{item.text}</span>
            </li>
          ))}
        </ul>
      )}

      {group.paras?.map((p) => (
        <p key={p} className="mt-2 text-[13px] leading-relaxed text-ink2">
          {p}
        </p>
      ))}

      {group.outro && <p className="mt-2 text-[13px] leading-relaxed text-ink2">{group.outro}</p>}

      {group.highlight && (
        <div className="mt-4 rounded-xl border border-divider bg-bone p-4">
          <p className="eyebrow text-ink2">{group.highlight.label}</p>
          <p className="mt-2 font-display font-light text-ink text-xl">{group.highlight.value}</p>
          <p className="mt-1 text-[12px] leading-snug text-ink2">{group.highlight.note}</p>
        </div>
      )}

      {videos.length > 0 && (
        <div className="no-print mt-4 flex flex-wrap gap-3">
          {videos.map((item) => (
            <VideoTile key={item.text} video={item.video!} label={item.text} className="w-[132px]" />
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * One guidelines card — the villa, the water, the lounge deck, the sports area.
 * `children` is where the water block slots the sauna in.
 */
export default function AmenityBlock({
  block,
  className = '',
  children,
}: {
  block: AmenityBlockData;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <RevealOnScroll className={`guide-card rounded-2xl border border-divider bg-white/40 p-6 md:p-8 ${className}`}>
      <p className="eyebrow text-signal">{block.kicker}</p>
      <h3 className="display-h2 mt-2 text-ink text-[clamp(20px,2.4vw,28px)]">{block.title}</h3>
      <p className="mt-1.5 text-[14px] text-ink2">{block.sub}</p>
      {block.intro && <p className="mt-4 text-[14px] leading-relaxed text-ink2">{block.intro}</p>}

      <div className="mt-6 grid gap-x-8 gap-y-7 md:grid-cols-2">
        {block.groups.map((group) => (
          <Group key={group.title} group={group} />
        ))}
      </div>

      {block.note && (
        <p className="mt-6 border-t border-divider pt-5 text-[13px] leading-relaxed text-ink2">{block.note}</p>
      )}

      {children}

      {block.safety && (
        <div className="mt-6 border-t border-divider pt-5">
          <p className="font-eyebrow text-sm text-ink">Safety &amp; Courtesy</p>
          <ul className="mt-2 grid gap-x-6 gap-y-1.5 sm:grid-cols-2">
            {block.safety.map((s) => (
              <li key={s} className="text-[13px] leading-snug text-ink2">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
    </RevealOnScroll>
  );
}
