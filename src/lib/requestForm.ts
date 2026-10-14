/** Event the segment landing pages' CTAs fire to open the shared request form. */
export const REQUEST_FORM_EVENT = 'open-request-form';

/** Fire from any CTA on a segment landing page to open the request form. */
export const openRequestForm = () => window.dispatchEvent(new CustomEvent(REQUEST_FORM_EVENT));
