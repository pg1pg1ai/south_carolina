import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Users } from 'lucide-react';
import {
  buildBookingUrl, fmtIso, MAX_GUESTS, MIN_NIGHTS,
  CLOUDBEDS_PROPERTY_CODE, CLOUDBEDS_ISLAND, CLOUDBEDS_ENGINE_LOADER, type OpenBookingDetail,
} from '../data/booking';
import { CONTACT_WHATSAPP_HREF } from '../../lib/contact';
import WhatsAppIcon from '../icons/WhatsAppIcon';

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function startOfToday(): Date {
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  return t;
}
function calDays(year: number, month: number): (Date | null)[] {
  const firstDow = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();
  const days: (Date | null)[] = Array(firstDow).fill(null);
  for (let d = 1; d <= total; d++) days.push(new Date(year, month, d));
  return days;
}
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function fmtLong(d: Date | null) {
  return d ? d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }) : '—';
}

interface MonthProps {
  year: number; month: number;
  today: Date; checkIn: Date | null; checkOut: Date | null; hover: Date | null;
  onPick: (d: Date) => void; onHover: (d: Date | null) => void;
}
function Month({ year, month, today, checkIn, checkOut, hover, onPick, onHover }: MonthProps) {
  const days = calDays(year, month);
  const rangeEnd = checkOut ?? (checkIn && !checkOut ? hover : null);
  return (
    <div style={{ width: '100%' }}>
      <p className="font-display text-linen text-center" style={{ fontVariationSettings: '"opsz" 48, "SOFT" 30', fontWeight: 400, fontSize: 'clamp(1.05rem, 2vw, 1.25rem)', letterSpacing: '-0.01em', marginBottom: 14 }}>
        {MONTH_NAMES[month]} {year}
      </p>
      <div className="grid grid-cols-7" style={{ gap: 2 }}>
        {DAY_LABELS.map((l) => (
          <div key={l} className="font-eyebrow text-linen/35 text-center" style={{ fontSize: 10, letterSpacing: '0.12em', paddingBottom: 6 }}>{l}</div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={`e${i}`} />;
          const disabled = d < today;
          const isIn = checkIn && sameDay(d, checkIn);
          const isOut = checkOut && sameDay(d, checkOut);
          const inRange = checkIn && rangeEnd && d > checkIn && d < rangeEnd;
          const isEdge = isIn || isOut;
          return (
            <button
              key={d.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onPick(d)}
              onMouseEnter={() => onHover(d)}
              className="relative flex items-center justify-center transition-colors"
              style={{
                height: 'clamp(34px, 4.4vw, 40px)',
                borderRadius: 999,
                cursor: disabled ? 'default' : 'pointer',
                fontFamily: 'Inter, system-ui, sans-serif',
                fontSize: 'clamp(12px, 1.1vw, 13.5px)',
                fontWeight: isEdge ? 600 : 400,
                color: disabled ? 'rgba(231,222,199,0.18)' : isEdge ? '#F2EDE3' : 'rgba(231,222,199,0.85)',
                background: isEdge ? '#B05329' : inRange ? 'rgba(176,83,41,0.18)' : 'transparent',
              }}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ── Cloudbeds engine (step 2) ────────────────────────────────────────────────
// Cloudbeds only allows its "immersive experience" web component on other sites (a plain iframe of the
// reservation page is refused as outdated). It reads checkin/checkout/adults/kids from the page URL, so those
// go into the address bar just before it mounts, and come out again when the window closes.
const URL_KEYS = ['checkin', 'checkout', 'adults', 'kids'];
function setUrlParams(p: Record<string, string> | null) {
  const u = new URL(window.location.href);
  URL_KEYS.forEach((k) => u.searchParams.delete(k));
  if (p) Object.entries(p).forEach(([k, v]) => u.searchParams.set(k, v));
  if (u.href !== window.location.href) window.history.replaceState(window.history.state, '', u.href);
}
function loadEngineScript() {
  if (document.querySelector('script[data-cb-engine]')) return;
  const s = document.createElement('script');
  s.src = CLOUDBEDS_ENGINE_LOADER;
  s.setAttribute('island', CLOUDBEDS_ISLAND);
  s.setAttribute('property-code', CLOUDBEDS_PROPERTY_CODE);
  s.setAttribute('data-cb-engine', '');
  document.head.appendChild(s);
}

function Engine({ checkIn, checkOut, adults, kids }: { checkIn: Date; checkOut: Date; adults: number; kids: number }) {
  const host = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const p: Record<string, string> = { checkin: fmtIso(checkIn), checkout: fmtIso(checkOut), adults: String(adults) };
    if (kids) p.kids = String(kids);
    setUrlParams(p);
    loadEngineScript();
    const el = document.createElement('cb-immersive-experience');
    el.setAttribute('property-code', CLOUDBEDS_PROPERTY_CODE);
    el.setAttribute('island', CLOUDBEDS_ISLAND);
    el.setAttribute('mode', 'standard'); // in-page mode; "popup" expects Cloudbeds' own shell
    el.setAttribute('lang', 'en');
    host.current?.appendChild(el);
    const done = () => setReady(true);
    window.addEventListener('on-booking-engine-ready', done, { once: true });
    document.addEventListener('on-booking-engine-ready', done, { once: true });
    el.addEventListener('on-booking-engine-ready', done, { once: true });
    const t = window.setTimeout(done, 8000);
    // Cloudbeds opens its cart, drawers and dialogs in portals appended to <body>; lift them above this window.
    const mo = new MutationObserver((list) => list.forEach((m) => m.addedNodes.forEach((n) => {
      if (!(n instanceof HTMLElement) || /^(SCRIPT|STYLE|LINK|NOSCRIPT|META)$/.test(n.tagName) || n.dataset.bookingModal !== undefined || n.dataset.siteOverlay !== undefined || n.querySelector('[data-site-overlay],[data-booking-modal]')) return;
      if (getComputedStyle(n).position === 'static') n.style.position = 'relative';
      n.style.zIndex = '100001';
    })));
    mo.observe(document.body, { childList: true });
    return () => {
      window.clearTimeout(t); mo.disconnect(); el.remove(); setUrlParams(null);
      window.removeEventListener('on-booking-engine-ready', done); document.removeEventListener('on-booking-engine-ready', done);
    };
  }, [checkIn, checkOut, adults, kids]);
  return (
    <div className="relative flex-1 min-h-0 overflow-y-auto" style={{ background: '#fff', WebkitOverflowScrolling: 'touch' }}>
      <div ref={host} />
      {!ready && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4" style={{ background: '#232924', color: 'rgba(231,222,199,0.7)', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13.5 }}>
          <span className="block rounded-full animate-spin" style={{ width: 30, height: 30, border: '2px solid rgba(231,222,199,0.18)', borderTopColor: '#B05329' }} />
          Finding available rooms…
        </div>
      )}
    </div>
  );
}

export default function BookingModal() {
  const today = useMemo(startOfToday, []);
  const [open, setOpen] = useState(false);
  const [cal, setCal] = useState(() => ({ year: today.getFullYear(), month: today.getMonth() }));
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [hover, setHover] = useState<Date | null>(null);
  const [step, setStep] = useState<'dates' | 'engine'>('dates');
  const [party, setParty] = useState({ adults: 2, kids: 0 });

  useEffect(() => {
    const onOpen = (e: Event) => {
      const d = (e as CustomEvent<OpenBookingDetail | undefined>).detail;
      if (d?.checkin && d?.checkout && d.checkout > d.checkin) {
        setCheckIn(d.checkin); setCheckOut(d.checkout);
        setCal({ year: d.checkin.getFullYear(), month: d.checkin.getMonth() });
        setParty({ adults: d.adults ?? 2, kids: d.children ?? 0 });
        setStep('engine');
      } else setStep('dates');
      setOpen(true);
    };
    window.addEventListener('open-booking', onOpen);
    return () => window.removeEventListener('open-booking', onOpen);
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false); };
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    return () => { window.removeEventListener('keydown', onKey); document.documentElement.style.overflow = ''; };
  }, [open]);

  const right = useMemo(() => {
    const d = new Date(cal.year, cal.month + 1, 1);
    return { year: d.getFullYear(), month: d.getMonth() };
  }, [cal]);

  const prev = () => setCal((c) => { const d = new Date(c.year, c.month - 1, 1); return { year: d.getFullYear(), month: d.getMonth() }; });
  const next = () => setCal((c) => { const d = new Date(c.year, c.month + 1, 1); return { year: d.getFullYear(), month: d.getMonth() }; });
  const canPrev = cal.year > today.getFullYear() || (cal.year === today.getFullYear() && cal.month > today.getMonth());

  const pick = (d: Date) => {
    if (!checkIn || checkOut) { setCheckIn(d); setCheckOut(null); return; }
    if (d <= checkIn) { setCheckIn(d); setCheckOut(null); return; }
    setCheckOut(d);
  };

  const nights = checkIn && checkOut ? Math.round((checkOut.getTime() - checkIn.getTime()) / 86400000) : 0;
  const valid = nights >= MIN_NIGHTS;
  const tooShort = !!checkIn && !!checkOut && nights < MIN_NIGHTS;

  const reset = () => { setCheckIn(null); setCheckOut(null); setHover(null); };
  const bookingUrl = valid && checkIn && checkOut ? buildBookingUrl(checkIn, checkOut) : undefined;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          data-booking-modal=""
          className={`fixed inset-0 z-[320] flex items-center justify-center ${step === 'engine' ? 'p-0 md:p-6' : 'p-4 md:p-8'}`}
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
          onClick={() => setOpen(false)}
        >
          <div className="absolute inset-0 bg-night/80 backdrop-blur-md" />
          <motion.div
            className={`relative z-10 w-full overflow-hidden flex flex-col ${step === 'engine' ? 'max-w-[1120px] h-[100dvh] md:h-[min(920px,calc(100dvh-48px))] rounded-none md:rounded-[22px]' : 'max-w-[640px] rounded-[22px]'}`}
            style={{ background: '#232924', border: '1px solid rgba(231,222,199,0.10)', boxShadow: '0 40px 100px rgba(0,0,0,0.55)' }}
            initial={{ opacity: 0, scale: 0.96, y: 18 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.97, y: 10 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            onMouseLeave={() => setHover(null)}
          >
            {step === 'engine' && checkIn && checkOut ? (
              <>
                <div className="flex items-center justify-between" style={{ gap: 12, padding: '12px 14px', borderBottom: '1px solid rgba(231,222,199,0.10)' }}>
                  <button onClick={() => setStep('dates')} className="flex items-center gap-1 rounded-full text-linen/75 hover:text-linen hover:bg-linen/10 transition-colors" style={{ padding: '8px 12px 8px 8px', fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13 }}>
                    <ChevronLeft size={17} /> Edit dates
                  </button>
                  <p className="text-linen/70 truncate" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 13 }}>
                    {fmtLong(checkIn)} → {fmtLong(checkOut)} · {nights} night{nights !== 1 ? 's' : ''}
                  </p>
                  <button onClick={() => setOpen(false)} aria-label="Close" className="flex items-center justify-center rounded-full text-linen/55 hover:text-linen hover:bg-linen/10 transition-colors" style={{ width: 36, height: 36, flexShrink: 0 }}>
                    <X size={18} />
                  </button>
                </div>
                <Engine checkIn={checkIn} checkOut={checkOut} adults={party.adults} kids={party.kids} />
              </>
            ) : (<>
            {/* Header */}
            <div className="flex items-start justify-between" style={{ padding: 'clamp(20px, 3vw, 30px) clamp(20px, 3vw, 30px) 0' }}>
              <div>
                <p className="font-eyebrow text-signal uppercase" style={{ fontSize: 10.5, letterSpacing: '0.24em', marginBottom: 8 }}>Reserve your stay</p>
                <h3 className="font-display text-linen" style={{ fontVariationSettings: '"opsz" 72, "SOFT" 40', fontWeight: 380, fontSize: 'clamp(1.4rem, 3vw, 1.9rem)', lineHeight: 1.05, letterSpacing: '-0.02em' }}>
                  Choose your dates
                </h3>
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close" className="flex items-center justify-center rounded-full text-linen/55 hover:text-linen hover:bg-linen/10 transition-colors" style={{ width: 36, height: 36, flexShrink: 0 }}>
                <X size={18} />
              </button>
            </div>

            {/* Calendars */}
            <div style={{ padding: 'clamp(16px, 2.4vw, 24px) clamp(20px, 3vw, 30px) 0' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <button onClick={prev} disabled={!canPrev} aria-label="Previous month" className="flex items-center justify-center rounded-full text-linen/60 hover:text-linen hover:bg-linen/10 disabled:opacity-20 disabled:pointer-events-none transition-colors" style={{ width: 34, height: 34 }}>
                  <ChevronLeft size={18} />
                </button>
                <button onClick={next} aria-label="Next month" className="flex items-center justify-center rounded-full text-linen/60 hover:text-linen hover:bg-linen/10 transition-colors" style={{ width: 34, height: 34 }}>
                  <ChevronRight size={18} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2" style={{ gap: 'clamp(20px, 3vw, 36px)' }}>
                <Month year={cal.year} month={cal.month} today={today} checkIn={checkIn} checkOut={checkOut} hover={hover} onPick={pick} onHover={setHover} />
                <div className="hidden md:block">
                  <Month year={right.year} month={right.month} today={today} checkIn={checkIn} checkOut={checkOut} hover={hover} onPick={pick} onHover={setHover} />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: 'clamp(16px, 2.4vw, 22px) clamp(20px, 3vw, 30px) clamp(20px, 3vw, 28px)', marginTop: 'clamp(8px, 1.5vw, 14px)' }}>
              {/* selection + guests */}
              <div className="flex flex-wrap items-center justify-between" style={{ gap: 12, paddingTop: 16, borderTop: '1px solid rgba(231,222,199,0.10)', marginBottom: 16 }}>
                <div className="flex items-center" style={{ gap: 'clamp(12px, 2vw, 22px)' }}>
                  <div>
                    <p className="font-eyebrow text-linen/40 uppercase" style={{ fontSize: 9, letterSpacing: '0.2em', marginBottom: 3 }}>Check-in</p>
                    <p className="font-display text-linen" style={{ fontVariationSettings: '"opsz" 24', fontWeight: 400, fontSize: 'clamp(0.92rem, 1.5vw, 1.05rem)' }}>{fmtLong(checkIn)}</p>
                  </div>
                  <span className="text-linen/25">→</span>
                  <div>
                    <p className="font-eyebrow text-linen/40 uppercase" style={{ fontSize: 9, letterSpacing: '0.2em', marginBottom: 3 }}>Check-out</p>
                    <p className="font-display text-linen" style={{ fontVariationSettings: '"opsz" 24', fontWeight: 400, fontSize: 'clamp(0.92rem, 1.5vw, 1.05rem)' }}>{fmtLong(checkOut)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-linen/55" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12.5 }}>
                  <Users size={15} />
                  <span>Up to {MAX_GUESTS} guests</span>
                </div>
              </div>

              <div className="flex items-center justify-between" style={{ gap: 14, flexWrap: 'wrap' }}>
                <p style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 12.5, color: tooShort ? '#E0926A' : 'rgba(231,222,199,0.45)', lineHeight: 1.4 }}>
                  {tooShort ? `${MIN_NIGHTS}-night minimum` : nights >= MIN_NIGHTS ? `${nights} night${nights > 1 ? 's' : ''} selected` : `${MIN_NIGHTS}-night minimum`}
                </p>
                <a
                  href={bookingUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-disabled={!valid}
                  onClick={(e) => {
                    e.preventDefault();
                    if (!valid) return;
                    setStep('engine');
                  }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: valid ? '#B05329' : 'rgba(231,222,199,0.12)',
                    color: valid ? '#F2EDE3' : 'rgba(231,222,199,0.4)',
                    padding: 'clamp(12px, 1.6vh, 15px) clamp(26px, 3vw, 38px)',
                    borderRadius: 999, border: 'none',
                    textDecoration: 'none',
                    cursor: valid ? 'pointer' : 'default',
                    pointerEvents: valid ? 'auto' : 'none',
                    fontFamily: 'Inter Tight, Inter, system-ui, sans-serif',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
                    transition: 'background 0.25s ease, color 0.25s ease',
                  }}
                >
                  Check availability
                  <span style={{ fontSize: 14, lineHeight: 1 }}>→</span>
                </a>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12 }}>
                <a
                  href={CONTACT_WHATSAPP_HREF}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 10,
                    background: 'transparent',
                    color: 'rgba(231,222,199,0.85)',
                    border: '1px solid rgba(231,222,199,0.3)',
                    padding: 'clamp(12px, 1.6vh, 15px) clamp(26px, 3vw, 38px)',
                    borderRadius: 999,
                    textDecoration: 'none',
                    cursor: 'pointer',
                    fontFamily: 'Inter Tight, Inter, system-ui, sans-serif',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.22em', textTransform: 'uppercase',
                    transition: 'background 0.25s ease, border-color 0.25s ease',
                  }}
                >
                  <WhatsAppIcon />
                  Chat with Us
                </a>
              </div>
              {(checkIn || checkOut) && (
                <button onClick={reset} className="text-linen/40 hover:text-linen/70 transition-colors" style={{ fontFamily: 'Inter, system-ui, sans-serif', fontSize: 11.5, marginTop: 12, cursor: 'pointer' }}>
                  Clear dates
                </button>
              )}
            </div>
            </>)}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
