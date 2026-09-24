import WhatsAppIcon from '../icons/WhatsAppIcon';
import { CONTACT_WHATSAPP_HREF } from '../../lib/contact';

const variants = {
  'ghost-light': 'border border-linen/60 text-linen hover:bg-linen/10',
  secondary: 'border border-ink text-ink hover:bg-ink hover:text-bone',
};

/**
 * Header contact pill — one tap straight to WhatsApp. Keeps the prop signature
 * and pill metrics of the Call/Text dropdown it replaced so the two header
 * scroll states (hero pill and scrolled row) stay pixel-identical.
 */
export default function ContactButton({ overDark, className }: { overDark: boolean; className?: string }) {
  return (
    <a
      href={CONTACT_WHATSAPP_HREF}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Contact us on WhatsApp"
      className={`inline-flex flex-shrink-0 items-center gap-2 whitespace-nowrap font-eyebrow font-medium uppercase text-[11px] tracking-[0.22em] px-5 py-2 rounded-full transition-all duration-300 active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 outline-none min-h-[36px] ${variants[overDark ? 'ghost-light' : 'secondary']} ${className ?? ''}`}
    >
      <WhatsAppIcon size={15} />
      Contact Us Now
    </a>
  );
}
