/* Horizons Sandhills -- "Your Farm Basket is On Us" promo pop-up.
   PASTE INTO: Settings -> Booking Engine -> Customize -> JavaScript
   Paste exactly as-is. Do NOT add script tags: that field is validated as
   JavaScript, so any markup in it is a syntax error on line 1.

   Constraints, all deliberate -- see README:
     ASCII only, ES5 only, no markup characters anywhere in this file. */
(function () {
  'use strict';

  /* Copy: the only block to edit to change wording.
     The WhatsApp text uses \u2019 (curly apostrophe) and \u2014 (em dash)
     this file stays plain ASCII while still rendering correct typography. */
  var COPY = {
    eyebrow: 'Special stay offer',
    title: 'Your Farm Basket is On Us',
    body: 'Book a 2-night stay at Horizons Sandhills and enjoy a complimentary basket of fresh farm products during your stay.',
    cta: 'Book your stay',
    whatsapp: 'Message us on WhatsApp',
    closeLabel: 'Close offer'
  };

  /* The photo. It lives here, not only in the Custom Header block, because
     popup.js is the one field guaranteed to be applied: if the markup arrives
     without a figure (header block not re-pasted, or img stripped by the
     dashboard), this builds one. Absolute URL is required -- this runs on
     us2.cloudbeds.com, so a relative path would resolve against Cloudbeds. */
  var PHOTO_URL = 'https://sandhills.gohorizons.com/images/sandhills/farm-basket.webp';
  var PHOTO_ALT = 'A wicker basket on the lawn holding red wine, peaches, grapes, a jar of honey and farmhouse cheese.';
  var PHOTO_W = 460;
  var PHOTO_H = 230;

  var DELAY_MS = 1800;
  var STORAGE_KEY = 'hs_farmbox_popup_seen_v2';
  var RETRY_MS = 300;
  var GIVE_UP_MS = 6000;

  var WHATSAPP_URL = 'https://wa.me/17546679090?text=' + encodeURIComponent(
    'Hi! I saw the 2-night farm basket offer \u2014 I\u2019d like to book a stay.'
  );

  if (window.__hsFarmBox) { return; }
  window.__hsFarmBox = true;

  var root, card, cta, whatsapp, lastFocused, timer;

  /* sessionStorage throws in some privacy modes. Never let that break the
     booking flow: fall back to "not seen". */
  function hasSeen() {
    try { return window.sessionStorage.getItem(STORAGE_KEY) === '1'; }
    catch (e) { return false; }
  }
  function markSeen() {
    try { window.sessionStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
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
    setText('[data-hs-whatsapp-label]', COPY.whatsapp);
    if (whatsapp) { whatsapp.setAttribute('href', WHATSAPP_URL); }
    var btn = root.querySelector('[data-hs-close].hs-farmbox__close');
    if (btn && COPY.closeLabel) { btn.setAttribute('aria-label', COPY.closeLabel); }
  }

  /* Put the photo at the top of the card, building the figure if the markup
     did not ship one. A blocked or missing image must never leave a broken
     frame above the offer, so the figure is dropped if it fails to load. */
  function setUpPhoto() {
    if (!card || !PHOTO_URL) { return; }

    var fig = root.querySelector('[data-hs-figure]');
    var img = fig ? fig.querySelector('[data-hs-img]') : null;

    if (!fig) {
      fig = document.createElement('div');
      fig.className = 'hs-farmbox__figure';
      fig.setAttribute('data-hs-figure', '');
      card.insertBefore(fig, card.firstChild);
    }

    if (!img) {
      img = document.createElement('img');
      img.className = 'hs-farmbox__img';
      img.setAttribute('data-hs-img', '');
      fig.appendChild(img);
    }

    /* Matches the stylesheet exactly, so the two never fight. It is repeated
       inline only so the photo is still the right size if the Custom Meta Tags
       block is stale. */
    img.style.display = 'block';
    img.style.width = '100%';
    img.style.height = 'auto';

    img.setAttribute('alt', PHOTO_ALT);
    img.setAttribute('width', PHOTO_W);
    img.setAttribute('height', PHOTO_H);

    function drop() { fig.setAttribute('hidden', ''); }
    img.addEventListener('error', drop);

    /* Attach the handler before the request starts, or a fast failure is
       missed. Re-setting the same src is a no-op in every browser. */
    if (img.getAttribute('src') !== PHOTO_URL) { img.setAttribute('src', PHOTO_URL); }
    if (img.complete && img.naturalWidth === 0) { drop(); }
  }

  function focusables() {
    return [root.querySelector('.hs-farmbox__close'), cta, whatsapp].filter(Boolean);
  }

  function onKeydown(e) {
    if (e.key === 'Escape' || e.key === 'Esc') {
      e.preventDefault();
      closePopup();
      return;
    }
    if (e.key !== 'Tab') { return; }
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

  function openPopup() {
    if (hasSeen() || !root || !root.hasAttribute('hidden')) { return; }
    lastFocused = document.activeElement;
    root.removeAttribute('hidden');
    markSeen();
    document.addEventListener('keydown', onKeydown, true);
    if (card && typeof card.focus === 'function') { card.focus(); }
  }

  function closePopup() {
    if (!root || root.hasAttribute('hidden')) { return; }
    root.setAttribute('hidden', '');
    document.removeEventListener('keydown', onKeydown, true);
    if (lastFocused && typeof lastFocused.focus === 'function') {
      try { lastFocused.focus(); } catch (e) {}
    }
    lastFocused = null;
  }

  function wire() {
    var closers = root.querySelectorAll('[data-hs-close]');
    for (var i = closers.length; i--;) {
      closers[i].addEventListener('click', function (e) {
        e.preventDefault();
        closePopup();
      });
    }

    /* The guest is already inside the booking engine, so the primary action
       just hands them back to the calendar to pick 2 or more nights. No promo
       code: the basket is fulfilled manually. If a Cloudbeds coupon is ever
       configured for this offer, apply it here. */
    if (cta) {
      cta.addEventListener('click', function (e) {
        e.preventDefault();
        closePopup();
      });
    }

    /* The WhatsApp link opens its own tab. Never preventDefault here, that
       would swallow the navigation. */
    if (whatsapp) {
      whatsapp.addEventListener('click', function () { closePopup(); });
    }
  }

  function start() {
    root = document.getElementById('hs-farmbox');
    if (!root) { return false; }
    card = root.querySelector('.hs-farmbox__card');
    cta = root.querySelector('[data-hs-cta]');
    whatsapp = root.querySelector('[data-hs-whatsapp]');
    applyCopy();
    setUpPhoto();
    wire();
    if (!hasSeen()) { timer = window.setTimeout(openPopup, DELAY_MS); }
    return true;
  }

  function boot() {
    if (start()) { return; }
    /* The Custom Header block can land after this runs. Poll briefly, then
       give up quietly rather than looping forever. */
    var waited = 0;
    var poll = window.setInterval(function () {
      waited += RETRY_MS;
      if (start() || waited >= GIVE_UP_MS) { window.clearInterval(poll); }
    }, RETRY_MS);
  }

  window.addEventListener('pagehide', function () { window.clearTimeout(timer); });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
