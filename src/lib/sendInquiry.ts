/** Posts a form submission to the /api/send-inquiry serverless function. */
export async function sendInquiry(formType: string, fields: Record<string, string>): Promise<boolean> {
  try {
    const res = await fetch('/api/send-inquiry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ formType, ...fields }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
