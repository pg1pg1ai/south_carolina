import { useState } from 'react';
import { PRIVACY_POLICY_PATH, PRIVACY_POLICY_UPDATED } from '../../pages/PrivacyPolicy';

/** Value sent with every form submission once the box is ticked, so each lead email records the consent. */
export const CONSENT_RECORD = `Agreed to the Privacy Policy (last updated ${PRIVACY_POLICY_UPDATED})`;

/**
 * "I agree to the Privacy Policy" checkbox shared by every lead form.
 * Forms must not submit until `checked` is true; `err` highlights it after a blocked submit.
 */
export default function ConsentCheckbox({
  id, checked, onChange, err,
}: {
  id: string;
  checked: boolean;
  onChange: (v: boolean) => void;
  err?: boolean;
}) {
  // The forms flash `err` for ~1s; keep the consent hint up until the box is actually ticked.
  const [missing, setMissing] = useState(false);
  if (err && !checked && !missing) setMissing(true);
  if (checked && missing) setMissing(false);
  return (
    <div className="mb-5 mt-1">
      <label htmlFor={id} className="flex items-start gap-2.5 cursor-pointer font-eyebrow font-light text-ink2" style={{ fontSize: 12, lineHeight: 1.5, letterSpacing: '0.02em' }}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          required
          aria-invalid={missing || undefined}
          className="mt-[2px] h-4 w-4 shrink-0 cursor-pointer accent-signal"
          style={{ outline: missing ? '2px solid #B05329' : undefined, outlineOffset: 2 }}
        />
        <span>
          I agree to the{' '}
          <a href={PRIVACY_POLICY_PATH} target="_blank" rel="noopener noreferrer" className="text-ink underline underline-offset-2 hover:opacity-70">
            Privacy Policy
          </a>
          {' '}and to Horizons Sandhills contacting me about my request.
        </span>
      </label>
      {missing && (
        <p className="font-eyebrow font-light mt-1.5 pl-[26px]" style={{ fontSize: 11, color: '#B05329' }} role="alert">
          Please tick the box to send your request.
        </p>
      )}
    </div>
  );
}
