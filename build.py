#!/usr/bin/env python3
"""Build the live landing page sites.

    python3 build.py

Writes one folder (and a matching .zip) per site into dist/. Upload the
contents of a folder to that site's subdomain. Each site gets its own
language, brand, logo, legal links, webhook and Meta Pixel; the pages and
quiz are shared, so a change in the source shows up on every site.
"""
import json
import re
import shutil
import time
from pathlib import Path

ROOT = Path(__file__).resolve().parent
DIST = ROOT / 'dist'
PAGES = ['index.html', 'payout-check/index.html', 'case-scan/index.html', 'free-check/index.html']
SHARED_FILES = ['assets/css/base.css', 'assets/js/i18n.js', 'assets/js/quiz.js',
                'assets/img/remove-the-background-completely-keep-on-DhIvIZ.png']

META_PIXEL = """<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '{pixel_id}');
fbq('track', 'PageView');
</script>
<noscript><img height="1" width="1" style="display:none"
src="https://www.facebook.com/tr?id={pixel_id}&ev=PageView&noscript=1"
/></noscript>
<!-- End Meta Pixel Code -->"""

SITES = [
    {
        # 305 En Dolor: Spanish only.
        'name': '305-en-dolor-es',
        'lang': 'es',
        'brand': '305-EN-DOLOR',
        'owner': 'LegalNow247.com LLC',
        'siteUrl': 'https://305endolor.com',
        'logo': {'file': 'horizontal.png', 'width': 1737, 'height': 608, 'alt': '¿Accidente? 305-EN-DOLOR'},
        'favicon': 'favicon.png',
        'links': {
            'privacy': 'https://305endolor.com/es/privacy',
            'terms': 'https://305endolor.com/es/terms',
            'disclosures': 'https://305endolor.com/es/state-disclosures',
        },
        'webhookUrl': 'https://services.leadconnectorhq.com/hooks/5PVc3IMfaiegpuC3USeQ/webhook-trigger/3406dd33-a4f8-4ceb-b906-7a04936ffabd',
        'pixelId': '1011167131998402',
        'strings': {},
    },
    {
        # LegalNow247: English only.
        'name': 'legalnow247-en',
        'lang': 'en',
        'brand': 'LegalNow247',
        'owner': 'LegalNow247.com LLC',
        'siteUrl': 'https://legalnow247.com',
        'logo': {'file': 'legalnow247-logo.png', 'width': 200, 'height': 27, 'alt': 'LegalNow247.com',
                 'css': '.site-logo img{height:28px}@media (min-width:760px){.site-logo img{height:34px}}'},
        'favicon': 'legalnow247-favicon.png',
        'links': {
            'privacy': 'https://legalnow247.com/privacy-policy/',
            'terms': 'https://legalnow247.com/terms-conditions/',
            'disclosures': '',
        },
        # Waiting on the LegalNow247 GHL webhook; until it is set, leads are
        # only printed to the browser console.
        'webhookUrl': '',
        'pixelId': '1011167131998402',
        'strings': {
            'en': {
                'footer.notice': 'LegalNow247 is not a law firm and is not an attorney directory. We are a legal concierge and attorney connection service that helps consumers connect with independent, qualified attorneys. Use of this service does not create an attorney-client relationship with LegalNow247. We do not provide legal advice.',
                'footer.terms': 'Terms &amp; Conditions',
            }
        },
    },
]


def page_meta(html, key, lang):
    """Read a page's own title / description for the site language, so the
    static tags (used by link previews) are already in that language."""
    values = re.findall(r"'" + re.escape(key) + r"': '((?:[^'\\]|\\.)*)'", html)
    if len(values) < 2:
        return None
    return values[0 if lang == 'en' else 1]


def build_page(html, site, stamp):
    logo = site['logo']
    html = html.replace('<html lang="en">', '<html lang="%s">' % site['lang'], 1)
    # One language per site: no language switch.
    html = re.sub(r'\n\s*<button[^>]*data-lang-toggle[^>]*>.*?</button>', '', html)
    html = re.sub(
        r'<img src="((?:\.\./)?)assets/img/horizontal\.png" alt="[^"]*" width="\d+" height="\d+"',
        lambda m: '<img src="%sassets/img/%s" alt="%s" width="%d" height="%d"' % (
            m.group(1), logo['file'], logo['alt'], logo['width'], logo['height']),
        html)
    html = html.replace('assets/img/favicon.png"', 'assets/img/%s"' % site['favicon'])
    html = re.sub(r'\?v=[A-Za-z0-9]+"', '?v=%s"' % stamp, html)

    for key, tag in (('meta.title', 'title'), ('meta.description', 'description')):
        value = page_meta(html, key, site['lang'])
        if not value:
            continue
        value = value.replace('{brand}', site['brand']).replace('&amp;', '&').replace("\\'", "'")
        attr = value.replace('&', '&amp;').replace('"', '&quot;')
        if tag == 'title':
            html = re.sub(r'<title>[^<]*</title>', '<title>%s</title>' % attr, html, count=1)
        else:
            html = re.sub(r'<meta name="description" content="[^"]*">',
                          '<meta name="description" content="%s">' % attr, html, count=1)
    html = html.replace('305-EN-DOLOR', site['brand'])

    head_extra = META_PIXEL.replace('{pixel_id}', site['pixelId'])
    if logo.get('css'):
        head_extra = '<style>%s</style>\n  ' % logo['css'] + head_extra
    return html.replace('</head>', '  ' + head_extra + '\n</head>', 1)


def write_config(path, site):
    keys = ['brand', 'owner', 'siteUrl', 'lang', 'links', 'webhookUrl', 'strings']
    cfg = {k: site[k] for k in keys}
    cfg['webhookFormat'] = 'json'
    cfg['redirectUrl'] = ''
    path.write_text('/* Generated by build.py for %s. Edit SITES in build.py instead. */\n'
                    'window.LP_CONFIG = %s;\n' % (site['name'], json.dumps(cfg, ensure_ascii=False, indent=2)),
                    encoding='utf-8')


def main():
    stamp = time.strftime('%Y%m%d%H%M')
    if DIST.exists():
        shutil.rmtree(DIST)
    for site in SITES:
        out = DIST / site['name']
        for rel in SHARED_FILES + ['assets/img/' + site['logo']['file'], 'assets/img/' + site['favicon']]:
            (out / rel).parent.mkdir(parents=True, exist_ok=True)
            shutil.copy2(ROOT / rel, out / rel)
        write_config(out / 'assets/js/config.js', site)
        for rel in PAGES:
            (out / rel).parent.mkdir(parents=True, exist_ok=True)
            (out / rel).write_text(build_page((ROOT / rel).read_text(encoding='utf-8'), site, stamp), encoding='utf-8')
        shutil.make_archive(str(DIST / site['name']), 'zip', out)
        hook = 'webhook set' if site['webhookUrl'] else 'NO WEBHOOK YET'
        print('%-18s %s, %s -> dist/%s.zip' % (site['name'], site['lang'], hook, site['name']))


if __name__ == '__main__':
    main()
