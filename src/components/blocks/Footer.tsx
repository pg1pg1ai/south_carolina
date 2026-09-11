import { Calendar } from 'lucide-react';
import { openBooking } from '../data/booking';
import Button from '../primitives/Button';
import { CONTACT_PHONE_HREF } from '../../lib/contact';

// Monochrome brand glyphs — lucide-react doesn't ship brand/social icons, so
// these are small self-contained filled-path SVGs (fill: currentColor).
function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M12 2.16c3.2 0 3.58.01 4.85.07 3.25.15 4.77 1.69 4.92 4.92.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.15 3.23-1.66 4.77-4.92 4.92-1.27.06-1.64.07-4.85.07s-3.58-.01-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s.01-3.58.07-4.85c.15-3.23 1.66-4.77 4.92-4.92 1.27-.06 1.65-.07 4.85-.07M12 0C8.74 0 8.33.01 7.05.07 2.7.27.27 2.7.07 7.05.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.2 4.36 2.62 6.78 6.98 6.98C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c4.35-.2 6.78-2.62 6.98-6.98.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95C23.73 2.7 21.3.27 16.95.07 15.67.01 15.26 0 12 0zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84zM12 16a4 4 0 1 1 4-4 4 4 0 0 1-4 4zm6.41-11.85a1.44 1.44 0 1 0 1.44 1.44 1.44 1.44 0 0 0-1.44-1.44z" /></svg>
  );
}
function YouTubeIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4L15.8 12z" /></svg>
  );
}
function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M16.5 2c.4 2.75 2.1 4.6 4.9 4.8v3.1c-1.7 0-3.3-.5-4.9-1.6v6.9c0 3.8-3.1 6.8-6.8 6.8S3 19 3 15.2s3.1-6.8 6.8-6.8c.4 0 .8 0 1.2.1v3.2c-.4-.1-.8-.2-1.2-.2a3.5 3.5 0 1 0 3.5 3.5V2h3.2z" /></svg>
  );
}
function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.68H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.56V9h3.56v11.45z" /></svg>
  );
}
function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.5-3.89 3.78-3.89 1.1 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" /></svg>
  );
}
function RedditIcon() {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M22 12a2.1 2.1 0 0 0-3.5-1.5 10 10 0 0 0-5-1.6l.9-4.2 3 .6a1.5 1.5 0 1 0 .1-.9l-3.3-.7a.5.5 0 0 0-.6.4l-1 4.8a10 10 0 0 0-5 1.6A2.1 2.1 0 1 0 4.9 14a4 4 0 0 0 0 .5c0 3 3.6 5.5 8.1 5.5s8.1-2.5 8.1-5.5a4 4 0 0 0 0-.5A2.1 2.1 0 0 0 22 12zM9 14.2a1.4 1.4 0 1 1 2.8 0 1.4 1.4 0 0 1-2.8 0zm7.3 3a5.4 5.4 0 0 1-3.3 1 5.4 5.4 0 0 1-3.3-1 .4.4 0 1 1 .5-.6 4.6 4.6 0 0 0 2.8.9 4.6 4.6 0 0 0 2.8-.9.4.4 0 1 1 .5.6zm-.4-1.6a1.4 1.4 0 1 1 0-2.8 1.4 1.4 0 0 1 0 2.8z" /></svg>
  );
}

const SOCIALS = [
  { name: 'Instagram', href: 'https://www.instagram.com/gohorizons?igsh=Ynp3c20wOXA1Ymxq', Icon: InstagramIcon },
  { name: 'YouTube', href: 'https://www.youtube.com/@HorizonsGetaways/', Icon: YouTubeIcon },
  { name: 'TikTok', href: 'https://www.tiktok.com/@horizonsgetaways/', Icon: TikTokIcon },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/company/horizons-getaways/', Icon: LinkedInIcon },
  { name: 'Facebook', href: 'https://www.facebook.com/horizonsgetaway/', Icon: FacebookIcon },
  { name: 'Reddit', href: 'https://www.reddit.com/user/HorizonsGetaway/', Icon: RedditIcon },
] as const;

// Two nav columns — every link targets a real block anchor on the page,
// in the order the blocks appear while scrolling.
type FooterLink = { label: string; href?: string; onClick?: () => void };

const cols: { title: string; links: FooterLink[] }[] = [
  {
    title: 'Explore',
    links: [
      { label: 'The Forest Villa', href: '/#stays' },
      { label: 'Step Inside', href: '/#inside' },
      { label: 'On The Property', href: '/#land' },
      { label: 'Nearby', href: '/#nearby' },
    ],
  },
  {
    title: 'Plan Your Stay',
    links: [
      { label: 'Check Availability', onClick: openBooking },
      { label: 'Getting Here', href: '/#getting-here' },
      { label: 'Private Events', href: '/#events' },
      { label: 'Contact Us', href: '/#reserve' },
    ],
  },
];

export default function Footer() {
  return (
    <footer data-zone="dark" className="bg-nightWarm text-linen/70 pt-16 pb-10 px-6">
      <div className="max-w-content mx-auto">
        {/* Booking CTA — opens the same date-picker popup as the header Book button */}
        <div className="mb-12 pb-12" style={{ borderBottom: '1px solid rgba(231,222,199,0.10)' }}>
          <p className="eyebrow text-linen/40 mb-3">Ready when you are</p>
          <p className="font-display font-light text-linen text-xl mb-6"
            style={{ fontVariationSettings: '"SOFT" 30, "opsz" 24', letterSpacing: '-0.01em' }}>
            Pick your dates — the pines will handle the rest.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Button onClick={openBooking} variant="primary">
              <Calendar size={15} strokeWidth={2} style={{ marginRight: 10 }} />
              Book Your Stay
            </Button>
            <Button href={CONTACT_PHONE_HREF} variant="ghost-light">Call Us</Button>
            <Button href="https://wa.me/17546679090" variant="ghost-light" newTab>Text Us</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-[74px] mb-12 max-w-3xl">
          {cols.map((col) => (
            <div key={col.title}>
              <p className="eyebrow text-linen/40 mb-5">{col.title}</p>
              {/* Desktop: links flow into 2 columns of 2; mobile keeps a single stack */}
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-y-3 md:gap-x-6 list-none p-0 m-0">
                {col.links.map((l) => (
                  <li key={l.label}>
                    <a
                      href={l.href ?? '#'}
                      onClick={l.onClick ? (e) => { e.preventDefault(); l.onClick!(); } : undefined}
                      className="text-linen/60 text-sm hover:text-linen transition-colors focus-visible:outline-none focus-visible:text-linen whitespace-nowrap"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8">
          <a href="#" className="inline-flex items-center" aria-label="Horizons Sandhills">
            <div
              role="img"
              aria-label="Horizons Sandhills"
              style={{
                height: 32,
                aspectRatio: '173.882 / 47.856',
                backgroundColor: '#B05329',
                WebkitMaskImage: 'url(/logo.svg)',
                maskImage: 'url(/logo.svg)',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskPosition: 'left center',
                maskPosition: 'left center',
              }}
            />
          </a>

          <ul className="flex items-center gap-2 list-none p-0 m-0">
            {SOCIALS.map(({ name, href, Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="flex items-center justify-center rounded-full text-linen/60 hover:text-linen hover:bg-linen/10 transition-colors focus-visible:outline-none focus-visible:text-linen focus-visible:bg-linen/10"
                  style={{ width: 36, height: 36 }}
                >
                  <Icon />
                  <span className="sr-only">{name}</span>
                </a>
              </li>
            ))}
          </ul>

          <p className="text-linen/40 text-sm">© 2026 Horizons Sandhills, South Carolina.</p>
        </div>
      </div>
    </footer>
  );
}
