/*
 * Landing page settings shared by every 305-EN-DOLOR quiz page.
 * Edit this one file to change where leads are sent.
 */
window.LP_CONFIG = {
  brand: '305-EN-DOLOR',
  siteUrl: 'https://305endolor.com',

  // Where completed quiz leads are POSTed, e.g. a GoHighLevel, Zapier,
  // Make or CRM webhook URL. Leave empty to only log leads to
  // the browser console while testing.
  webhookUrl: '',

  // 'json' (default, best for GoHighLevel) or 'form' (form encoded, for
  // webhooks that reject requests sent from a browser).
  webhookFormat: 'json',

  // Optional: send people to a thank you page after submitting instead of
  // showing the in page confirmation. "{lang}" is replaced with "en" or "es".
  redirectUrl: ''
};
