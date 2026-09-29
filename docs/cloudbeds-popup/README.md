# Cloudbeds booking-engine pop-up — "Your Farm Basket is On Us"

Shown on the **Cloudbeds booking engine page**, not on the React site. Three
code blocks pasted into the Cloudbeds dashboard — **nothing here is bundled
into the site build.**

Copy is from the client spec doc
[*Special Stay Offer*](https://docs.google.com/document/d/1O92R9ItGTWm0Da39jvRk8hf2QzoxDv8sBHz8N0oOX4Q/edit)
(Sept 2026). The look follows the site's old Labor Day modal
(`git show 772b949^:src/components/blocks/LaborDayPopup.tsx`): accent rule +
uppercase eyebrow, Fraunces italic headline, left-aligned, pill CTA. The Labor
Day modal's lead-capture form is **not** part of this one — the spec asks for
two actions instead.

This supersedes the earlier "Book 2 Nights Now and Get a Farm Box" wording. Same
offer, same three fields in the dashboard — repaste all three.

---

## Why this lives in the dashboard, not in the repo

The original spec's section 4 flags a blocker to check first: if the property
runs **Immersive Experience 2.0** (the full booking widget embedded in the
site), custom CSS/JS from the Customize tab does not reach the widget, and
everything has to go into the site's own code instead.

**Checked — it does not.** This site links *out* to the hosted engine at
`https://us2.cloudbeds.com/en/reservation/Dc79Gd/` (`src/components/data/booking.ts:7`);
every CTA opens `BookingModal`, which hands off with dates pre-filled. There is
no Cloudbeds script in `index.html` and no `data-cb-immersive-experience-root`
anywhere in `src/`. So the Customize-tab route is the correct one.

**If the site ever embeds the widget, this all has to move.** Re-run
`grep -rn "cb-immersive\|cloudbeds" src index.html` before trusting these files.

---

## Where each block goes

Dashboard path: **Account menu → Settings → Booking Engine → tab `Customize`**

| File | Field | Paste |
|---|---|---|
| `header.html` | **Custom Header** | As-is — the field takes HTML. Set it per-language if the engine is multilingual. |
| `styles.css` | **Custom Meta Tags** | As-is, **keeping** the `<style>` wrapper — the field takes head markup, not bare CSS. |
| `popup.js` | **JavaScript** | As-is. It has **no** `<script>` wrapper. See below if the field rejects it. |

`popup.min.js` and `popup.wrapped.js` are generated alternatives for the
JavaScript field only — same code, different packaging. Regenerate both after
editing `popup.js`:

```
node docs/cloudbeds-popup/build-min.cjs
```

### If the JavaScript field says "There are syntax errors in your Javascript code"

The code is verified valid before every handover, as an ES5 **classic script**
(which is what the booking engine runs, and a stricter check than `node --check`,
since this repo is `"type": "module"`):

```
node -e "require('acorn').parse(require('fs').readFileSync('docs/cloudbeds-popup/popup.js','utf8'),{ecmaVersion:5,sourceType:'script'})"
```

So if the dashboard still rejects it, the problem is how the field is being fed,
not the code. Work down this ladder — each step rules out one cause:

1. **Paste `console.log('hs test');` on its own and save.**
   - *Rejected too* → the field is not accepting bare JS. Try
     `popup.wrapped.js` instead, which is the same code inside `<script>` tags.
   - *Accepted* → bare JS is right, continue down the list.
2. **Paste `popup.min.js`.** It is the same logic at 4.0 KB instead of 5.8 KB.
   If the full file fails and the minified one saves, the field has a **length
   cap** and was silently truncating mid-statement.
3. **Check for a stray wrapper.** A leading `<` is a syntax error on line 1.
   This is what broke the first attempt.
4. **Re-copy from the raw file, not from a rendered view.** Copying from a
   Markdown preview or a chat window can substitute smart quotes for `'`, which
   is a syntax error. All three blocks are deliberately ASCII-only so that any
   non-ASCII character appearing in the field is a reliable sign of this.

The three blocks are ASCII-only and `popup.js` is ES5-only (no `const`/`let`,
arrow functions or template literals). `popup.js` also contains **no `<`
character anywhere** — not in code, not in comments — so nothing in it can be
mistaken for markup by a sanitiser. Keep all of that true when editing: the
curly apostrophe and em dash in the WhatsApp message are written as `\u2019`
and `\u2014` escapes for exactly this reason.

---

## The photo

The pop-up leads with `farm-basket.webp` — the gift basket on the lawn, cropped
2:1 and full-bleed across the top of the card.

Because this markup runs on `us2.cloudbeds.com`, the `src` **must be absolute**.
It points at `https://sandhills.gohorizons.com/images/sandhills/farm-basket.webp`
— that host is what actually serves the site; `horizonssandhills.com` does not
resolve, despite being hardcoded as `SITE_URL` in
`src/components/StructuredData.tsx` (worth fixing separately — every schema.org
and canonical URL the site emits points at a dead domain).

**Deploy the site before pasting the pop-up**, so the image is live at that URL
first. If it 404s or is blocked, `popup.js` hides the frame and the offer still
shows properly rather than displaying a broken image.

Details of the crop, and what to do when replacing it, are in
[`IMAGE_MAP.md`](../../IMAGE_MAP.md) under "Off-site: Cloudbeds booking-engine
pop-up".

---

Two things the spec warns about, both still true:

- Saving these fields may demand **MFA re-confirmation**. Have the second factor
  to hand or the save silently drops.
- On **Booking Engine Plus (SPA)** one paste covers the whole flow. On the
  **legacy** engine the blocks may need repeating per page — check every step
  after going live.

`preview.html` is a local test harness, not part of the paste.

---

## Behaviour

- Opens **1.8s** after load, so it never lands on top of the guest's first tap
  on the calendar.
- Closes on **✕**, **click outside**, and **Esc**.
- **Once per session** — `sessionStorage` key `hs_farmbox_popup_seen_v2`, set the
  moment it opens, so it stays gone across booking steps and after either CTA.
  The key is bumped from `hs_farmbox_popup_seen` so anyone mid-session on the
  previous pop-up still sees this one.
- **`Book your stay`** closes the pop-up and returns the guest to the calendar —
  they are already inside the booking engine, so there is nowhere else to send
  them. No promo code is applied; the basket is fulfilled manually for 2+ night
  stays. If a Cloudbeds coupon is ever configured for this offer, the CTA
  handler in `popup.js` is where it goes.
- **`Message us on WhatsApp`** opens `https://wa.me/17546679090` in a new tab
  (the number in `src/lib/contact.ts`) and closes the pop-up, leaving the
  booking tab clean to come back to. The link is prefilled with *"Hi! I saw the
  2-night farm basket offer — I'd like to book a stay."* so the team can tell a
  booking-engine lead from a site lead; **drop the `?text=` in `popup.js` if the
  client wants it to open empty.**
- **The photo** sits full-bleed across the top of the card. If it fails to load,
  `popup.js` removes the frame so the offer still reads cleanly — there is never
  a broken-image icon above the headline.
- Never traps the guest: three ways out, and the markup ships `hidden`, so a JS
  failure leaves the booking flow untouched rather than covering it.
- Accessibility: `role="dialog"` + `aria-modal`, focus moves into the card on
  open and returns to the previous element on close, Tab is trapped between ✕
  and the WhatsApp link, ✕ carries an `aria-label`, and `prefers-reduced-motion`
  kills the entrance animation.
- Survives a SPA re-render — `window.__hsFarmBox` guards against double-init,
  and the boot polls for up to 6s in case the Custom Header markup lands late.

---

## Editing the copy

Change the `COPY` block at the top of `popup.js` — it overwrites the text on
load, so that is the single place to edit. The same wording sits in
`header.html` as a no-JS fallback; update it too if you want the two to match.

Current wording is the spec doc verbatim, bar sentence-casing the two buttons
(the doc sets them in caps; CSS applies `text-transform: uppercase`, so caps in
the string would double up in any future non-uppercase context):

> eyebrow **Special stay offer** · headline **Your Farm Basket is On Us**
> · body **Book a 2-night stay at Horizons Sandhills and enjoy a complimentary
> basket of fresh farm products during your stay.**
> · **Book your stay** · **Message us on WhatsApp**

---

## Colour and contrast

Palette from the original spec's section 3. Measured against WCAG AA (4.5:1 for
text this size):

| Pair | Ratio | |
|---|---|---|
| Ink `#1F2420` on card `#F2EDE3` | 15.9:1 | pass |
| Body `#5A5650` on card `#F2EDE3` | 6.3:1 | pass |
| Primary CTA label `#FFF9F2` on `#B05329` | 4.6:1 | pass |
| Ghost CTA label `#1F2420` on card `#F2EDE3` | 15.9:1 | pass |

The primary CTA label is a warm near-white rather than linen `#E7DEC7`: linen on
`#B05329` measures **3.6:1** and fails at 11px. If you would rather keep linen,
darken the button to `#9A4722` (4.8:1) and pick a darker hover.

The WhatsApp glyph stays brand green `#25D366` rather than inheriting the label
colour, matching `src/components/icons/WhatsAppIcon.tsx`. It is decorative
(`aria-hidden`) and sits beside a text label, so it carries no contrast
requirement of its own.

`z-index: 2000` clears the Cloudbeds widget stack named in the spec — sticky
1100, modal 1400, popover 1500, tooltip 1800.
