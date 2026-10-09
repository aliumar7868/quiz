/*
 * Landing page settings shared by every 305-EN-DOLOR quiz page.
 * Edit this one file to change the phone number or where leads are sent.
 */
window.LP_CONFIG = {
  brand: '305-EN-DOLOR',
  phoneDisplay: '(305) 363-6567',
  phoneTel: '+13053636567',
  siteUrl: 'https://305endolor.com',

  // Where completed quiz leads are POSTed (form encoded), e.g. a Zapier,
  // Make, GoHighLevel or CRM webhook URL. Leave empty to only log leads to
  // the browser console while testing.
  webhookUrl: '',

  // Optional: send people to a thank you page after submitting instead of
  // showing the in page confirmation. "{lang}" is replaced with "en" or "es".
  redirectUrl: ''
};
