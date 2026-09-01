import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronDown, Phone, MessageCircle } from 'lucide-react';
import { CONTACT_PHONE_HREF, CONTACT_SMS_HREF } from '../../lib/contact';

const triggerVariants = {
  'ghost-light': 'border border-linen/60 text-linen hover:bg-linen/10',
  secondary: 'border border-ink text-ink hover:bg-ink hover:text-bone',
};

export default function ContactDropdown({ overDark, className }: { overDark: boolean; className?: string }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, right: 0 });
  const wrapRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const updatePosition = () => {
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    setPos({ top: rect.bottom + 8, right: window.innerWidth - rect.right });
  };

  useLayoutEffect(() => {
    if (open) updatePosition();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;
      if (wrapRef.current?.contains(target) || panelRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    window.addEventListener('resize', updatePosition);
    document.addEventListener('mousedown', onClickOutside);
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('resize', updatePosition);
      document.removeEventListener('mousedown', onClickOutside);
      window.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <div ref={wrapRef} className={`flex-shrink-0 ${className ?? ''}`}>
      <button
        ref={triggerRef}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`inline-flex items-center gap-1.5 whitespace-nowrap font-eyebrow font-medium uppercase text-[11px] tracking-[0.22em] px-5 py-2 rounded-full transition-all duration-300 focus-visible:ring-2 focus-visible:ring-signal focus-visible:ring-offset-2 outline-none min-h-[36px] ${triggerVariants[overDark ? 'ghost-light' : 'secondary']}`}
      >
        Contact Us
        <ChevronDown size={13} strokeWidth={2} style={{ transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s ease' }} />
      </button>

      {open && createPortal(
        <div
          ref={panelRef}
          role="menu"
          className="fixed w-48 bg-bone overflow-hidden"
          style={{ top: pos.top, right: pos.right, zIndex: 300, borderRadius: 10, boxShadow: '0 16px 40px rgba(0,0,0,0.22)', border: '1px solid rgba(31,36,32,0.08)' }}
        >
          <a
            href={CONTACT_PHONE_HREF}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-3 text-ink hover:bg-boneWarm transition-colors font-eyebrow font-medium text-[11px] uppercase tracking-[0.14em]"
          >
            <Phone size={15} strokeWidth={1.8} className="text-signal" />
            Call Us
          </a>
          <a
            href={CONTACT_SMS_HREF}
            role="menuitem"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2.5 px-4 py-3 text-ink hover:bg-boneWarm transition-colors font-eyebrow font-medium text-[11px] uppercase tracking-[0.14em]"
            style={{ borderTop: '1px solid #D9CEB8' }}
          >
            <MessageCircle size={15} strokeWidth={1.8} className="text-signal" />
            Text Us
          </a>
        </div>,
        document.body,
      )}
    </div>
  );
}
