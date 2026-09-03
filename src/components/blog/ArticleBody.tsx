import type { BlogBlock } from '../data/blog';

export default function ArticleBody({ blocks }: { blocks: BlogBlock[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((block, i) => {
        if (block.type === 'heading') {
          return (
            <h2
              key={i}
              className="font-display font-light text-ink text-[clamp(22px,2.5vw,32px)] pt-4"
              style={{ letterSpacing: '-0.02em', fontVariationSettings: '"SOFT" 30, "opsz" 32' }}
            >
              {block.text}
            </h2>
          );
        }
        if (block.type === 'paragraph') {
          return (
            <p key={i} className="text-ink2 text-[17px] leading-relaxed">
              {block.text}
            </p>
          );
        }
        return (
          <figure key={i} className="my-8">
            <img src={block.src} alt={block.alt} className="w-full rounded-xl object-cover" />
            {block.caption && (
              <figcaption className="mt-2 text-ink2/60 text-sm text-center">
                {block.caption}
              </figcaption>
            )}
          </figure>
        );
      })}
    </div>
  );
}
