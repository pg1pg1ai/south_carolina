import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { sendInquiry } from '../../lib/sendInquiry';

const ACCENT = '#B05329';
const DISMISSED_KEY = 'laborDayOfferDismissed';
const SHOW_DELAY_MS = 15000;
const PHONE_HREF = 'tel:+17546679090';
const PHONE_DISPLAY = '(754) 667-9090';

function Field({ label, type, ph, val, set, err }: { label: string; type?: string; ph: string; val: string; set: (v: string) => void; err?: boolean }) {
  const cls = `w-full bg-boneWarm text-ink font-eyebrow font-light text-sm px-3 py-2.5 outline-none border transition-colors ${err ? 'border-signal' : 'border-divider focus:border-signal'}`;
  return (
    <div className="mb-4">
      <label className="block font-eyebrow font-light text-ink2 mb-1" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>{label}</label>
      <input type={type ?? 'text'} value={val} onChange={e => set(e.target.value)} placeholder={ph} className={cls} style={{ borderRadius: 0 }} />
    </div>
  );
}

export default function LaborDayPopup() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [done, setDone] = useState(false);
  const [err, setErr] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendFailed, setSendFailed] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(DISMISSED_KEY)) return;
    const timer = setTimeout(() => setOpen(true), SHOW_DELAY_MS);
    return () => clearTimeout(timer);
  }, []);

  const dismiss = () => {
    localStorage.setItem(DISMISSED_KEY, '1');
    setOpen(false);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dismiss(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const submit = async () => {
    if (!name || !phone) { setErr(true); setTimeout(() => setErr(false), 1200); return; }
    setSending(true);
    setSendFailed(false);
    const ok = await sendInquiry('labor-day-offer', { name, phone, email });
    setSending(false);
    if (ok) {
      localStorage.setItem(DISMISSED_KEY, '1');
      setDone(true);
    } else {
      setSendFailed(true);
      setTimeout(() => setSendFailed(false), 2500);
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[400] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
          style={{ background: 'rgba(20,18,14,0.72)' }}
          onClick={(e) => { if (e.target === e.currentTarget) dismiss(); }}
        >
          <motion.div
            className="relative w-full bg-bone"
            style={{ maxWidth: 440, borderRadius: 4 }}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={dismiss} className="absolute top-4 right-4 text-ink2 hover:text-ink transition-colors" style={{ fontSize: 22, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            <AnimatePresence mode="wait">
              {done ? (
                <motion.div key="done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center px-10 py-14">
                  <p className="font-display italic mb-2" style={{ fontSize: '1.5rem', color: ACCENT }}>Offer request received.</p>
                  <p className="font-eyebrow font-light text-ink2" style={{ fontSize: 12, letterSpacing: '0.1em' }}>We'll be in touch with your special Labor Day offer shortly.</p>
                </motion.div>
              ) : (
                <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="px-8 py-10">
                  <div className="flex items-center gap-3 mb-1">
                    <span style={{ width: 28, height: 2, background: ACCENT, flexShrink: 0 }} />
                    <span className="font-eyebrow font-light" style={{ fontSize: 10, letterSpacing: '0.26em', textTransform: 'uppercase', color: ACCENT }}>Limited Labor Day offer</span>
                  </div>
                  <p className="font-display italic text-ink mb-1" style={{ fontSize: '1.4rem', lineHeight: 1.25 }}>Have plans for Labor Day?</p>
                  <p className="font-eyebrow font-light text-ink2 mb-6" style={{ fontSize: 12, letterSpacing: '0.1em' }}>Contact us now to get your <strong className="font-medium text-ink">special Labor Day offer</strong>, or leave your details and our team will get back to you.</p>
                  <a
                    href={PHONE_HREF}
                    className="eyebrow flex items-center justify-center w-full text-white hover:brightness-110 transition-all mb-6"
                    style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', padding: '12px 0', borderRadius: 999, background: ACCENT }}
                  >
                    Call {PHONE_DISPLAY}
                  </a>
                  <div className="flex items-center gap-3 mb-6">
                    <span style={{ height: 1, flex: 1, background: '#D9CEB8' }} />
                    <span className="font-eyebrow font-light text-ink2" style={{ fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase' }}>Or leave your details</span>
                    <span style={{ height: 1, flex: 1, background: '#D9CEB8' }} />
                  </div>
                  <Field label="Name"  ph="First and last"    val={name}  set={setName}  err={err && !name} />
                  <Field label="Phone" type="tel"   ph="(754) 667-9090"   val={phone} set={setPhone} err={err && !phone} />
                  <Field label="Email (optional)" type="email" ph="you@example.com" val={email} set={setEmail} />
                  <button onClick={submit} disabled={sending} className="w-full font-eyebrow font-light text-white hover:brightness-110 transition-all py-3 mt-1 disabled:opacity-60 disabled:cursor-default" style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', borderRadius: 0, border: 'none', cursor: sending ? 'default' : 'pointer', background: sendFailed ? '#9A2E22' : ACCENT }}>
                    {sending ? 'Sending…' : sendFailed ? "Couldn't send — try again" : 'Get my special offer'}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
