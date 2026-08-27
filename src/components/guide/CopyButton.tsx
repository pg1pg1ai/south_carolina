import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

interface Props {
  value: string;
  label?: string;
  accent?: 'orange';
}

export default function CopyButton({ value, label = 'Copy', accent }: Props) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Clipboard unavailable (permissions/HTTP) — leave the value visible for manual copy.
    }
  };

  const tone = accent === 'orange'
    ? 'border-signal/40 text-signal hover:bg-signal/10'
    : 'border-ink/20 text-ink2 hover:bg-ink/5';

  return (
    <button
      onClick={copy}
      className={`no-print inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 eyebrow transition-colors ${tone}`}
      aria-label={`${label}: ${value}`}
    >
      {copied ? <Check size={12} strokeWidth={2} className="text-signal" /> : <Copy size={12} strokeWidth={1.6} />}
      {copied ? 'Copied' : label}
    </button>
  );
}
