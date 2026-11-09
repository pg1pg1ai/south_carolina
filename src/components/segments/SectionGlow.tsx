/** A large, soft colour pool behind a section. Sections on the segment pages
 *  share one dark page background and use these instead of their own fills,
 *  so there is never a hard edge or flat colour change between them. */
export default function SectionGlow({ className = '', color }: { className?: string; color: string }) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute h-[70vmax] w-[70vmax] max-h-[1100px] max-w-[1100px] rounded-full ${className}`}
      style={{ background: `radial-gradient(closest-side, ${color}, transparent)` }}
    />
  );
}
