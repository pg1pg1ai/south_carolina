<script>
/* ───────────────────────────────────────────────────────────────────────────
   Horizons Sandhills — "2 nights = farm box" promo pop-up
   PASTE INTO: Settings → Booking Engine → Customize → JavaScript
   Keep the <script> wrapper — that field takes raw markup, not bare JS.
─────────────────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* ── Copy — the only block you need to edit to change wording ─────────── */
  var COPY = {
    eyebrow: 'Direct booking offer',
    title: 'Book 2 Nights Now and Get a Farm Box',
    body: 'Stay two nights or more and we’ll leave a farm box waiting in the villa — orchard fruit, honey from our hives, eggs from the farm. Direct bookings only.',
    cta: 'Choose my dates',
    closeLabel: 'Close offer'
  };

  /* ── Settings ─────────────────────────────────────────────────────────── */
  var DELAY_MS   = 1800;                    // let the calendar paint first
  var STORAGE_KEY = 'hs_farmbox_popup_seen'; // once per session
  var FIND_RETRY_MS = 300;                  // Custom Header may inject late
  var FIND_GIVE_UP_MS = 6000;

  /* Booking Engine Plus is a SPA — a re-render must not wire this up twice. */
  if (window.__hsFarmBox) { return; }
  window.__hsFarmBox = true;

  var root, card, cta, lastFocused, timer;

  /* sessionStorage throws in some privacy modes — never let that break the
     booking flow, just fall back to "not seen". */
  function hasSeen() {
    try { return window.sessionStorage.getItem(STORAGE_KEY) === '1'; }
    catch (e) { return false; }
  }
  function markSeen() {
    try { window.sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) { /* ignore */ }
  }

  function setText(selector, value) {
    var el = root.querySelector(selector);
    if (el && value) { el.textContent = value; }
  }

  function applyCopy() {
    setText('[data-hs-eyebrow]', COPY.eyebrow);
    setText('[data-hs-title]', COPY.title);
    setText('[data-hs-body]', COPY.body);
    setText('[data-hs-cta]', COPY.cta);
    var close = root.querySelector('[data-hs-close].hs-farmbox__close');
    if (close && COPY.closeLabel) { close.setAttribute('aria-label', COPY.closeLabel); }
  }

  function focusables() {
    return [root.querySelector('.hs-farmbox__close'), cta].filter(Boolean);
  }

  function onKeydown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key !== 'Tab') { return; }

    /* Trap focus between the ✕ and the CTA while the dialog is open. */
    var items = focusables();
    if (!items.length) { return; }
    var first = items[0];
    var last = items[items.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  }

  function open() {
    if (hasSeen() || !root || !root.hasAttribute('hidden')) { return; }

    lastFocused = document.activeElement;
    root.removeAttribute('hidden');
    markSeen(); /* shown once per session, whichever way it is dismissed */

    document.addEventListener('keydown', onKeydown, true);
    if (card && typeof card.focus === 'function') { card.focus(); }
  }

  function close() {
    if (!root || root.hasAttribute('hidden')) { return; }

    root.setAttribute('hidden', '');
    document.removeEventListener('keydown', onKeydown, true);

    if (lastFocused && typeof lastFocused.focus === 'function') {
      try { lastFocused.focus(); } catch (e) { /* element may be gone */ }
    }
    lastFocused = null;
  }

  function wire() {
    /* ✕ and the overlay both carry data-hs-close. */
    var closers = root.querySelectorAll('[data-hs-close]');
    for (var i = 0; i < closers.length; i++) {
      closers[i].addEventListener('click', function (e) {
        e.preventDefault();
        close();
      });
    }

    if (cta) {
      cta.addEventListener('click', function (e) {
        /* The offer needs no promo code — the guest just goes back to the
           calendar and picks 2+ nights. markSeen() already ran on open, so
           it cannot reappear later in the session. */
        e.preventDefault();
        close();
      });
    }
  }

  function start() {
    root = document.getElementById('hs-farmbox');
    if (!root) { return false; }

    card = root.querySelector('.hs-farmbox__card');
    cta = root.querySelector('[data-hs-cta]');

    applyCopy();
    wire();

    if (!hasSeen()) {
      timer = window.setTimeout(open, DELAY_MS);
    }
    return true;
  }

  function boot() {
    if (start()) { return; }

    /* The Custom Header block can land after this script runs — poll briefly,
       then give up quietly rather than looping forever. */
    var waited = 0;
    var poll = window.setInterval(function () {
      waited += FIND_RETRY_MS;
      if (start() || waited >= FIND_GIVE_UP_MS) { window.clearInterval(poll); }
    }, FIND_RETRY_MS);
  }

  /* Never hold the pop-up open across a page/step change. */
  window.addEventListener('pagehide', function () {
    window.clearTimeout(timer);
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
</script>
