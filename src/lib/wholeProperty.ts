/**
 * Whole-property availability for /events, read live from the Cloudbeds booking engine
 * (the same public availability_calendar the booking window uses; works from the browser).
 * A night is free for a buyout only when all 6 Forest Villas are free. The Guest House is
 * not in Cloudbeds (owner, 2026-11-19: team-only add-on), so online price = 6 villas.
 */

const API = 'https://us2.cloudbeds.com/booking/availability_calendar';
const PROPERTY_ID = '66970802221197'; // Horizons Sandhills in Cloudbeds
export const VILLAS = 6;

type Row = { rate: string; avail: number | string; closed: number | string };
type Calendar = Record<string, Row[]>;

export const iso = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const parseIso = (s: string) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const nightsBetween = (a: Date, b: Date) => Math.round((b.getTime() - a.getTime()) / 86400000);

async function load(start: Date, end: Date): Promise<Calendar> {
  const body = new URLSearchParams({ property_id: PROPERTY_ID, start_date: iso(start), end_date: iso(end) });
  const r = await fetch(API, { method: 'POST', body });
  if (!r.ok) throw new Error(String(r.status));
  return r.json();
}

/** Price of the whole property that night (all villas free), or null if not bookable. */
function nightPrice(cal: Calendar, day: string): number | null {
  const ok = (cal[day] ?? []).filter((x) => +x.avail >= VILLAS && !+x.closed && +x.rate > 0);
  if (!ok.length) return null;
  return Math.min(...ok.map((x) => +x.rate)) * VILLAS;
}

function stay(cal: Calendar, a: Date, nights: number): number | null {
  let sum = 0;
  for (let i = 0; i < nights; i++) {
    const p = nightPrice(cal, iso(addDays(a, i)));
    if (p === null) return null;
    sum += p;
  }
  return sum;
}

export type Option = { arrive: string; leave: string; total: number };
export type Check =
  | { status: 'open'; nights: number; total: number }
  | { status: 'taken'; nights: number; alts: Option[] }
  | { status: 'notyet'; nights: number };

export async function checkWholeProperty(arrive: string, leave: string): Promise<Check> {
  const a = parseIso(arrive), l = parseIso(leave);
  const nights = nightsBetween(a, l);
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const from = new Date(Math.max(today.getTime(), addDays(a, -28).getTime()));
  const cal = await load(from, addDays(l, 75));
  const total = stay(cal, a, nights);
  if (total !== null) return { status: 'open', nights, total };

  // Nothing loaded yet for those dates: the calendar isn't open that far ahead.
  const lastWithRates = Object.keys(cal).filter((k) => (cal[k] ?? []).length).sort().pop();
  if (!lastWithRates || iso(a) > lastWithRates) return { status: 'notyet', nights };

  // Nearest stays of the same length, preferring the same weekday.
  const found: (Option & { gap: number; same: boolean })[] = [];
  for (let s = from; s <= addDays(a, 70); s = addDays(s, 1)) {
    if (iso(s) === arrive) continue;
    const t = stay(cal, s, nights);
    if (t !== null) found.push({ arrive: iso(s), leave: iso(addDays(s, nights)), total: t, gap: Math.abs(nightsBetween(a, s)), same: s.getDay() === a.getDay() });
  }
  found.sort((x, y) => Number(y.same) - Number(x.same) || x.gap - y.gap);
  return { status: 'taken', nights, alts: found.slice(0, 3).map(({ arrive: ar, leave: le, total: to }) => ({ arrive: ar, leave: le, total: to })) };
}

/** "Mar 12 to 14" / "Mar 30 to Apr 2" */
export function rangeLabel(arrive: string, leave: string): string {
  const a = parseIso(arrive), l = parseIso(leave);
  const m = (d: Date) => d.toLocaleString('en-US', { month: 'short' });
  return a.getMonth() === l.getMonth() ? `${m(a)} ${a.getDate()} to ${l.getDate()}` : `${m(a)} ${a.getDate()} to ${m(l)} ${l.getDate()}`;
}
