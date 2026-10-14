import { useCallback, useEffect, useRef, useState, type FormEvent } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sendInquiry } from '../../lib/sendInquiry';
import { CONTACT_WHATSAPP_HREF } from '../../lib/contact';
import { REQUEST_FORM_EVENT } from '../../lib/requestForm';
import WhatsAppIcon from '../icons/WhatsAppIcon';

const ACCENT = '#B05329'; // brand signal
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function Field({
  id, label, type, ph, val, set, err, autoComplete,
}: {
  id: string;
  label: string;
  type?: string;
  ph: string;
  val: string;
  set: (v: string) => void;
  err?: boolean;
  autoComplete?: string;
}) {
  return (
    <div className="mb-4">
      <label htmlFor={id} className="block font-eyebrow font-light text-ink2 mb-1" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{label}</label>
      <input
        id={id}
        type={type ?? 'text'}
        value={val}
        onChange={(e) => set(e.target.value)}
        placeholder={ph}
        autoComplete={autoComplete}
        required
        className={`w-full bg-boneWarm text-ink font-eyebrow font-light text-sm px-3 py-2.5 outline-none border transition-colors ${err ? 'border-signal' : 'border-divider focus:border-signal'}`}
        style={{ borderRadius: 0 }}
      />
    </div>
  );
}

export default function RequestFormModal({ leadLabel }: { leadLabel: string }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  const emailOk = EMAIL_RE.test(email.trim());

  useEffect(() => {
    const onOpen = () => {
      lastFocused.current = document.activeElement as HTMLElement | null;
      setDone(false);
      setErr(false);
      setOpen(true);
    };
    window.addEventListener(REQUEST_FORM_EVENT, onOpen);
    return () => window.removeEventListener(REQUEST_FORM_EVENT, onOpen);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    const prev = lastFocused.current;
    if (prev && typeof prev.focus === 'function') {
      try { prev.focus(); } catch { /* element may be gone */ }
    }
    lastFocused.current = null;
  }, []);

  // While open: lock page scroll, move focus inside, trap Tab, close on Escape.
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return; }
      if (e.key !== 'Tab' || !panelRef.current) return;
      const items = panelRef.current.querySelectorAll<HTMLElement>('button, a[href], input, select, textarea');
      if (!items.length) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKey);

    const toFocus = panelRef.current?.querySelector<HTMLElement>('input, button, a[href]');
    (toFocus ?? panelRef.current)?.focus();

    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, done]);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!name || !phone || !email || !emailOk) {
      setErr(true);
      setTimeout(() => setErr(false), 1200);
      return;
    }
    setSending(true);
    setSendFailed(false);
    const ok = await sendInquiry('landing-request', { page: leadLabel, name, phone, email });
    setSending(false);
    if (ok) { setDone(true); } else { setSendFailed(true); setTimeout(() => setSendFailed(false), 2500); }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[400] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
          style={{ background: 'rgba(20,18,14,0.72)' }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Plan your stay"
            tabIndex={-1}
            className="relative w-full bg-bone outline-none"
            style={{ maxWidth: 440, maxHeight: 'calc(100vh - 32px)', overflowY: 'auto', borderRadius: 4 }}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={close} className="absolute top-4 right-4 text-ink2 hover:text-ink transition-colors" style={{ fontSize: 22, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Close">×</button>
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center px-10 py-14">
                  <p className="font-display italic mb-2" style={{ fontSize: '1.5rem', color: ACCENT }}>Thank you!</p>
                  <p className="font-eyebrow font-light text-ink2" style={{ fontSize: 12, letterSpacing: '0.1em' }}>
                    We've received your request. Our team will be in touch soon to help you plan your getaway.
                  </p>
                </motion.div>
              ) : (
                <motion.form key="form" onSubmit={submit} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-8 py-10">
                  <p className="font-display italic text-ink mb-1" style={{ fontSize: '1.4rem', lineHeight: 1.25 }}>Let's plan your stay!</p>
                  <p className="font-eyebrow font-light text-ink2 mb-4" style={{ fontSize: 12, letterSpacing: '0.1em' }}>
                    Share your contact details, and we'll help you plan your stay.
                  </p>
                  <p className="font-eyebrow font-light text-ink2 mb-7 flex items-center gap-2" style={{ fontSize: 12, letterSpacing: '0.1em' }}>
                    <a href={CONTACT_WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-ink hover:opacity-70 transition-opacity">
                      <WhatsAppIcon size={15} /> Contact us now
                    </a>
                    <span>or fill out the form below.</span>
                  </p>
                  <Field id="request-form-name" label="Name" ph="First and last" val={name} set={setName} err={err && !name} autoComplete="name" />
                  <Field id="request-form-phone" label="Phone" type="tel" ph="+1 (___) ___-____" val={phone} set={setPhone} err={err && !phone} autoComplete="tel" />
                  <Field id="request-form-email" label="Email" type="email" ph="you@example.com" val={email} set={setEmail} err={err && (!email || !emailOk)} autoComplete="email" />
                  <button type="submit" disabled={sending} className="w-full font-eyebrow font-light text-white hover:brightness-110 transition-all py-3 mt-1 disabled:opacity-60 disabled:cursor-default" style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', borderRadius: 0, border: 'none', cursor: sending ? 'default' : 'pointer', background: sendFailed ? '#9A4722' : ACCENT }}>
                    {sending ? 'Sending…' : sendFailed ? "Couldn't send — try again" : 'Send request'}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
