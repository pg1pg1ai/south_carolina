/** WhatsApp brand green — kept literal so the glyph stays on-brand wherever it
 *  sits, rather than inheriting the surrounding text colour. */
const WHATSAPP_GREEN = '#25D366';

/** WhatsApp glyph — shared by the header contact button and the booking modal. */
export default function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill={WHATSAPP_GREEN} aria-hidden="true">
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.39 1.26 4.81L2 22l5.25-1.38c1.36.74 2.92 1.16 4.79 1.16 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.79 14.06c-.24.68-1.19 1.24-1.95 1.4-.53.11-1.22.2-3.55-.76-2.98-1.23-4.9-4.24-5.05-4.44-.15-.2-1.21-1.61-1.21-3.07 0-1.46.76-2.17 1.03-2.47.27-.3.59-.37.79-.37h.57c.18 0 .43-.07.67.51.24.58.83 2.01.9 2.15.07.15.11.32.02.51-.09.18-.14.3-.28.46-.14.16-.29.36-.42.48-.14.13-.29.28-.13.56.16.28.72 1.19 1.55 1.93 1.06.95 1.96 1.24 2.24 1.38.28.14.44.12.6-.07.16-.19.68-.79.87-1.06.19-.27.37-.22.62-.13.25.09 1.6.75 1.87.89.27.13.45.2.51.32.07.11.07.66-.17 1.34z" />
    </svg>
  );
}
