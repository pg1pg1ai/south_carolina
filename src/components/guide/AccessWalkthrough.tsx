import { guideData as g } from '../data/guide';

export default function AccessWalkthrough() {
  const { src, poster } = g.access.video;

  return (
    <div className="no-print mx-auto w-full max-w-[340px] overflow-hidden rounded-2xl border border-divider bg-night">
      <video
        className="aspect-[9/16] w-full object-cover"
        src={src}
        poster={poster}
        autoPlay
        muted
        loop
        playsInline
        aria-label="Walkthrough of arriving at and entering your forest villa"
      />
    </div>
  );
}
