// ── Cloudbeds booking ─────────────────────────────────────────────────────────
// Every booking CTA opens BookingModal. Guests pick dates there, then Cloudbeds'
// "immersive experience" booking engine loads INSIDE the same window (rooms,
// guest details, payment), so they never leave the site. Same approach as
// gohorizons.ge. CLOUDBEDS_RESERVATION_URL stays only as a fallback link.

export const CLOUDBEDS_RESERVATION_URL = 'https://us2.cloudbeds.com/en/reservation/Dc79Gd/';
export const CLOUDBEDS_PROPERTY_CODE = 'Dc79Gd';
export const CLOUDBEDS_ISLAND = 'us2';
export const CLOUDBEDS_ENGINE_LOADER =
  'https://static1.cloudbeds.com/booking-engine/latest/static/js/immersive-experience/cb-immersive-experience.js';

export const MAX_GUESTS = 4;
export const MIN_NIGHTS = 1;

/** Local YYYY-MM-DD (avoids the UTC day-shift that toISOString causes). */
export function fmtIso(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

export function buildBookingUrl(checkin: Date, checkout: Date, currency = 'usd'): string {
  const params = new URLSearchParams({
    currency,
    checkin: fmtIso(checkin),
    checkout: fmtIso(checkout),
  });
  return `${CLOUDBEDS_RESERVATION_URL}?${params.toString()}`;
}

export interface OpenBookingDetail { checkin?: Date; checkout?: Date; adults?: number; children?: number; }

/** Fire from any booking button to open the global booking modal. With dates it goes straight to the engine. */
// Also used directly as an onClick handler, so anything that isn't a dates object (e.g. a click event) is ignored.
export const openBooking = (detail?: OpenBookingDetail | unknown) => {
  const d = detail && typeof detail === 'object' && 'checkin' in detail ? (detail as OpenBookingDetail) : undefined;
  window.dispatchEvent(new CustomEvent<OpenBookingDetail | undefined>('open-booking', { detail: d }));
};
