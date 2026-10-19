# 305-EN-DOLOR quiz landing pages

Three intake quiz landing pages, published as two sites: a Spanish only
305 En Dolor site and an English only LegalNow247 site. Plain HTML, CSS and
JavaScript; `build.py` (Python 3, no dependencies) generates the upload ready
folders for any static host (cPanel, Netlify, Cloudflare Pages, S3, etc.).

| Page | Path | Style |
| --- | --- | --- |
| Free Case Check | `/payout-check/` | Navy hero: headline and quiz card side by side |
| Case Scan | `/case-scan/` | App style flow with stage tracker, name first and personalized questions, animated scan before the contact step |
| Find Out If You Have a Case | `/free-check/` | Simple headline next to the quiz, with a live "Your Case File" summary on desktop |

Each page is a single screen: the logo, the quiz, and the required attorney
advertising notice. There is no phone number or call button, so visitors complete the form.

`/index.html` is a simple page with a button for each landing page (marked `noindex`).

## Two live sites

`python3 build.py` builds the sites you upload, one folder and zip per site in `dist/`:

| Site | Folder | Language | Leads go to |
| --- | --- | --- | --- |
| 305 En Dolor | `dist/305-en-dolor-es/` | Spanish only | 305 En Dolor GHL webhook |
| LegalNow247 | `dist/legalnow247-en/` | English only | LegalNow247 GHL webhook (set it in `build.py`) |

Each site has its own logo, brand name, legal footer and links, and both carry the Meta Pixel.
Upload the contents of a site's folder to its subdomain. Change site settings (webhook, pixel,
links, logo) in the `SITES` list in `build.py`, then run the build again.

## Language

On the live sites the language is locked (`lang` in the site settings) and there is no language
button. The source pages in this folder still switch automatically for development:

1. `?lang=es` or `?lang=en` in the URL (useful for Spanish or English ad campaigns)
2. The language the visitor chose with the English / Español button (remembered on their device)
3. The phone or browser language: Spanish shows Spanish, anything else shows English

All copy lives in `assets/js/i18n.js` (shared text: quiz, results, reviews, legal footer)
and in the `LPI18n.extend({ en: {...}, es: {...} })` block at the top of each page.

## Quiz questions

Every page asks the same intake questions:

* What type of accident? Motor Vehicle (car, motorcycle, truck, etc.) / Uber or Lyft / Slip & Fall
* When was your accident? Last 7 days / 7 to 14 days / 14+ days
* Do you have an accident report from the police? Yes / No
* Did you get injured during your accident? Yes / No
* Are you already working with an attorney? Yes / No
* Name, email and phone number

The qualifying questions come first and contact details last (this converts better).
The order of the steps is set in the `LPQuiz.mount({ steps: [...] })` call at the bottom of each page.

## Sending leads

Set `webhookUrl` for each site in `build.py` to a GoHighLevel Inbound Webhook (or a Zapier, Make or CRM webhook).
Leads are POSTed as JSON. If a webhook refuses requests sent from a browser, set `webhookFormat: 'form'`
to send them form encoded instead. Fields sent:

```
full_name, first_name, last_name, email, phone (+1XXXXXXXXXX), phone_display,
accident_type (motor_vehicle | rideshare | slip_fall), accident_type_label,
accident_date (last_7_days | 7_14_days | 14_plus_days), accident_date_label,
police_report, injured, has_attorney (yes | no),
qualified (yes when injured = yes and has_attorney = no),
language (en | es), landing_page, page_url, referrer, user_agent, submitted_at,
tcpa_consent, tcpa_consent_text,
language_label, police_report_label, injured_label, has_attorney_label (readable Yes / No),
tags (suggested, comma separated), lead_summary (all answers as plain text lines),
utm_source, utm_medium, utm_campaign, utm_term, utm_content,
gclid, gbraid, wbraid, fbclid, msclkid, ttclid
```

Until a webhook is set, leads are only printed to the browser console.
Set `redirectUrl` in the same file to send people to a separate thank you page instead of the in page confirmation.

Tracking: the quiz pushes `quiz_start`, `quiz_step` and `lead_submit` events to `window.dataLayer`
(for Google Tag Manager) and fires `fbq('track', 'Lead')` when the Meta Pixel is installed.

## Before launch

* Have counsel review the TCPA consent text (`f.consent` in `assets/js/i18n.js`) and the attorney advertising notice.
* The Meta Pixel is added to every page by `build.py`; the quiz also fires `fbq('track', 'Lead')` on submit.
