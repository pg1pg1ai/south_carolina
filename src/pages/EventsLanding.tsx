import { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import {
  AnimatePresence, animate, motion, useInView, useMotionValueEvent, useReducedMotion, useScroll, useTransform,
} from 'framer-motion';
import Footer from '../components/blocks/Footer';
import BookingModal from '../components/blocks/BookingModal';
import GettingHere from '../components/blocks/GettingHere';
import ConsentCheckbox, { CONSENT_RECORD } from '../components/primitives/ConsentCheckbox';
import WhatsAppIcon from '../components/icons/WhatsAppIcon';
import { guideData } from '../components/data/guide';
import {
  EVENT_TYPES, MAP_CROP, NIGHTLY_RATE, DEPOSIT, activities, eventsSeo, facts, faq, formats, hero, included,
  occasions, reviews, spaces, steps, why, type EventType,
} from '../components/data/events';
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_HREF, CONTACT_WHATSAPP_HREF } from '../lib/contact';
import { sendInquiry } from '../lib/sendInquiry';
import { SITE_ORIGIN } from '../lib/site';
import '../components/events/events.css';

/**
 * /events — sells the whole property for private events and collects requests (team brief, Nov 2026).
 * One dark page; display type is Urbanist. Every CTA scrolls to the inline request form (#plan); the
 * format cards, the hero quick-check and the estimator pre-fill it. Requests post to /api/send-inquiry.
 */

const EASE = [0.22, 1, 0.36, 1] as const;
const Arrow = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
);

function scrollToPlan() {
  document.getElementById('plan')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function useMedia(query: string) {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setM(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return m;
}

function Rv({ children, className, delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div className={className} initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }} transition={{ duration: 1.1, ease: EASE, delay }}>
      {children}
    </motion.div>
  );
}

function Count({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduce = useReducedMotion();
  const [v, setV] = useState(reduce ? to : 0);
  useEffect(() => {
    if (!inView || reduce) return;
    const c = animate(0, to, { duration: 2, ease: EASE, onUpdate: (x) => setV(Math.round(x)) });
    return () => c.stop();
  }, [inView, reduce, to]);
  return <span ref={ref}>{v}</span>;
}

/* ---------------- header + progress ---------------- */
function Header() {
  const [solid, setSolid] = useState(false);
  const { scrollY, scrollYProgress } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => setSolid(y > 40));
  return (
    <>
      <motion.div className="prog" style={{ scaleX: scrollYProgress }} />
      <header className={`hd g${solid ? ' solid' : ''}`}>
        <a className="logo" href="/" aria-label="Horizons Sandhills home"><img src="/logo.svg" alt="Horizons Getaways" /></a>
        <span className="mid">Private Events · Horizons Sandhills</span>
        <div className="r">
          <a className="btn ghost wa" href={CONTACT_WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" aria-label="Text us on WhatsApp"><WhatsAppIcon /></a>
          <button type="button" className="btn" onClick={scrollToPlan}>Plan Your Event</button>
        </div>
      </header>
    </>
  );
}

/* ---------------- hero ---------------- */
function Hero() {
  const reduce = useReducedMotion();
  const lines = [...hero.lines.map((l) => <span key={l}>{l}</span>), <span key="a"><em>{hero.accent}</em></span>];
  return (
    <section className="hero g">
      <div className="bg" style={{ backgroundImage: `url(${hero.image})` }} />
      <span className="coord">34.6046° N · 80.0974° W</span>
      <div className="in w">
        <motion.p className="eb" initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.5 }}>{hero.eyebrow}</motion.p>
        <h1>
          {lines.map((l, i) => (
            <span className="ln" key={i}>
              <motion.span initial={reduce ? false : { y: '110%' }} animate={{ y: 0 }} transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.2 + i * 0.12 }}>{l}</motion.span>
            </span>
          ))}
        </h1>
        <motion.div className="hrow" initial={reduce ? false : { opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, ease: EASE, delay: 0.8 }}>
          <p className="sub">{hero.sub}</p>
          <div className="btns">
            <button type="button" className="btn" onClick={scrollToPlan}>Plan Your Event <Arrow /></button>
            <a className="btn ghost" href={CONTACT_WHATSAPP_HREF} target="_blank" rel="noopener noreferrer"><WhatsAppIcon /> Text Us on WhatsApp</a>
          </div>
        </motion.div>
      </div>
      <span className="cue" />
    </section>
  );
}

type Plan = { type: EventType; dates: string; guests: number; note: string };

function FactsAndQuickCheck({ onCheck }: { onCheck: (p: Partial<Plan>) => void }) {
  const [type, setType] = useState<EventType>('Corporate Retreat');
  const [dates, setDates] = useState('');
  const [guests, setGuests] = useState('');
  return (
    <div className="g"><div className="w">
      <Rv className="facts">
        {facts.map((f) => (
          <div key={f.label}>
            <b>{'value' in f ? <><Count to={f.value} />{'suffix' in f ? f.suffix : ''}</> : f.text}</b>
            <span>{f.label}</span>
          </div>
        ))}
      </Rv>
      <Rv>
        <form className="qc" onSubmit={(e) => { e.preventDefault(); onCheck({ type, dates, guests: guests ? Number(guests) : undefined }); scrollToPlan(); }}>
          <label><small>Your occasion</small>
            <select value={type} onChange={(e) => setType(e.target.value as EventType)}>{EVENT_TYPES.map((t) => <option key={t}>{t}</option>)}</select>
          </label>
          <label><small>Dates</small><input value={dates} onChange={(e) => setDates(e.target.value)} placeholder="Add dates" /></label>
          <label><small>Guests</small><input value={guests} onChange={(e) => setGuests(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="How many" /></label>
          <button className="btn" type="submit">Check My Dates <Arrow /></button>
        </form>
        <p className="qcn">No commitment. Our team replies within an hour.</p>
      </Rv>
    </div></div>
  );
}

function Marquee() {
  return <div className="mq" aria-hidden="true"><div>{[...occasions, ...occasions].map((o, i) => <span key={i}>{o}</span>)}</div></div>;
}

function Why() {
  return (
    <section className="g"><div className="w one">
      <Rv><p className="eb">Why Horizons Sandhills</p><div className="big"><Count to={126} /><small>acres, and only one group on them.</small></div></Rv>
      <div>
        <Rv><h2>One Place. <em>One Group.</em></h2></Rv>
        <ul className="pts">
          {why.map((w, i) => (
            <Rv key={w.title}><li><i>0{i + 1}</i><b>{w.title}</b><p>{w.body}</p></li></Rv>
          ))}
        </ul>
      </div>
    </div></section>
  );
}

function Reviews() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  useEffect(() => {
    if (paused || reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % reviews.length), 6000);
    return () => clearInterval(t);
  }, [paused, reduce]);
  return (
    <section className="qb g" style={{ backgroundImage: 'linear-gradient(180deg,#141915,rgba(20,25,21,.55) 30%,rgba(20,25,21,.55) 70%,#141915),url(/images/sandhills/waiting.webp)' }}>
      <div className="w">
        <p className="eb">Five stars on Google</p><span className="stars" aria-label="5 out of 5 stars">★★★★★</span>
        <div className="qslides" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>{reviews.map((r, k) => <blockquote key={r.name} className={k === i ? 'on' : ''} aria-hidden={k !== i}>“{r.quote}”</blockquote>)}</div>
        <div className="qmeta"><cite>{reviews[i].name} · Google review</cite><div className="qdots">{reviews.map((r, k) => <button key={r.name} type="button" className={k === i ? 'on' : ''} onClick={() => setI(k)} aria-label={`Show review ${k + 1}`} />)}</div></div>
      </div>
    </section>
  );
}

/* ---------------- formats reel (pinned horizontal scroll on desktop) ---------------- */
function Formats({ onPick }: { onPick: (t: EventType) => void }) {
  const wide = useMedia('(min-width: 1000px)');
  const reduce = useReducedMotion();
  const pin = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  useLayoutEffect(() => {
    const el = track.current; if (!el) return;
    const measure = () => setDist(Math.max(0, el.scrollWidth - window.innerWidth));
    measure();
    const ro = new ResizeObserver(measure); ro.observe(el);
    window.addEventListener('resize', measure);
    return () => { ro.disconnect(); window.removeEventListener('resize', measure); };
  }, []);
  const { scrollYProgress } = useScroll({ target: pin, offset: ['start start', 'end end'] });
  const x = useTransform(scrollYProgress, [0, 1], [0, -dist]);
  const pinned = wide && !reduce;
  const pick = (t: EventType) => { onPick(t); scrollToPlan(); };
  return (
    <section className="reel" style={{ padding: 0 }} aria-labelledby="ev-formats">
      <div ref={pin} className="reel-pin" style={{ height: pinned ? `calc(100vh + ${dist}px)` : undefined }}>
        <div className="reel-stick">
          <div className="g"><div className="w reel-hd">
            <div><p className="eb">Event formats</p><h2 id="ev-formats">Built for the Gatherings <em>That Matter.</em></h2></div>
            <p className="lead" style={{ maxWidth: '34ch' }}>Choose your occasion and the request form opens with it already selected.</p>
          </div></div>
          <motion.div ref={track} className="track" style={pinned ? { x } : undefined}>
            {formats.map((f, i) => (
              <button key={f.title} type="button" className="fc" onClick={() => pick(f.type)}>
                <div className="ph" style={{ backgroundImage: `url(${f.image})` }} />
                <span className="num">0{i + 1}</span>
                <div className="tx"><h3>{f.title}</h3><p>{f.body}</p><span className="go">Plan this <Arrow /></span></div>
              </button>
            ))}
            <button type="button" className="fc other" onClick={() => pick('Other')}>
              <div className="tx"><span className="num" style={{ position: 'static' }}>08</span>
                <div><h3>Something Else in Mind?</h3><p>Tell us the occasion. If it fits on 126 acres, we can host it.</p><span className="go" style={{ color: 'var(--bone)' }}>Plan your event <Arrow /></span></div>
              </div>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- estate map ---------------- */
const pinById = Object.fromEntries(guideData.mapPins.map((p) => [p.id, p]));
const cropW = MAP_CROP.x1 - MAP_CROP.x0, cropH = MAP_CROP.y1 - MAP_CROP.y0;
const spotPos = (ids: readonly string[]) => {
  const ps = ids.map((id) => pinById[id]).filter(Boolean);
  const x = ps.reduce((s, p) => s + p.x, 0) / ps.length, y = ps.reduce((s, p) => s + p.y, 0) / ps.length;
  return { left: `${((x - MAP_CROP.x0) / cropW) * 100}%`, top: `${((y - MAP_CROP.y0) / cropH) * 100}%` };
};
// property-map.webp is 2230×1026; show only the crop box, scaled to fill the frame
const MAP_STYLE = {
  backgroundImage: 'url(/images/guide/property-map.webp)',
  backgroundSize: `${(100 / cropW) * 100}% ${(100 / cropH) * 100}%`,
  backgroundPosition: `${(MAP_CROP.x0 / (100 - cropW)) * 100}% ${(MAP_CROP.y0 / (100 - cropH)) * 100}%`,
  aspectRatio: `${2230 * cropW} / ${1026 * cropH}`,
};

function Estate() {
  const [k, setK] = useState<string>('hall');
  const s = spaces.find((x) => x.key === k) ?? spaces[0];
  return (
    <section className="g" style={{ paddingTop: 0 }} aria-labelledby="ev-estate"><div className="w">
      <div className="estate-hd">
        <Rv><p className="eb">The estate</p><h2 id="ev-estate">Indoors, Outdoors, <em>or Both.</em></h2></Rv>
        <Rv><p className="lead">Two indoor event spaces and acres of open land, all on one property. Tap a point on the map to see what it is and how many guests it holds.</p></Rv>
      </div>
      <Rv className="mapwrap">
        <div className="map" style={MAP_STYLE}>
          {spaces.map((x) => (
            <button key={x.key} type="button" className={`pin${x.key === k ? ' on' : ''}`} style={spotPos(x.pins)} onClick={() => setK(x.key)} onMouseEnter={() => setK(x.key)} aria-label={x.title} aria-pressed={x.key === k}>
              <i /><span>{x.title}</span>
            </button>
          ))}
        </div>
        <aside className="panel" aria-live="polite">
          <span className="cat">{s.cat}</span><h3>{s.title}</h3><span className="cap">{s.cap}</span><p>{s.body}</p>
          <div className="lst">{spaces.map((x) => <button key={x.key} type="button" className={x.key === k ? 'on' : ''} onClick={() => setK(x.key)}>{x.title.replace('The ', '')}</button>)}</div>
        </aside>
      </Rv>
    </div></section>
  );
}

/* ---------------- estimator ---------------- */
function Estimator({ onRequest }: { onRequest: (p: Partial<Plan>) => void }) {
  const [g, setG] = useState(40);
  const [n, setN] = useState(2);
  const [over, setOver] = useState(true);
  const villas = over ? Math.min(g, 24) : 0, house = over ? Math.min(Math.max(g - 24, 0), 8) : 0;
  const rv = over ? Math.min(Math.max(g - 32, 0), 68) : 0, day = over ? Math.max(g - 100, 0) : g;
  const sleep = !over ? `A day event for ${g} guests.` : g <= 32 ? 'Everyone sleeps in the villas and the Guest House.'
    : g <= 100 ? `${g - 32} guests stay in RVs on the 16 hookups. We'll connect you with a trusted RV rental vendor.` : `Up to 100 stay overnight; the other ${g - 100} join for the day.`;
  const fit = g <= 30 ? 'The Lounge fits you, and the Event Hall is yours too.' : g <= 70 ? 'The Event Hall seats everyone indoors, with the Lounge for breakouts.'
    : 'Dinner moves outdoors to the fields, with both indoor spaces as the rain plan.';
  const bars = [['Forest Villas', villas, 24], ['Guest House', house, 8], ['RV hookups', rv, 68], ['Day guests', day, 200]] as const;
  return (
    <section className="g" style={{ paddingTop: 0 }} aria-labelledby="ev-est"><div className="w">
      <Rv><p className="eb">Build your event</p><h2 id="ev-est">See It Come <em>Together.</em></h2>
        <p className="lead">Move the slider to see where everyone sleeps, which spaces fit, and where pricing starts. No forms, no commitment.</p></Rv>
      <Rv className="est">
        <div className="ctl">
          <div className="row"><label htmlFor="ev-g">Guests <output>{g}</output></label>
            <input id="ev-g" type="range" min={10} max={200} step={5} value={g} onChange={(e) => setG(Number(e.target.value))} style={{ ['--p' as string]: `${((g - 10) / 190) * 100}%` }} /></div>
          <div className="row"><div className="lab">Nights</div><div className="seg">{[1, 2, 3, 4, 5].map((x) => <button key={x} type="button" className={x === n ? 'on' : ''} onClick={() => setN(x)} aria-pressed={x === n}>{x}</button>)}</div></div>
          <div className="row"><div className="lab">Everyone stays overnight</div><div className="seg">
            <button type="button" className={over ? 'on' : ''} onClick={() => setOver(true)} aria-pressed={over}>Yes</button>
            <button type="button" className={!over ? 'on' : ''} onClick={() => setOver(false)} aria-pressed={!over}>Day event only</button></div></div>
        </div>
        <div className="out">
          <span className="k">All-inclusive, starting from</span>
          <div className="price">${(NIGHTLY_RATE * n).toLocaleString('en-US')}<small> for {n} {n > 1 ? 'nights' : 'night'}</small></div>
          <p className="incl">The whole property: 6 Forest Villas, the Guest House, both indoor spaces, the lake, the grounds and 20+ activities.</p>
          <div className="bars">{bars.map(([l, v, max]) => <div className="bar" key={l}><span>{l}</span><span className="t"><i style={{ width: `${(v / max) * 100}%` }} /></span><b>{v}</b></div>)}</div>
          <p className="verdict">{sleep} {fit}</p>
          <button type="button" className="btn" onClick={() => { onRequest({ guests: g, note: `${n} ${n > 1 ? 'nights' : 'night'}, ${over ? 'everyone stays overnight' : 'day event'}.` }); scrollToPlan(); }}>Request This Event <Arrow /></button>
        </div>
      </Rv>
    </div></section>
  );
}

function Activities() {
  return (
    <section className="g" aria-labelledby="ev-act"><div className="w">
      <Rv><p className="eb">Group activities</p><h2 id="ev-act">Your Activity Program <em>Is Already Here.</em></h2>
        <p className="lead">20+ complimentary activities come with your stay. Build your agenda around them, or leave the afternoon free and let your guests choose.</p></Rv>
      <div className="bento">{activities.map((a) => (
        <article key={a.title} className={`bt ${a.size}`}><div className="ph" style={{ backgroundImage: `url(${a.image})` }} /><span className="inc">Included</span><div className="tx"><h3>{a.title}</h3><p>{a.body}</p></div></article>
      ))}</div>
    </div></section>
  );
}

function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 75%', 'end 60%'] });
  return (
    <section className="g" style={{ paddingTop: 0 }} aria-labelledby="ev-how"><div className="w">
      <Rv><p className="eb">How it works</p><h2 id="ev-how">From First Message <em>to Arrival Day.</em></h2></Rv>
      <div ref={ref} className="steps">
        <motion.span className="line" style={{ scaleX: reduce ? 1 : scrollYProgress }} aria-hidden="true" />
        {steps.map((s, i) => <Rv key={s.title} className="sp" delay={i * 0.08}><span className="n">{i + 1}</span><b>{s.title}</b><p>{s.body}</p></Rv>)}
      </div>
      <Rv className="allin">
        <div className="p">${NIGHTLY_RATE.toLocaleString('en-US')}<small>Per night · whole property</small></div>
        <ul>{included.map((x) => <li key={x}>{x}</li>)}</ul>
        <button type="button" className="btn" onClick={scrollToPlan}>Start With Your Dates <Arrow /></button>
      </Rv>
    </div></section>
  );
}

function Faq() {
  return (
    <section className="g" style={{ paddingTop: 0 }} aria-labelledby="ev-faq"><div className="w faqg">
      <Rv><p className="eb">FAQ for organizers</p><h2 id="ev-faq">Planning Questions, <em>Answered.</em></h2>
        <p className="lead">Can't find yours? <a href="#plan" onClick={(e) => { e.preventDefault(); scrollToPlan(); }}>Ask the team</a>, they reply within an hour.</p></Rv>
      <FaqList />
    </div></section>
  );
}

function FaqList() {
  const [open, setOpen] = useState<number | null>(null);
  const reduce = useReducedMotion();
  return (
    <div className="faq">
      {faq.map((f, i) => {
        const on = open === i;
        return (
          <div key={f.q} className={`fq${on ? ' on' : ''}`}>
            <h3><button type="button" aria-expanded={on} aria-controls={`ev-fa-${i}`} id={`ev-fq-${i}`} onClick={() => setOpen(on ? null : i)}>{f.q}</button></h3>
            <AnimatePresence initial={false}>
              {on && (
                <motion.div id={`ev-fa-${i}`} role="region" aria-labelledby={`ev-fq-${i}`} className="fa"
                  initial={reduce ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
                  exit={reduce ? undefined : { height: 0, opacity: 0 }} transition={{ duration: 0.45, ease: EASE }}>
                  <p>{f.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

/* ---------------- request form ---------------- */
function PlanForm({ plan, setPlan }: { plan: Plan; setPlan: (p: Plan) => void }) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [flex, setFlex] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [consent, setConsent] = useState(false);
  const [err, setErr] = useState(false);
  const [sending, setSending] = useState(false);
  const [failed, setFailed] = useState(false);
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  const submit = async () => {
    if (!name.trim() || !emailOk || !phone.trim() || !consent) { setErr(true); setTimeout(() => setErr(false), 1200); return; }
    setSending(true); setFailed(false);
    const ok = await sendInquiry('event-request', {
      eventType: plan.type, preferredDates: plan.dates, flexibleDates: flex ? 'Yes' : 'No', guests: String(plan.guests),
      details: plan.note, name: name.trim(), email: email.trim(), phone: phone.trim(), consent: CONSENT_RECORD, page: '/events',
    });
    setSending(false);
    if (ok) {
      setStep(3);
      (window as unknown as { dataLayer?: unknown[] }).dataLayer?.push({ event: 'generate_lead', form_name: 'events_request', event_type: plan.type });
    } else setFailed(true);
  };
  return (
    <section id="plan" className="g fsec" style={{ backgroundImage: 'linear-gradient(90deg,rgba(14,18,15,.97) 0%,rgba(14,18,15,.86) 48%,rgba(14,18,15,.55)),url(/images/sandhills/final_image.webp)' }} aria-labelledby="ev-plan">
      <div className="w fg">
        <Rv><p className="eb">Your event</p><h2 id="ev-plan">Let's Plan <em>Your Event.</em></h2>
          <p className="lead" style={{ color: '#d9d0bd' }}>Share a few details and our team will get back to you with availability and a proposal.</p>
          <ul className="promise"><li><b>1 hr</b>A reply within the hour, by phone or message</li><li><b>1</b>One clear, all-inclusive quote</li><li><b>{DEPOSIT}</b>Deposit to lock in your dates, nothing before that</li></ul></Rv>
        <div className="fcard">
          {step < 3 && <div className="fsteps"><span className="on">1 · Your event</span><span className={step === 2 ? 'on' : ''}>2 · Your details</span></div>}
          {step === 1 && (
            <div>
              <h3>What are you planning?</h3>
              <div className="chips" role="radiogroup" aria-label="Type of event">
                {EVENT_TYPES.map((t) => <button key={t} type="button" role="radio" aria-checked={plan.type === t} className={`chip${plan.type === t ? ' on' : ''}`} onClick={() => setPlan({ ...plan, type: t })}>{t === 'Other' ? 'Something else' : t}</button>)}
              </div>
              <div className="fr">
                <div className="fld"><small>Preferred dates</small><input value={plan.dates} onChange={(e) => setPlan({ ...plan, dates: e.target.value })} placeholder="e.g. May 15 to 17" /></div>
                <div className="fld"><small>Guests</small><div className="stp"><span>{plan.guests}</span><span>
                  <button type="button" aria-label="Fewer guests" onClick={() => setPlan({ ...plan, guests: Math.max(1, plan.guests - 5) })}>−</button>{' '}
                  <button type="button" aria-label="More guests" onClick={() => setPlan({ ...plan, guests: Math.min(200, plan.guests + 5) })}>+</button></span></div></div>
              </div>
              <label className="tog"><input type="checkbox" checked={flex} onChange={(e) => setFlex(e.target.checked)} /> My dates are flexible</label>
              <div className="fld"><small>Tell us about your event (optional)</small><textarea value={plan.note} onChange={(e) => setPlan({ ...plan, note: e.target.value })} placeholder="Anything we should know" /></div>
              <button type="button" className="btn" onClick={() => setStep(2)}>Continue <Arrow /></button>
            </div>
          )}
          {step === 2 && (
            <div>
              <h3>Where should we send your proposal?</h3>
              <div className="fld"><small>Name</small><input className={err && !name.trim() ? 'bad' : ''} value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" placeholder="Your name" /></div>
              <div className="fr">
                <div className="fld"><small>Email</small><input className={err && !emailOk ? 'bad' : ''} type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" /></div>
                <div className="fld"><small>Phone</small><input className={err && !phone.trim() ? 'bad' : ''} type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" placeholder="For a quick call" /></div>
              </div>
              <ConsentCheckbox id="ev-consent" checked={consent} onChange={setConsent} err={err} />
              {failed && <p className="ferr">Sorry, that didn't go through. Please try again, or message us on WhatsApp.</p>}
              <button type="button" className="btn" onClick={submit} disabled={sending}>{sending ? 'Sending…' : 'Send My Request'}</button>
              <button type="button" className="back" onClick={() => setStep(1)}>← Back</button>
            </div>
          )}
          {step === 3 && (
            <div className="done" role="status"><div className="ok">✓</div><h3>Request received.</h3><p style={{ color: '#5A5650' }}>Our team will be in touch within the hour.</p></div>
          )}
          <div className="alt"><WhatsAppIcon /><span>Prefer to talk it over? <a href={CONTACT_WHATSAPP_HREF} target="_blank" rel="noopener noreferrer">WhatsApp</a> or call <a href={CONTACT_PHONE_HREF}>+1 {CONTACT_PHONE_DISPLAY}</a></span></div>
        </div>
      </div>
    </section>
  );
}

function MobileBar() {
  const [show, setShow] = useState(false);
  const { scrollY } = useScroll();
  useMotionValueEvent(scrollY, 'change', (y) => {
    const plan = document.getElementById('plan')?.getBoundingClientRect();
    const formOnScreen = !!plan && plan.top < window.innerHeight && plan.bottom > 0;
    setShow(y > window.innerHeight * 0.8 && !formOnScreen);
  });
  return (
    <div className={`mbar${show ? ' show' : ''}`}>
      <a className="btn ghost" href={CONTACT_WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" aria-label="Text us on WhatsApp"><WhatsAppIcon /></a>
      <button type="button" className="btn" onClick={scrollToPlan}>Plan Your Event</button>
    </div>
  );
}

export default function EventsLanding() {
  const [plan, setPlan] = useState<Plan>({ type: 'Corporate Retreat', dates: '', guests: 40, note: '' });
  const merge = (p: Partial<Plan>) => setPlan((cur) => ({ ...cur, ...Object.fromEntries(Object.entries(p).filter(([, v]) => v !== undefined && v !== '')) }));

  useEffect(() => {
    const prevTitle = document.title;
    document.title = eventsSeo.title;
    const descTag = document.querySelector('meta[name="description"]');
    const prevDesc = descTag?.getAttribute('content') ?? null;
    descTag?.setAttribute('content', eventsSeo.description);
    const canonical = document.createElement('link');
    canonical.rel = 'canonical';
    canonical.href = `${SITE_ORIGIN}/events`;
    document.head.appendChild(canonical);
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.text = JSON.stringify({
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: faq.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    });
    document.head.appendChild(ld);
    window.scrollTo(0, 0);
    return () => {
      document.title = prevTitle;
      if (prevDesc !== null) descTag?.setAttribute('content', prevDesc);
      canonical.remove();
      ld.remove();
    };
  }, []);

  return (
    <div className="ev">
      <div className="grain" aria-hidden="true" />
      <Header />
      <main>
        <Hero />
        <FactsAndQuickCheck onCheck={merge} />
        <Marquee />
        <Why />
        <Reviews />
        <Formats onPick={(t) => merge({ type: t })} />
        <Estate />
        <Estimator onRequest={merge} />
        <Activities />
        <HowItWorks />
        <GettingHere tone="dark" />
        <Faq />
        <PlanForm plan={plan} setPlan={setPlan} />
      </main>
      <Footer />
      <MobileBar />
      <BookingModal />
    </div>
  );
}
