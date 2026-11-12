// Targeted-advertising opt-out ("Your Privacy Choices" in the footer) + Global Privacy Control.
// The initial state is applied by the inline script at the top of index.html, before Google Tag Manager
// loads; this module reads and changes it afterwards. Keep STORAGE_KEY in sync with index.html.

const STORAGE_KEY = 'hz_ad_opt_out';
export const PRIVACY_CHOICES_EVENT = 'open-privacy-choices';

type Win = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
  fbq?: (...args: unknown[]) => void;
};

/** True when the browser sends a Global Privacy Control signal — always treated as an opt-out. */
export function hasGPC(): boolean {
  return (navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl === true;
}

function savedOptOut(): boolean {
  try { return localStorage.getItem(STORAGE_KEY) === '1'; } catch { return false; }
}

export function isAdOptOut(): boolean {
  return hasGPC() || savedOptOut();
}

/** Saves the choice for this browser and applies it immediately to Google (Consent Mode) and Meta. */
export function setAdOptOut(optOut: boolean): void {
  try {
    if (optOut) localStorage.setItem(STORAGE_KEY, '1');
    else localStorage.removeItem(STORAGE_KEY);
  } catch { /* storage blocked: the choice still applies for this page view */ }

  const effective = optOut || hasGPC();
  const w = window as Win;
  w.dataLayer = w.dataLayer || [];
  const gtag = w.gtag ?? ((...args: unknown[]) => { w.dataLayer!.push(args); });
  const ad = effective ? 'denied' : 'granted';
  gtag('consent', 'update', { ad_storage: ad, ad_user_data: ad, ad_personalization: ad });
  gtag('set', 'ads_data_redaction', effective);
  w.dataLayer.push({ event: 'privacy_choices', ad_opt_out: effective, gpc: hasGPC() });
  if (typeof w.fbq === 'function') w.fbq('consent', effective ? 'revoke' : 'grant');
}

/** Opens the Your Privacy Choices dialog from anywhere (footer link, privacy policy page). */
export const openPrivacyChoices = () => window.dispatchEvent(new CustomEvent(PRIVACY_CHOICES_EVENT));

// If the Meta Pixel is loaded (by GTM) on a page where the visitor has opted out, revoke its consent as soon
// as it appears. GTM should also block the Meta tag via the `ad_opt_out` dataLayer variable — see docs/privacy-choices.md.
if (typeof window !== 'undefined' && isAdOptOut()) {
  let tries = 0;
  const timer = window.setInterval(() => {
    const w = window as Win;
    if (typeof w.fbq === 'function') { w.fbq('consent', 'revoke'); window.clearInterval(timer); }
    else if (++tries > 40) window.clearInterval(timer);
  }, 250);
}
