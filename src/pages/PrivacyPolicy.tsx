import { useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import StickyHeader from '../components/blocks/StickyHeader';
import Footer from '../components/blocks/Footer';
import BookingModal from '../components/blocks/BookingModal';
import { openPrivacyChoices } from '../lib/privacyChoices';

export const PRIVACY_POLICY_PATH = '/privacy-policy';
export const PRIVACY_POLICY_UPDATED = 'November 9, 2026';

const CONTACT_EMAIL = 'hi@gohorizons.com';
const CONTACT_PHONE = '+1 (754) 667-9090';
const CONTACT_PHONE_HREF = 'tel:+17546679090';

function H2({ children }: { children: ReactNode }) {
  return (
    <h2
      className="mt-14 mb-5 font-display font-light text-ink text-[clamp(22px,2.6vw,28px)]"
      style={{ letterSpacing: '-0.015em', fontVariationSettings: '"SOFT" 40, "opsz" 48' }}
    >
      {children}
    </h2>
  );
}

function H3({ children }: { children: ReactNode }) {
  return <h3 className="mt-7 mb-3 font-eyebrow text-ink text-xs uppercase tracking-widest">{children}</h3>;
}

function P({ children }: { children: ReactNode }) {
  return <p className="mb-4 text-ink2 text-[15px] md:text-base leading-relaxed">{children}</p>;
}

function UL({ children }: { children: ReactNode }) {
  return <ul className="mb-5 pl-5 list-disc marker:text-ink2/40 space-y-2 text-ink2 text-[15px] md:text-base leading-relaxed">{children}</ul>;
}

function B({ children }: { children: ReactNode }) {
  return <strong className="font-medium text-ink">{children}</strong>;
}

function Mail() {
  return <a href={`mailto:${CONTACT_EMAIL}`} className="text-ink underline underline-offset-2 hover:opacity-70">{CONTACT_EMAIL}</a>;
}

function Phone() {
  return <a href={CONTACT_PHONE_HREF} className="text-ink underline underline-offset-2 hover:opacity-70 whitespace-nowrap">{CONTACT_PHONE}</a>;
}

const RETENTION: [string, string][] = [
  ['Reservation, payment and tax records', '7 years after your stay'],
  ['Signed waivers and incident reports', '4 years after your stay'],
  ['Inquiries that did not become bookings', '24 months after our last contact'],
  ['Marketing email and text lists', 'Until you unsubscribe, then a suppression record so we do not contact you again'],
  ['Website analytics data and session recordings', 'Up to 14 months'],
];

export default function PrivacyPolicy() {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = 'Privacy Policy — Horizons Sandhills';
    const meta = document.querySelector('meta[name="description"]');
    const prevDescription = meta?.getAttribute('content') ?? null;
    meta?.setAttribute(
      'content',
      'How Hideaway Inn SC LLC, which operates Horizons Sandhills, collects, uses and shares personal information, and the choices you have.'
    );
    window.scrollTo(0, 0);
    return () => {
      document.title = prevTitle;
      if (prevDescription !== null) meta?.setAttribute('content', prevDescription);
    };
  }, []);

  return (
    <div className="min-h-screen bg-bone">
      <StickyHeader variant="page" />

      <main className="max-w-content mx-auto px-4 md:px-8 pt-40 pb-20 md:pb-28">
        <div className="max-w-text">
          <Link
            to="/"
            className="font-eyebrow text-ink2/60 hover:text-ink2 text-xs uppercase tracking-widest transition-colors"
          >
            ← Horizons Sandhills
          </Link>

          <h1
            className="mt-6 font-display font-light text-ink text-[clamp(32px,5vw,56px)]"
            style={{ letterSpacing: '-0.025em', fontVariationSettings: '"SOFT" 40, "opsz" 72' }}
          >
            Privacy Policy
          </h1>
          <p className="mt-3 mb-10 font-eyebrow text-ink2/60 text-xs uppercase tracking-widest">
            Last updated: {PRIVACY_POLICY_UPDATED}
          </p>

          <P>
            This Privacy Policy explains how <B>Hideaway Inn SC LLC</B>, which operates <B>Horizons Sandhills</B> (“Horizons,” “we,” “us”), collects, uses and shares personal information, and the choices you have.
          </P>
          <P>
            It applies to information we collect through our website at https://sandhills.gohorizons.com, our online booking system, and the inquiries you send us by web form, email, phone, text or WhatsApp.
          </P>
          <P>
            <B>Booking through another platform.</B> If you book through Airbnb, Vrbo, Booking.com or a similar platform, that platform collects your information under its own privacy policy and sends us the reservation details we need to host you. Once we receive them, this policy applies to our use of that information.
          </P>

          <H2>1. Information We Collect</H2>
          <H3>Information you give us</H3>
          <UL>
            <li><B>Inquiries and event requests:</B> name, email address, phone number, company name, group size, preferred dates and the content of your message.</li>
            <li><B>Reservations:</B> name, email address, phone number, billing details requested by our booking system, stay dates, number of guests (including children), and any special requests, such as pets or accessibility features you need.</li>
            <li><B>Waivers:</B> if you sign a waiver online, your name, signature, the date you signed and the other information the waiver form asks for.</li>
            <li><B>Messages:</B> your contact details and the content of emails, calls, texts and WhatsApp messages you send us.</li>
          </UL>
          <P>
            Please do not include medical details in special requests. Simply tell us what you need, for example “step-free access” or “ground-floor bedroom.”
          </P>
          <P>
            <B>Payment information.</B> Card payments are entered into and processed by our booking provider, Cloudbeds, and its payment processing partners, which store card details in tokenized, encrypted form. We do not store full card numbers on our own systems. Please never send card numbers by email, text or WhatsApp.
          </P>
          <P>
            <B>Information collected automatically.</B> When you visit our website, we and the partners listed in Section 4 collect information through cookies, pixels and similar tools. This includes your IP address, browser and device type, approximate location, pages viewed, links clicked, the site that referred you, how you interact with our pages, and whether you started or completed a booking.
          </P>

          <H2>2. How We Use Your Information</H2>
          <UL>
            <li>To answer inquiries and plan your stay or event</li>
            <li>To process and manage reservations, payments, cancellations and refunds</li>
            <li>To send messages about your reservation, such as confirmations and arrival information</li>
            <li>To keep our guests, property and website safe, and to prevent fraud</li>
            <li>To send news and offers, if you have opted in</li>
            <li>To understand how our website is used and improve it</li>
            <li>To measure our advertising and show our ads to you on other websites and social media (see Section 4)</li>
            <li>To comply with the law, enforce our terms and resolve disputes</li>
          </UL>

          <H2>3. How We Share Your Information</H2>
          <P>We share personal information only as follows:</P>
          <UL>
            <li><B>Service providers</B> that run parts of our business for us, including Cloudbeds (booking and reservation management), payment processors, Hotjar (website analytics), email and messaging tools, and website hosting. They may use your information only to provide services to us.</li>
            <li><B>Messaging platforms.</B> If you contact us on WhatsApp, your messages are also handled by WhatsApp (Meta) under its own terms and privacy policy.</li>
            <li><B>Advertising and analytics partners.</B> Google and Meta collect information from our website through cookies and pixels, as described in Section 4. They may use it for their own purposes, including advertising across other sites and apps. Some state laws treat this as a “sale” or “sharing” of personal information, or as “targeted advertising,” even though we receive no money for it. You can opt out as described in Section 4.</li>
            <li><B>Booking platforms.</B> If you booked through a third-party platform, we may share information with that platform as needed to manage your reservation, such as changes, cancellations or reviews.</li>
            <li><B>Legal and safety reasons.</B> When required by law or legal process, or to protect the safety, rights or property of our guests, staff or business.</li>
            <li><B>Business transfers.</B> If our business or property is sold, merged or reorganized, subject to this policy.</li>
          </UL>
          <P>We do not share special-request details or guest health information with advertising partners.</P>

          <H2>4. Cookies, Pixels and Advertising</H2>
          <P>Our website and booking pages use these third-party tools, which we manage through Google Tag Manager:</P>
          <UL>
            <li><B>Google Analytics</B> to understand how visitors use our website</li>
            <li><B>Google Ads</B> to measure our Google ads and to show our ads to people who have visited our website</li>
            <li><B>Meta Pixel</B> (Facebook and Instagram) to measure our ads and to show our ads to people who have visited our website</li>
            <li><B>Hotjar</B> to see how visitors use our pages. Hotjar records interactions such as clicks, scrolling and mouse movements, and may create recordings of browsing sessions on our website.</li>
          </UL>
          <P>Google and Meta may collect information about your online activity over time and across different websites.</P>
          <H3>Your choices</H3>
          <UL>
            <li><B>Opt out of targeted advertising:</B> use the “<button type="button" onClick={openPrivacyChoices} className="text-ink underline underline-offset-2 hover:opacity-70" style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', font: 'inherit' }}>Your Privacy Choices</button>” link at the bottom of our website. This stops the Google Ads and Meta advertising tags on our website from collecting data from your browser. Because it works through your browser, you will need to repeat it on each device and browser you use, and after clearing cookies.</li>
            <li><B>Global Privacy Control:</B> if your browser sends a Global Privacy Control signal, we treat it as a request to opt out of targeted advertising for that browser.</li>
            <li><B>Do Not Track:</B> Hotjar does not collect data from browsers that send a “Do Not Track” signal. Our other tools do not respond to that signal, because it has no common standard. We do honor Global Privacy Control as described above.</li>
            <li><B>Other tools:</B> you can block or delete cookies in your browser, change your ad preferences with Google and Meta, and install the Google Analytics opt-out add-on.</li>
          </UL>

          <H2>5. How Long We Keep Your Information</H2>
          <P>We keep personal information only as long as we need it for the purposes above. Our general periods are:</P>
          <div className="mb-5 overflow-x-auto">
            <table className="w-full text-left text-[14px] md:text-[15px] border-collapse">
              <thead>
                <tr className="border-b border-divider">
                  <th className="py-3 pr-6 font-eyebrow text-ink text-xs uppercase tracking-widest font-normal">Information</th>
                  <th className="py-3 font-eyebrow text-ink text-xs uppercase tracking-widest font-normal">How long we keep it</th>
                </tr>
              </thead>
              <tbody>
                {RETENTION.map(([what, howLong]) => (
                  <tr key={what} className="border-b border-divider align-top">
                    <td className="py-3 pr-6 text-ink">{what}</td>
                    <td className="py-3 text-ink2">{howLong}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <P>We may keep information longer if needed for a legal claim, investigation or legal requirement. After that, we delete it or de-identify it.</P>

          <H2>6. How We Protect Your Information</H2>
          <P>We use reasonable administrative, technical and physical safeguards to protect personal information. No website or storage system is completely secure, so we cannot guarantee absolute security. If a security breach affects your personal information, we will notify you as required by law.</P>

          <H2>7. Your Choices and Rights</H2>
          <UL>
            <li><B>Marketing emails:</B> click “unsubscribe” in any marketing email or contact us. We will still send messages about your reservation.</li>
            <li><B>Marketing texts:</B> reply STOP to any marketing text, or contact us.</li>
            <li><B>Access, correction and deletion:</B> you may ask to see, correct or delete the personal information we hold about you. We will respond within 45 days. We may need to verify your identity, and we may keep information the law requires us to keep or that we need for an open reservation or legal claim.</li>
            <li><B>Targeted advertising:</B> see Section 4.</li>
            <li><B>State privacy rights:</B> residents of some states may have additional rights under their state’s law, including the right to use an authorized agent and to appeal our decision on a request. Where those laws apply to us, we will honor them. To appeal, reply to our decision with the subject line “Appeal.”</li>
            <li><B>No discrimination:</B> we will not charge you different prices or deny you service for exercising your privacy rights.</li>
          </UL>
          <P>To make a request, email <Mail /> with the subject line “Privacy Request,” or call <Phone />.</P>

          <H2>8. Children’s Privacy</H2>
          <P>Our website is not directed to children under 13, and we do not knowingly collect personal information online from children under 13. Reservations must be made by an adult, who may tell us about children in the party so we can prepare for the stay. If we learn we have collected personal information directly from a child under 13, we will delete it.</P>

          <H2>9. Links to Other Websites</H2>
          <P>Our website links to other sites, such as our social media pages and booking platforms. Their privacy practices are governed by their own policies. This does not apply to our Cloudbeds booking pages: information you enter there is collected for us and is covered by this policy.</P>

          <H2>10. Changes to This Policy</H2>
          <P>We may update this Privacy Policy from time to time. We will post the new version on this page with a new “Last updated” date. If we make a material change that affects how we use information we already hold, we will also notify guests by email where we have their address.</P>

          <H2>11. Contact Us</H2>
          <P>
            <B>Hideaway Inn SC LLC (Horizons Sandhills)</B><br />
            Email: <Mail /><br />
            Phone: <Phone />
          </P>
        </div>
      </main>

      <Footer compact />
      <BookingModal />
    </div>
  );
}
