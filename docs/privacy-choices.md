# Your Privacy Choices + Global Privacy Control

The privacy policy (Section 4) promises that the **"Your Privacy Choices"** footer link stops the
**Google Ads** and **Meta** advertising tags from collecting data from that browser, and that a
**Global Privacy Control (GPC)** signal is treated the same way. This is how the site implements it.

## What the website code does

| Where | What |
|---|---|
| `index.html` (inline script, **before** GTM) | Decides the opt-out on every page load: opted out if the browser sends GPC (`navigator.globalPrivacyControl === true`) **or** the visitor saved an opt-out (`localStorage` key `hz_ad_opt_out = "1"`). Sets Google Consent Mode defaults (`ad_storage`, `ad_user_data`, `ad_personalization` = `denied` when opted out; `analytics_storage` stays `granted`) and `ads_data_redaction`. Pushes `{ event: 'privacy_choices', ad_opt_out: true/false, gpc: true/false }` to the dataLayer. |
| `src/lib/privacyChoices.ts` | Reads and changes the choice after the page has loaded: Consent Mode `update`, the same dataLayer event, and `fbq('consent', 'revoke' / 'grant')` if the Meta Pixel is on the page. |
| `src/components/blocks/PrivacyChoicesModal.tsx` | The dialog opened by the footer link (and the link in the privacy policy text). Shows when GPC is active and locks the opt-out on. |
| `Footer.tsx` | "Privacy Policy" and "Your Privacy Choices" links on every page (full and compact footer). |

## What has to be set up in Google Tag Manager (container GTM-K656QSRX)

The site can only signal the choice; the tags themselves live in GTM. Someone with access to the
container should:

1. **Google Ads tags** (conversion, remarketing): Google tags have built-in consent checks and respect
   `ad_storage` / `ad_user_data` / `ad_personalization` automatically. Confirm under
   *Admin → Container settings → Enable consent overview*, and that no Google Ads tag is set to
   "No additional consent required" in a way that overrides it.
2. **Meta Pixel tag(s)** do **not** read Google Consent Mode. Block them for opted-out visitors:
   - Create a **Data Layer Variable** named `ad_opt_out` (Data Layer Variable Name: `ad_opt_out`).
   - Create a **trigger** "Ad opt-out": type *Custom Event*, event name `privacy_choices`, fires on
     *Some Custom Events* where `ad_opt_out` equals `true`.
   - Add that trigger as an **Exception** on every Meta Pixel tag, and add the condition
     `ad_opt_out does not equal true` to the Meta tags' firing triggers.
   (The website also calls `fbq('consent', 'revoke')` as a backstop, but the GTM exception is the
   reliable control.)
3. **Google Analytics** is not affected (the policy's opt-out covers advertising only). If GA4 has
   Google Signals or ads personalization enabled, those also follow `ad_personalization`.
4. **Preview and test** in GTM Preview mode: open the site, click "Your Privacy Choices", opt out,
   reload — the Meta tag should show as *Not fired* and Google Ads tags as *consent denied*. Repeat
   with a GPC browser (Brave, DuckDuckGo, or Firefox with GPC enabled).

## Keep in sync

- The storage key `hz_ad_opt_out` appears in both `index.html` and `src/lib/privacyChoices.ts`.
- If the policy's list of advertising tools changes, update the dialog text in `PrivacyChoicesModal.tsx`.
