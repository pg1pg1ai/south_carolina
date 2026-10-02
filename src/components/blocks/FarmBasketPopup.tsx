import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, useReducedMotion } from 'framer-motion';
import WhatsAppIcon from '../icons/WhatsAppIcon';
import { CONTACT_WHATSAPP_HREF } from '../../lib/contact';
import { openBooking } from '../data/booking';

/**
 * "Your Farm Basket is On Us" promo pop-up — the site-side twin of the one
 * pasted into the Cloudbeds booking engine (`docs/cloudbeds-popup/`). Same
 * offer, same copy, same photo; the difference is the primary CTA, which here
 * opens BookingModal instead of handing the guest back to a calendar.
 *
 * Keep the two in sync when the offer changes — the Cloudbeds copy lives in
 * the COPY block of `docs/cloudbeds-popup/popup.js`.
 */

/** Long enough that it never lands on top of the hero. Matches the 15s the
 *  client settled on for the previous site pop-up (commit 8a164d7). */
const SHOW_DELAY_MS = 15000;

/** The client deliberately removed dismissal persistence from the previous
 *  pop-up in 8a164d7, so it shows once per page load. Set a key here to go
 *  back to once-per-session. */
const STORAGE_KEY: string | null = null;

const PHOTO = '/images/sandhills/farm-basket.webp';
const PHOTO_ALT =
  'A wicker basket on the lawn holding red wine, peaches, grapes, a jar of honey and farmhouse cheese.';

const WHATSAPP_HREF = `${CONTACT_WHATSAPP_HREF}?text=${encodeURIComponent(
  'Hi! I saw the 2-night farm basket offer — I’d like to book a stay.',
)}`;

const COPY = {
  eyebrow: 'Special stay offer',
  title: 'Your Farm Basket is On Us',
  body: 'Book a 2-night stay at Horizons Sandhills and enjoy a complimentary basket of fresh farm products during your stay.',
  cta: 'Book your stay',
  whatsapp: 'Message us on WhatsApp',
};

function seen(): boolean {
  if (!STORAGE_KEY) return false;
  try { return sessionStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
}
function markSeen() {
  if (!STORAGE_KEY) return;
  try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch { /* private mode */ }
}

export default function FarmBasketPopup() {
  const [armed, setArmed] = useState(false);   /* timer has fired at least once */
  const [open, setOpen] = useState(false);
  const [gone, setGone] = useState(false);     /* fade-out finished; safe to unmount */
  const [photoOk, setPhotoOk] = useState(true);
  const cardRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (seen()) return;
    const t = setTimeout(() => {
      lastFocused.current = document.activeElement as HTMLElement | null;
      setArmed(true);
      setOpen(true);
      markSeen();
    }, SHOW_DELAY_MS);
    return () => clearTimeout(t);
  }, []);

  const dismiss = useCallback(() => {
    setOpen(false);
    /* Belt and braces: unmount after the fade even if onAnimationComplete
       never fires. pointer-events is already off by then either way. */
    setTimeout(() => setGone(true), 500);
    /* Hand focus back where the guest left it, rather than at the top. */
    const prev = lastFocused.current;
    if (prev && typeof prev.focus === 'function') {
      try { prev.focus(); } catch { /* element may be gone */ }
    }
    lastFocused.current = null;
  }, []);

  /* Esc to close, and trap Tab inside the card while it is open. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); dismiss(); return; }
      if (e.key !== 'Tab' || !cardRef.current) return;
      const items = cardRef.current.querySelectorAll<HTMLElement>('button, a[href]');
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);
    cardRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, dismiss]);

  /* Primary CTA: close first so BookingModal (z-320) is never stacked under us. */
  const book = () => { dismiss(); openBooking(); };

  if (!armed || gone) return null;

  /* Deliberately not AnimatePresence (BookingModal and PrivateEventModal do use
     it; this one does not). Teardown here is driven by state rather than by the
     exit animation finishing, because this is a `fixed inset-0` overlay: if a
     fade never completes, an AnimatePresence child stays mounted at opacity 0
     and silently swallows every click on the page. Driving it from state means
     pointer-events is off the moment `open` flips, and `gone` unmounts us
     whether or not the animation callback ever arrives.

     That failure mode is not hypothetical: under headless Chrome's virtual time
     the exit animation does not advance at all. Real browsers are very likely
     fine, but the overlay is not worth the risk. */
  return createPortal(
    <motion.div
      className="fixed inset-0 z-[300] flex items-center justify-center p-[14px] sm:p-5"
          style={{
            background: 'rgba(10,8,5,0.62)',
            backdropFilter: 'blur(3px)',
            WebkitBackdropFilter: 'blur(3px)',
            pointerEvents: open ? 'auto' : 'none',
          }}
          aria-hidden={open ? undefined : true}
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: open ? 1 : 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
          onAnimationComplete={() => { if (!open) setGone(true); }}
          onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
          role="presentation"
        >
          <motion.div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="farmbasket-title"
            aria-describedby="farmbasket-body"
            tabIndex={-1}
            className="relative w-full max-w-[440px] max-h-[calc(100vh-28px)] sm:max-h-[calc(100vh-40px)] overflow-y-auto bg-bone text-ink text-left rounded-[20px] sm:rounded-[18px] p-[36px_22px_26px] sm:p-[42px_38px_34px] outline-none"
            style={{ boxShadow: '0 28px 70px rgba(0,0,0,0.45)', pointerEvents: open ? 'auto' : 'none' }}
            initial={reduce ? false : { opacity: 0, y: 16, scale: 0.97 }}
            animate={open ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: reduce ? 0 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={dismiss}
              aria-label="Close offer"
              /* Solid scrim: this sits on the photo, so it needs its own
                 contrast rather than borrowing the card's. */
              className="absolute top-[10px] right-[10px] z-10 w-[34px] h-[34px] inline-flex items-center justify-center rounded-full border-0 text-ink cursor-pointer transition-colors hover:bg-bone focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-[3px]"
              style={{ background: 'rgba(242,237,227,0.92)', boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }}
            >
              <svg viewBox="0 0 16 16" width="15" height="15" aria-hidden="true" focusable="false">
                <path d="M2.5 2.5l11 11m0-11l-11 11" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
              </svg>
            </button>

            {/* Full-bleed photo. The negative insets cancel the card padding, so
                they must stay pinned to it at both breakpoints. */}
            {photoOk && (
              <div className="-mx-[22px] -mt-[36px] mb-[28px] sm:-mx-[38px] sm:-mt-[42px] sm:mb-[34px] overflow-hidden rounded-t-[20px] sm:rounded-t-[18px] bg-surface">
                <img
                  src={PHOTO}
                  width={560}
                  height={373}
                  alt={PHOTO_ALT}
                  onError={() => setPhotoOk(false)}
                  className="block w-full h-auto aspect-[3/2] object-cover"
                  style={{ objectPosition: 'center 58%' }}
                />
              </div>
            )}

            <p className="flex items-center gap-3 m-0 eyebrow text-signal" style={{ fontSize: 10.5, fontWeight: 600, letterSpacing: '0.22em' }}>
              <span aria-hidden="true" className="shrink-0 bg-signal" style={{ width: 28, height: 2 }} />
              {COPY.eyebrow}
            </p>

            <h2
              id="farmbasket-title"
              className="font-display italic text-ink mt-[14px] mb-0 text-[25px] sm:text-[30px]"
              style={{ fontWeight: 400, lineHeight: 1.16, letterSpacing: '-0.01em' }}
            >
              {COPY.title}
            </h2>

            <p id="farmbasket-body" className="text-ink2 mt-4 mb-[22px] sm:mb-[26px] text-[14.5px] sm:text-[15px]" style={{ lineHeight: 1.58 }}>
              {COPY.body}
            </p>

            <div className="flex flex-col gap-[10px]">
              <button
                type="button"
                onClick={book}
                className="eyebrow w-full inline-flex items-center justify-center gap-[9px] rounded-full border border-transparent px-[18px] sm:px-7 py-[17px] sm:py-4 bg-signal hover:bg-signal2 active:scale-[0.98] transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-[3px]"
                style={{ color: '#FFF9F2', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', lineHeight: 1 }}
              >
                {COPY.cta}
              </button>

              <a
                href={WHATSAPP_HREF}
                target="_blank"
                rel="noopener noreferrer"
                onClick={dismiss}
                className="eyebrow w-full inline-flex items-center justify-center gap-[9px] rounded-full px-[18px] sm:px-7 py-[17px] sm:py-4 text-ink no-underline transition-all active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-signal focus-visible:outline-offset-[3px]"
                style={{ border: '1px solid rgba(31,36,32,0.28)', fontSize: 11, fontWeight: 600, letterSpacing: '0.18em', lineHeight: 1 }}
              >
                <WhatsAppIcon size={15} />
                {COPY.whatsapp}
              </a>
            </div>
          </motion.div>
    </motion.div>,
    document.body,
  );
}
