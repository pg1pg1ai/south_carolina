# Cloudbeds booking-engine pop-up — "2 nights = farm box"

Implements `Cloudbeds_Booking_Engine_Popup_Technical_Spec_EN.docx` (client spec,
Sept 2026). Three code blocks pasted into the Cloudbeds dashboard — **nothing
here is bundled into the React site.**

---

## Why this lives in the dashboard, not in the repo

The spec's section 4 flags a blocker to check first: if the property runs
**Immersive Experience 2.0** (the full booking widget embedded in the site),
custom CSS/JS from the Customize tab does not reach the widget, and everything
has to go into the site's own code instead.

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

| File | Field | Notes |
|---|---|---|
| `header.html` | **Custom Header** | Paste as-is. Set it per-language if the engine is multilingual. |
| `styles.css` | **Custom Meta Tags** | Keep the `<style>` wrapper — the field takes head markup, not bare CSS. |
| `popup.js` | **JavaScript** | Keep the `<script>` wrapper. |

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
- **Once per session** — `sessionStorage` key `hs_farmbox_popup_seen`, set the
  moment it opens, so it stays gone across booking steps and after the CTA.
- **CTA `Choose my dates`** closes the pop-up and returns the guest to the
  calendar. No promo code is applied — the farm box is fulfilled manually for
  2+ night stays. If a Cloudbeds coupon is ever configured for this offer, the
  CTA handler in `popup.js` is where it goes.
- Never traps the guest: three ways out, and the markup ships `hidden`, so a JS
  failure leaves the booking flow untouched rather than covering it.
- Accessibility: `role="dialog"` + `aria-modal`, focus moves into the card on
  open and returns to the previous element on close, Tab is trapped between ✕
  and the CTA, ✕ carries an `aria-label`, and `prefers-reduced-motion` kills the
  entrance animation.
- Survives a SPA re-render — `window.__hsFarmBox` guards against double-init,
  and the boot polls for up to 6s in case the Custom Header markup lands late.

---

## Editing the copy

Change the `COPY` block at the top of `popup.js` — it overwrites the text on
load, so that is the single place to edit. The same wording sits in
`header.html` as a no-JS fallback; update it too if you want the two to match.

Only the headline is fixed by the spec:

> **Book 2 Nights Now and Get a Farm Box**

The eyebrow, body and CTA wording are drafts — **get the client to sign off.**

---

## Colour and contrast

Palette from spec section 3. Measured against WCAG AA (4.5:1 for text this size):

| Pair | Ratio | |
|---|---|---|
| Ink `#1F2420` on card `#F2EDE3` | 15.9:1 | pass |
| Body `#5A5650` on card `#F2EDE3` | 6.3:1 | pass |
| CTA label `#FFF9F2` on `#B05329` | 4.6:1 | pass |

The CTA label is a warm near-white rather than linen `#E7DEC7`: linen on
`#B05329` measures **3.6:1** and fails at 11px. If you would rather keep linen,
darken the button to `#9A4722` (4.8:1) and pick a darker hover.

`z-index: 2000` clears the Cloudbeds widget stack named in the spec — sticky
1100, modal 1400, popover 1500, tooltip 1800.

---

## Testing

Locally, before pasting anything:

```bash
npx serve docs/cloudbeds-popup     # then open /preview.html
```

The harness mocks a calendar behind the pop-up and gives you a button to clear
the session flag between runs.

After pasting into Cloudbeds, walk this list on the live engine:

- [ ] Appears ~1.8s after the booking page loads, over the calendar
- [ ] ✕ closes it
- [ ] Clicking the dark area outside closes it
- [ ] Esc closes it
- [ ] CTA closes it and the calendar is usable underneath
- [ ] Move to the next booking step — it must **not** come back
- [ ] New tab / new session — it appears again
- [ ] **Mobile (real device, not just devtools)** — Cloudbeds explicitly warns
      custom code "may not work on mobile version". Check the card fits, the CTA
      is tappable, and the page behind still scrolls after closing.
- [ ] Tab from the ✕ — focus stays inside the card; after closing, focus returns
- [ ] Complete one real test booking end to end

**Rollback:** empty the three Customize fields and save. Nothing else to undo.

**Re-testing:** the session flag suppresses it. Clear it with
`sessionStorage.removeItem('hs_farmbox_popup_seen')` in the console, or open a
new private window.

---

## Reference

- [Customize the Cloudbeds Booking Engine](https://myfrontdesk.cloudbeds.com/hc/en-us/articles/9898522074523-Customize-the-Cloudbeds-Booking-Engine)
- [Add HTML and CSS code to customize your Booking Engine](https://myfrontdesk.cloudbeds.com/hc/en-us/articles/219144708-Add-HTML-and-CSS-code-to-customize-your-Cloudbeds-Booking-Engine)
- [Booking Engine Plus — most common customization codes](https://myfrontdesk.cloudbeds.com/hc/en-us/articles/40640220902555-Booking-Engine-Plus-Most-Common-Customization-Codes)
- [Booking Engine settings overview](https://myfrontdesk.cloudbeds.com/hc/en-us/articles/50076487181211-Booking-Engine-Settings-page-overview)
- [Immersive Experience 2.0](https://myfrontdesk.cloudbeds.com/hc/en-us/articles/32048321731739-Cloudbeds-Booking-Engine-Immersive-Experience-2-0-Everything-you-need-to-know)
- [Embeds tab](https://myfrontdesk.cloudbeds.com/hc/en-us/articles/48154999431451-Cloudbeds-Booking-Engine-Embeds-Tab)
