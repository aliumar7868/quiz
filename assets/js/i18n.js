/*
 * English / Spanish support for the 305-EN-DOLOR landing pages.
 *
 * Language is chosen in this order:
 *   1. ?lang=es or ?lang=en in the URL (handy for ads that target one language)
 *   2. A language the visitor picked with the on page toggle
 *   3. The visitor's phone / browser language (Spanish => es, anything else => en)
 *
 * Mark up text with data-i18n="key" (inner HTML is replaced), attributes with
 * data-i18n-attr="placeholder:key;aria-label:key", and links to the main site
 * with data-site-path="/privacy" (becomes https://305endolor.com/{lang}/privacy).
 */
(function () {
  'use strict';

  var STORAGE_KEY = 'lp_lang';
  var SUPPORTED = ['en', 'es'];
  var dict = { en: {}, es: {} };
  var listeners = [];

  function readStored() {
    try { return localStorage.getItem(STORAGE_KEY); } catch (e) { return null; }
  }

  function writeStored(lang) {
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* private mode */ }
  }

  function detect() {
    var param = new URLSearchParams(window.location.search).get('lang');
    if (param && SUPPORTED.indexOf(param.toLowerCase()) !== -1) return param.toLowerCase();

    var stored = readStored();
    if (stored && SUPPORTED.indexOf(stored) !== -1) return stored;

    var langs = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language || 'en'];
    return /^es\b/i.test(langs[0] || '') ? 'es' : 'en';
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
    });
  }

  function siteUrl(path, lang) {
    var base = (window.LP_CONFIG && window.LP_CONFIG.siteUrl) || 'https://305endolor.com';
    return base + '/' + (lang || api.lang) + (path || '');
  }

  function t(key, vars, lang) {
    lang = lang || api.lang;
    var str = dict[lang][key];
    if (str === undefined) str = dict.en[key];
    if (str === undefined) return key;
    var cfg = window.LP_CONFIG || {};
    var all = {
      brand: cfg.brand,
      privacyUrl: siteUrl('/privacy', lang),
      termsUrl: siteUrl('/terms', lang),
      statesUrl: siteUrl('/state-disclosures', lang)
    };
    for (var k in vars) if (Object.prototype.hasOwnProperty.call(vars, k)) all[k] = vars[k];
    return str.replace(/\{(\w+)\}/g, function (m, name) {
      return all[name] === undefined || all[name] === null ? m : escapeHtml(all[name]);
    });
  }

  function apply(root) {
    root = root || document;

    root.querySelectorAll('[data-i18n]').forEach(function (el) {
      el.innerHTML = t(el.getAttribute('data-i18n'));
    });
    root.querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':');
        if (parts.length === 2) el.setAttribute(parts[0].trim(), t(parts[1].trim()));
      });
    });
    root.querySelectorAll('[data-site-path]').forEach(function (el) {
      el.setAttribute('href', siteUrl(el.getAttribute('data-site-path')));
    });
    root.querySelectorAll('[data-lang-toggle]').forEach(function (el) {
      el.textContent = t('lang.switch');
      el.setAttribute('aria-label', t('lang.switchAria'));
      el.setAttribute('lang', api.lang === 'en' ? 'es' : 'en');
    });

    if (root === document) {
      if (dict[api.lang]['meta.title']) document.title = t('meta.title');
      var desc = document.querySelector('meta[name="description"]');
      if (desc && dict[api.lang]['meta.description']) desc.setAttribute('content', t('meta.description'));
    }
  }

  function setLang(lang, persist) {
    if (SUPPORTED.indexOf(lang) === -1) return;
    api.lang = lang;
    document.documentElement.lang = lang;
    if (persist) writeStored(lang);
    apply(document);
    listeners.forEach(function (fn) { fn(lang); });
  }

  var api = {
    lang: detect(),
    t: t,
    apply: apply,
    setLang: setLang,
    siteUrl: siteUrl,
    escapeHtml: escapeHtml,
    extend: function (more) {
      SUPPORTED.forEach(function (l) {
        if (more[l]) for (var k in more[l]) dict[l][k] = more[l][k];
      });
    },
    onChange: function (fn) { listeners.push(fn); }
  };
  window.LPI18n = api;

  // Hide translatable text until the right language is applied (no English flash for Spanish phones).
  document.documentElement.lang = api.lang;
  document.documentElement.classList.add('i18n-pending');

  document.addEventListener('DOMContentLoaded', function () {
    apply(document);
    document.documentElement.classList.remove('i18n-pending');
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-lang-toggle]');
      if (!btn) return;
      e.preventDefault();
      setLang(api.lang === 'en' ? 'es' : 'en', true);
    });
  });

  /* ------------------------------------------------------------------ */
  /* Strings shared by all three landing pages                           */
  /* ------------------------------------------------------------------ */
  api.extend({
    en: {
      'lang.switch': 'Español',
      'lang.switchAria': 'Ver esta página en español',
      'header.spanish': 'English &amp; Spanish · 24/7',
      'trust.free': '100% Free Consultation',
      'trust.fast': '5 Min Response · 24/7',
      'trust.nofee': 'No Upfront Fees',
      'trust.bilingual': 'English &amp; Spanish',

      'q.stepOf': 'Step {n} of {total}',
      'q.questionOf': 'Question {n} of {total}',
      'q.back': 'Back',
      'q.next': 'Next',
      'q.yes': 'Yes',
      'q.no': 'No',
      'q.private': 'Your information is private and secure',
      'q.type.title': 'What type of accident were you in?',
      'q.type.mv': 'Motor Vehicle',
      'q.type.mv.sub': 'Car, motorcycle, truck, etc.',
      'q.type.rs': 'Uber / Lyft',
      'q.type.rs.sub': 'Rideshare driver or passenger',
      'q.type.sf': 'Slip &amp; Fall',
      'q.type.sf.sub': 'Store, property, sidewalk, etc.',
      'q.date.title': 'When was your accident?',
      'q.date.7': 'Last 7 days',
      'q.date.14': '7 to 14 days ago',
      'q.date.14plus': '14+ days ago',
      'q.police.title': 'Do you have an accident report from the police?',
      'q.injured.title': 'Did you get injured during your accident?',
      'q.attorney.title': 'Are you already working with an attorney?',

      'f.name': 'Full name',
      'f.name.ph': 'First and last name',
      'f.email': 'Email',
      'f.email.ph': 'you@example.com',
      'f.phone': 'Phone number',
      'f.phone.ph': '(305) 555-0123',
      'f.err.name': 'Please enter your full name.',
      'f.err.email': 'Please enter a valid email address.',
      'f.err.phone': 'Please enter a valid 10 digit US phone number.',
      'f.submit': 'Get My Free Case Review',
      'f.sending': 'Sending…',
      'f.error': 'Something went wrong. Please check your connection and try again.',
      'f.consent': 'By clicking “{button}”, I agree that {brand} (operated by LegalNow247.com LLC) and its participating attorneys may contact me about my accident at the phone number and email I provided, including by calls and text messages that may use automated technology or prerecorded or artificial voice messages, even if my number is on a Do Not Call list. Consent is not a condition of any purchase or service. Message and data rates may apply; reply STOP to opt out. I agree to the <a href="{privacyUrl}" target="_blank" rel="noopener">Privacy Policy</a> and <a href="{termsUrl}" target="_blank" rel="noopener">Terms of Use</a>.',

      'done.title': 'Thank you, {name}!',
      'done.titleNoName': 'Thank you!',
      'done.text': 'Your free case review request was received. A bilingual case specialist will call you shortly. Please keep your phone nearby and answer the call.',
      'done.next': 'What happens next',
      'done.1': 'A specialist reviews your answers, usually within 5 minutes during business hours.',
      'done.2': 'We call you to hear what happened and answer your questions, in English or Spanish.',
      'done.3': 'If you have a case, we connect you with an attorney. No upfront fees.',

      'footer.notice': '<strong>NOTICE ABOUT ATTORNEY ADVERTISING:</strong> This website is a pooled attorney advertisement. 305-EN-DOLOR is not a law firm or a lawyer referral service. Attorneys appearing on 305-EN-DOLOR have paid an advertising fee. Using 305-EN-DOLOR is not intended to and does not create an attorney client relationship between a Subscriber Attorney and any Requestors. The information contained on 305-EN-DOLOR is not legal advice and the subscriber attorneys listed do not in any way constitute a referral or endorsement by this site. 305-EN-DOLOR is owned and operated by LegalNow247.com LLC.',
      'footer.states': 'If you live in AL, FL, MO, NY or WY, <a href="{statesUrl}" target="_blank" rel="noopener">click here</a> to see additional information about attorney advertising in your state.',
      'footer.privacy': 'Privacy Policy',
      'footer.terms': 'Terms of Use',
      'footer.disclosures': 'State Disclosures',
      'footer.rights': '© 2026 305-EN-DOLOR. All rights reserved. Serving Miami and South Florida.'
    },
    es: {
      'lang.switch': 'English',
      'lang.switchAria': 'View this page in English',
      'header.spanish': 'Español e inglés · 24/7',
      'trust.free': 'Consulta 100% gratis',
      'trust.fast': 'Respuesta en 5 min · 24/7',
      'trust.nofee': 'Sin honorarios por adelantado',
      'trust.bilingual': 'Inglés y Español',

      'q.stepOf': 'Paso {n} de {total}',
      'q.questionOf': 'Pregunta {n} de {total}',
      'q.back': 'Atrás',
      'q.next': 'Siguiente',
      'q.yes': 'Sí',
      'q.no': 'No',
      'q.private': 'Tu información es privada y segura',
      'q.type.title': '¿Qué tipo de accidente tuviste?',
      'q.type.mv': 'Vehículo motorizado',
      'q.type.mv.sub': 'Auto, motocicleta, camión, etc.',
      'q.type.rs': 'Uber / Lyft',
      'q.type.rs.sub': 'Conductor o pasajero de rideshare',
      'q.type.sf': 'Resbalón y caída',
      'q.type.sf.sub': 'Tienda, propiedad, acera, etc.',
      'q.date.title': '¿Cuándo fue tu accidente?',
      'q.date.7': 'En los últimos 7 días',
      'q.date.14': 'Hace 7 a 14 días',
      'q.date.14plus': 'Hace más de 14 días',
      'q.police.title': '¿Tienes un reporte de accidente de la policía?',
      'q.injured.title': '¿Sufriste alguna lesión en tu accidente?',
      'q.attorney.title': '¿Ya estás trabajando con un abogado?',

      'f.name': 'Nombre completo',
      'f.name.ph': 'Nombre y apellido',
      'f.email': 'Correo electrónico',
      'f.email.ph': 'tu@ejemplo.com',
      'f.phone': 'Número de teléfono',
      'f.phone.ph': '(305) 555-0123',
      'f.err.name': 'Por favor escribe tu nombre completo.',
      'f.err.email': 'Por favor escribe un correo electrónico válido.',
      'f.err.phone': 'Por favor escribe un número de teléfono válido de 10 dígitos.',
      'f.submit': 'Obtener mi revisión gratis',
      'f.sending': 'Enviando…',
      'f.error': 'Algo salió mal. Revisa tu conexión e inténtalo de nuevo.',
      'f.consent': 'Al hacer clic en “{button}”, acepto que {brand} (operado por LegalNow247.com LLC) y sus abogados participantes me contacten sobre mi accidente al número de teléfono y correo electrónico que proporcioné, incluso mediante llamadas y mensajes de texto que pueden usar tecnología automatizada o mensajes pregrabados o de voz artificial, aunque mi número esté en una lista de No Llamar. El consentimiento no es una condición para ninguna compra o servicio. Pueden aplicarse tarifas de mensajes y datos; responde STOP para cancelar. Acepto la <a href="{privacyUrl}" target="_blank" rel="noopener">Política de privacidad</a> y los <a href="{termsUrl}" target="_blank" rel="noopener">Términos de uso</a>.',

      'done.title': '¡Gracias, {name}!',
      'done.titleNoName': '¡Gracias!',
      'done.text': 'Recibimos tu solicitud de revisión gratuita. Un especialista bilingüe te llamará en breve. Ten tu teléfono a la mano y contesta la llamada.',
      'done.next': 'Qué sigue',
      'done.1': 'Un especialista revisa tus respuestas, normalmente en 5 minutos durante el horario de atención.',
      'done.2': 'Te llamamos para escuchar lo que pasó y responder tus preguntas, en español o en inglés.',
      'done.3': 'Si tienes un caso, te conectamos con un abogado. Sin honorarios por adelantado.',

      'footer.notice': '<strong>AVISO SOBRE PUBLICIDAD DE ABOGADOS:</strong> Este sitio web es un anuncio colectivo de abogados. 305-EN-DOLOR no es un bufete de abogados ni un servicio de referencia de abogados. Los abogados que aparecen en 305-EN-DOLOR han pagado una tarifa publicitaria. El uso de 305-EN-DOLOR no pretende ni crea una relación abogado cliente entre un Abogado Suscriptor y cualquier Solicitante. La información contenida en 305-EN-DOLOR no es asesoramiento legal y los abogados suscriptores enumerados no constituyen de ninguna manera una referencia o respaldo por parte de este sitio. 305-EN-DOLOR es propiedad de LegalNow247.com LLC.',
      'footer.states': 'Si vives en AL, FL, MO, NY o WY, <a href="{statesUrl}" target="_blank" rel="noopener">haz clic aquí</a> para ver información adicional sobre publicidad de abogados en tu estado.',
      'footer.privacy': 'Política de privacidad',
      'footer.terms': 'Términos de uso',
      'footer.disclosures': 'Avisos estatales',
      'footer.rights': '© 2026 305-EN-DOLOR. Todos los derechos reservados. Atendemos Miami y el sur de Florida.'
    }
  });
})();
