import { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { PRIVACY_CHOICES_EVENT, hasGPC, isAdOptOut, setAdOptOut } from '../../lib/privacyChoices';
import { PRIVACY_POLICY_PATH } from '../../pages/PrivacyPolicy';

/** "Your Privacy Choices" dialog: opt out of targeted advertising (Google Ads + Meta) for this browser. */
export default function PrivacyChoicesModal() {
  const [open, setOpen] = useState(false);
  const [optOut, setOptOut] = useState(false);
  const [saved, setSaved] = useState(false);
  const [gpc, setGpc] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const onOpen = () => {
      lastFocused.current = document.activeElement as HTMLElement | null;
      setGpc(hasGPC());
      setOptOut(isAdOptOut());
      setSaved(false);
      setOpen(true);
    };
    window.addEventListener(PRIVACY_CHOICES_EVENT, onOpen);
    return () => window.removeEventListener(PRIVACY_CHOICES_EVENT, onOpen);
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    lastFocused.current?.focus?.();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    panelRef.current?.focus();
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  const save = () => {
    setAdOptOut(optOut);
    setSaved(true);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[450] flex items-center justify-center p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
          style={{ background: 'rgba(20,18,14,0.72)' }}
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
        >
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="privacy-choices-title"
            tabIndex={-1}
            className="relative w-full bg-bone outline-none px-8 py-10"
            style={{ maxWidth: 480, maxHeight: 'calc(100vh - 32px)', overflowY: 'auto', borderRadius: 4 }}
            initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 16 }}
            transition={{ duration: 0.36, ease: [0.22, 1, 0.36, 1] }}
          >
            <button onClick={close} className="absolute top-4 right-4 text-ink2 hover:text-ink transition-colors" style={{ fontSize: 22, lineHeight: 1, background: 'none', border: 'none', cursor: 'pointer' }} aria-label="Close">×</button>

            <p id="privacy-choices-title" className="font-display italic text-ink mb-3" style={{ fontSize: '1.4rem', lineHeight: 1.25 }}>Your Privacy Choices</p>
            <p className="text-ink2 text-sm leading-relaxed mb-5">
              We use Google Ads and the Meta Pixel to measure our ads and to show our ads to people who have visited our website.
              You can opt out of this targeted advertising for this browser.
            </p>

            {gpc && (
              <p className="text-ink text-sm leading-relaxed mb-5 px-4 py-3 bg-boneWarm border border-divider">
                Your browser is sending a <strong className="font-medium">Global Privacy Control</strong> signal, so you are already opted out of targeted advertising on this browser.
              </p>
            )}

            <label htmlFor="privacy-choices-optout" className={`flex items-start gap-3 mb-5 ${gpc ? 'cursor-default opacity-70' : 'cursor-pointer'}`}>
              <input
                id="privacy-choices-optout"
                type="checkbox"
                checked={optOut || gpc}
                disabled={gpc}
                onChange={(e) => { setOptOut(e.target.checked); setSaved(false); }}
                className="mt-[3px] h-4 w-4 shrink-0 accent-signal"
              />
              <span className="text-ink text-sm leading-relaxed">
                <strong className="font-medium">Opt out of targeted advertising</strong><br />
                <span className="text-ink2">Stops the Google Ads and Meta advertising tags on our website from collecting data from this browser.</span>
              </span>
            </label>

            <p className="text-ink2 text-xs leading-relaxed mb-7">
              This choice is stored in your browser, so you will need to repeat it on each device and browser you use, and after clearing cookies.
              See our <a href={PRIVACY_POLICY_PATH} className="text-ink underline underline-offset-2 hover:opacity-70">Privacy Policy</a> for details.
            </p>

            {!gpc && (
              <button
                onClick={save}
                className="w-full font-eyebrow font-light text-white bg-signal hover:bg-signal2 transition-colors py-3"
                style={{ fontSize: 11, letterSpacing: '0.22em', textTransform: 'uppercase', borderRadius: 0, border: 'none', cursor: 'pointer' }}
              >
                Save my choice
              </button>
            )}
            {saved && (
              <p className="text-center text-sm mt-4" style={{ color: '#3E4F3A' }} role="status">
                {optOut ? 'Saved. You are opted out of targeted advertising on this browser.' : 'Saved. Targeted advertising is allowed on this browser.'}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
