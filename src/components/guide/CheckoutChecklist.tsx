import { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import Button from '../primitives/Button';
import { guideData as g, smsHref } from '../data/guide';

const STORAGE_KEY = 'hs-guide-checkout-v1';

export default function CheckoutChecklist() {
  const items = g.checkout.items;
  const [checked, setChecked] = useState<boolean[]>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const arr = raw ? (JSON.parse(raw) as unknown) : null;
      if (Array.isArray(arr) && arr.length === items.length && arr.every((v) => typeof v === 'boolean')) {
        return arr;
      }
    } catch { /* private mode etc. — fall through to fresh state */ }
    return items.map(() => false);
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(checked)); } catch { /* ignore */ }
  }, [checked]);

  const done = checked.filter(Boolean).length;

  return (
    <div className="guide-card rounded-2xl border border-divider bg-white/40 p-6 md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="eyebrow text-ink2">Checkout time · {g.checkout.time}</p>
        <p className="eyebrow text-signal">Progress {done} / {items.length}</p>
      </div>

      <ul className="mt-6 space-y-1">
        {items.map((item, i) => (
          <li key={item}>
            <button
              onClick={() => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
              className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 text-left hover:bg-ink/5 transition-colors"
              aria-pressed={checked[i]}
            >
              <span className={`grid h-5 w-5 shrink-0 place-items-center rounded border transition-colors ${
                checked[i] ? 'border-signal bg-signal text-linen' : 'border-ink/30 bg-transparent'
              }`}>
                {checked[i] && <Check size={12} strokeWidth={2.5} />}
              </span>
              <span className={`text-[15px] ${checked[i] ? 'text-ink2 line-through' : 'text-ink'}`}>{item}</span>
            </button>
          </li>
        ))}
      </ul>

      <p className="mt-5 text-[13px] leading-relaxed text-ink2">{g.checkout.lateNote}</p>

      <div className="no-print mt-5 flex flex-wrap gap-2">
        <Button href={smsHref(g.checkout.lateSms)} variant="secondary" className="!py-2.5 !px-6 !min-h-0">Request Late Checkout</Button>
        <Button href={smsHref(g.checkout.doneSms)} variant="primary" className="!py-2.5 !px-6 !min-h-0">I've Checked Out</Button>
      </div>
    </div>
  );
}
