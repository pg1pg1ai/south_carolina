// Vercel serverless function (Node runtime, auto-detected from /api).
// Receives a lead-form submission from the site and emails it via Resend.
// Env vars (Vercel project settings, server-side only — no VITE_ prefix,
// they must never reach the browser bundle):
//   RESEND_API_KEY   — from resend.com (required)
//   INQUIRY_TO_EMAIL — optional override of the recipient below

// Temporary: routed to the Resend account owner's inbox while access to
// hello@gohorizons.com is unavailable. Switch back once that mailbox is
// confirmed to receive (or just set INQUIRY_TO_EMAIL in Vercel, no deploy needed).
const DEFAULT_TO_EMAIL = 'aiartificial.horizons@gmail.com';

const FORM_LABELS: Record<string, string> = {
  'private-event': 'Private Event Inquiry',
  'booking-interest': 'Booking Interest',
  'corporate-quote': 'Corporate Quotation Request',
  'question': 'Website Question',
};

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c] as string));
}

export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const toEmail = process.env.INQUIRY_TO_EMAIL || DEFAULT_TO_EMAIL;
  if (!apiKey) {
    res.status(500).json({ error: 'Inquiry email is not configured' });
    return;
  }

  const body = req.body ?? {};
  const { formType, ...fields } = body as { formType?: string; [key: string]: unknown };

  const entries = Object.entries(fields).filter(([, v]) => v !== undefined && v !== '');
  if (entries.length === 0) {
    res.status(400).json({ error: 'Empty submission' });
    return;
  }

  const title = FORM_LABELS[formType ?? ''] ?? 'Website Inquiry';
  const rows = entries
    .map(([key, value]) => `<tr><td style="padding:4px 12px 4px 0;color:#5A5650;text-transform:capitalize">${escapeHtml(key)}</td><td style="padding:4px 0;color:#1F2420">${escapeHtml(String(value))}</td></tr>`)
    .join('');

  try {
    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Horizons Sandhills Website <inquiries@gohorizons.com>',
        to: [toEmail],
        subject: `${title} — Horizons Sandhills`,
        html: `<h2>${escapeHtml(title)}</h2><table>${rows}</table>`,
      }),
    });

    if (!resendRes.ok) {
      const detail = await resendRes.text();
      res.status(502).json({ error: 'Failed to send email', detail });
      return;
    }

    res.status(200).json({ ok: true });
  } catch (e) {
    res.status(500).json({ error: 'Unexpected error', detail: String(e) });
  }
}
