import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export default function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
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

  return (
    <button
      onClick={copy}
      className="no-print inline-flex items-center gap-1.5 rounded-full border border-ink/20 px-3 py-1.5 eyebrow text-ink2 hover:bg-ink/5 transition-colors"
      aria-label={`${label}: ${value}`}
    >
      {copied ? <Check size={12} strokeWidth={2} className="text-signal" /> : <Copy size={12} strokeWidth={1.6} />}
      {copied ? 'Copied' : label}
    </button>
  );
}
