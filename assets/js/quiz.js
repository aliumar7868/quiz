/*
 * Step by step intake quiz shared by the 305-EN-DOLOR landing pages.
 *
 *   LPQuiz.mount({
 *     el: '#quiz',
 *     variant: 'payout-check',              // sent with the lead as landing_page
 *     steps: ['accident_type', 'accident_date', ..., { id: 'contact', kind: 'fields', fields: ['name', 'email', 'phone'] }],
 *     counter: 'q.stepOf',                  // translation key for "Step 1 of 6", or false to hide
 *     onStep: function (ctx) {}, onAnswer: function (ctx) {}, onComplete: function (ctx) {}
 *   });
 *
 * A step is either the id of a built in question below or an object that
 * overrides / defines one. Kinds: "choice", "fields" (the last fields step
 * submits the lead) and "scan" (an animated review screen that auto advances).
 */
(function () {
  'use strict';

  var I = window.LPI18n;
  var CFG = window.LP_CONFIG || {};

  var ICONS = {
    car: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 17h14M3 17v-4l2.2-5.3A2 2 0 0 1 7 6.5h10a2 2 0 0 1 1.8 1.2L21 13v4"/><path d="M3 13h18"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/></svg>',
    rideshare: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M9.5 13.5h5M9 15.5l.8-2.6h4.4l.8 2.6"/><circle cx="10" cy="16.5" r=".6"/><circle cx="14" cy="16.5" r=".6"/><path d="M12 6.5a2 2 0 0 1 2 2c0 1.5-2 3-2 3s-2-1.5-2-3a2 2 0 0 1 2-2z"/></svg>',
    slip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 2 20h20L12 3z"/><path d="M12 10v4"/><circle cx="12" cy="17" r=".8" fill="currentColor"/></svg>',
    clock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></svg>',
    calendar: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></svg>',
    hourglass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 3h12M6 21h12M7 3c0 5 10 5 10 9s-10 4-10 9M17 3c0 5-10 5-10 9s10 4 10 9"/></svg>',
    yes: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m8 12.5 2.7 2.7L16 9.8"/></svg>',
    no: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><path d="m9 9 6 6M15 9l-6 6"/></svg>',
    lock: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>',
    back: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    check: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>'
  };

  var YES_NO = [
    { value: 'yes', label: 'q.yes', icon: 'yes' },
    { value: 'no', label: 'q.no', icon: 'no' }
  ];

  var QUESTIONS = {
    accident_type: {
      kind: 'choice', title: 'q.type.title', layout: 'list',
      options: [
        { value: 'motor_vehicle', label: 'q.type.mv', sub: 'q.type.mv.sub', icon: 'car' },
        { value: 'rideshare', label: 'q.type.rs', sub: 'q.type.rs.sub', icon: 'rideshare' },
        { value: 'slip_fall', label: 'q.type.sf', sub: 'q.type.sf.sub', icon: 'slip' }
      ]
    },
    accident_date: {
      kind: 'choice', title: 'q.date.title', layout: 'list',
      options: [
        { value: 'last_7_days', label: 'q.date.7', icon: 'clock' },
        { value: '7_14_days', label: 'q.date.14', icon: 'calendar' },
        { value: '14_plus_days', label: 'q.date.14plus', icon: 'hourglass' }
      ]
    },
    police_report: { kind: 'choice', title: 'q.police.title', layout: 'yesno', options: YES_NO },
    injured: { kind: 'choice', title: 'q.injured.title', layout: 'yesno', options: YES_NO },
    has_attorney: { kind: 'choice', title: 'q.attorney.title', layout: 'yesno', options: YES_NO }
  };

  var FIELDS = {
    name: { type: 'text', label: 'f.name', placeholder: 'f.name.ph', autocomplete: 'name', error: 'f.err.name', inputmode: 'text' },
    email: { type: 'email', label: 'f.email', placeholder: 'f.email.ph', autocomplete: 'email', error: 'f.err.email', inputmode: 'email' },
    phone: { type: 'tel', label: 'f.phone', placeholder: 'f.phone.ph', autocomplete: 'tel-national', error: 'f.err.phone', inputmode: 'tel' }
  };

  var reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function esc(v) { return I.escapeHtml(v == null ? '' : v); }

  function phoneDigits(value) {
    var d = String(value || '').replace(/\D/g, '');
    if (d.length === 11 && d.charAt(0) === '1') d = d.slice(1);
    return d.slice(0, 10);
  }

  function formatPhone(value) {
    var d = phoneDigits(value);
    if (d.length < 4) return d;
    if (d.length < 7) return '(' + d.slice(0, 3) + ') ' + d.slice(3);
    return '(' + d.slice(0, 3) + ') ' + d.slice(3, 6) + '-' + d.slice(6);
  }

  var VALIDATORS = {
    name: function (v) { return /\p{L}.*\p{L}/u.test(String(v || '').trim()); },
    email: function (v) { return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(String(v || '').trim()); },
    phone: function (v) {
      var d = phoneDigits(v);
      return d.length === 10 && /^[2-9]\d{2}[2-9]\d{6}$/.test(d);
    }
  };

  function track(event, data) {
    window.dataLayer = window.dataLayer || [];
    var payload = { event: event };
    for (var k in data) payload[k] = data[k];
    window.dataLayer.push(payload);
  }

  function mount(opts) {
    var root = typeof opts.el === 'string' ? document.querySelector(opts.el) : opts.el;
    if (!root) return null;

    var steps = opts.steps.map(function (s) {
      var def = typeof s === 'string' ? { id: s } : s;
      var base = QUESTIONS[def.id] || {};
      var merged = {};
      for (var k in base) merged[k] = base[k];
      for (var j in def) merged[j] = def[j];
      return merged;
    });
    var lastFieldsIndex = -1;
    steps.forEach(function (s, i) { if (s.kind === 'fields') lastFieldsIndex = i; });
    var countable = steps.filter(function (s) { return s.kind !== 'scan'; });

    var state = { index: 0, answers: {}, fields: { name: '', email: '', phone: '' }, done: false, started: false, history: [] };
    var counterKey = opts.counter === undefined ? 'q.stepOf' : opts.counter;
    var scanTimer = null;

    root.classList.add('quiz');
    root.setAttribute('data-variant', opts.variant || '');

    function firstName() {
      var n = String(state.fields.name || '').trim().split(/\s+/)[0] || '';
      return n ? n.charAt(0).toUpperCase() + n.slice(1) : '';
    }

    function ctx() {
      return {
        step: steps[state.index], index: state.index, steps: steps,
        number: countNumber(state.index), total: countable.length,
        answers: state.answers, fields: state.fields, firstName: firstName(), done: state.done
      };
    }

    function countNumber(i) {
      var n = 0;
      for (var x = 0; x <= i && x < steps.length; x++) if (steps[x].kind !== 'scan') n++;
      return Math.max(n, 1);
    }

    function title(step) {
      var name = firstName();
      if (name && step.titleNamed) return I.t(step.titleNamed, { name: name });
      return I.t(step.title, { name: name });
    }

    function header() {
      var number = countNumber(state.index);
      var pct = Math.round(((number - 1) / countable.length) * 100);
      if (state.done) pct = 100;
      if (state.done) return '';
      var html = '<div class="quiz-head">';
      html += state.index > 0 && !state.done
        ? '<button type="button" class="quiz-back" data-act="back">' + ICONS.back + '<span>' + I.t('q.back') + '</span></button>'
        : '<span></span>';
      if (counterKey && !state.done) html += '<span class="quiz-count">' + I.t(counterKey, { n: number, total: countable.length }) + '</span>';
      html += '</div>';
      if (opts.progress !== false) {
        html += '<div class="quiz-progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + pct + '"><span style="width:' + Math.max(pct, 4) + '%"></span></div>';
      }
      return html;
    }

    function renderChoice(step) {
      var selected = state.answers[step.id];
      var html = '<div class="quiz-options quiz-options--' + (step.layout || 'list') + '" role="group" aria-labelledby="qt-' + step.id + '">';
      step.options.forEach(function (o) {
        var on = selected === o.value;
        html += '<button type="button" class="quiz-option' + (on ? ' is-selected' : '') + '" data-act="choose" data-value="' + esc(o.value) + '" aria-pressed="' + on + '">';
        if (o.icon) html += '<span class="quiz-option-icon" aria-hidden="true">' + ICONS[o.icon] + '</span>';
        html += '<span class="quiz-option-text"><strong>' + I.t(o.label) + '</strong>';
        if (o.sub) html += '<small>' + I.t(o.sub) + '</small>';
        html += '</span><span class="quiz-option-check" aria-hidden="true">' + ICONS.check + '</span></button>';
      });
      return html + '</div>';
    }

    function renderFields(step, i) {
      var isFinal = i === lastFieldsIndex;
      var buttonKey = step.submit || (isFinal ? 'f.submit' : 'q.next');
      var html = '<form class="quiz-form" novalidate data-final="' + isFinal + '">';
      step.fields.forEach(function (name) {
        var f = FIELDS[name];
        var value = name === 'phone' ? formatPhone(state.fields[name]) : state.fields[name];
        html += '<div class="quiz-field">' +
          '<label for="qf-' + name + '">' + I.t(f.label) + '</label>' +
          '<input id="qf-' + name + '" name="' + name + '" type="' + f.type + '" inputmode="' + f.inputmode + '" autocomplete="' + f.autocomplete + '"' +
          (name === 'name' ? ' autocapitalize="words"' : ' autocapitalize="off" spellcheck="false"') +
          (name === 'phone' ? ' maxlength="14"' : '') +
          ' placeholder="' + esc(I.t(f.placeholder)) + '" value="' + esc(value) + '" aria-describedby="qe-' + name + '" required>' +
          '<p class="quiz-error" id="qe-' + name + '" hidden>' + I.t(f.error) + '</p></div>';
      });
      // Honeypot: real people never see or fill this field.
      if (isFinal) html += '<div class="quiz-hp" aria-hidden="true"><label>Company<input type="text" name="company" tabindex="-1" autocomplete="off"></label></div>';
      html += '<button type="submit" class="btn btn-primary btn-block quiz-submit">' +
        '<span class="quiz-submit-label">' + I.t(buttonKey) + '</span>' + ICONS.arrow + '</button>';
      if (isFinal) {
        html += '<p class="quiz-form-error" role="alert" hidden></p>';
        html += '<p class="quiz-consent">' + I.t('f.consent', { button: I.t(buttonKey).replace(/<[^>]+>/g, '') }) + '</p>';
      }
      return html + '</form>';
    }

    function renderScan(step) {
      var html = '<ul class="quiz-scan">';
      step.items.forEach(function (key, n) {
        html += '<li style="--d:' + (n * (step.itemDelay || 700)) + 'ms"><span class="quiz-scan-dot" aria-hidden="true">' + ICONS.check + '</span>' + I.t(key) + '</li>';
      });
      return html + '</ul><div class="quiz-scan-bar" aria-hidden="true"><span style="--t:' + scanDuration(step) + 'ms"></span></div>';
    }

    function scanDuration(step) {
      return reduceMotion ? 900 : (step.duration || (step.items.length * (step.itemDelay || 700) + 900));
    }

    function renderDone() {
      var name = firstName();
      if (typeof opts.renderDone === 'function') return opts.renderDone(ctx());
      return '<div class="quiz-done">' +
        '<div class="quiz-done-icon" aria-hidden="true">' + ICONS.check + '</div>' +
        '<h2 class="quiz-title" tabindex="-1">' + (name ? I.t('done.title', { name: name }) : I.t('done.titleNoName')) + '</h2>' +
        '<p class="quiz-sub">' + I.t('done.text') + '</p>' +
        '<h3 class="quiz-done-next">' + I.t('done.next') + '</h3>' +
        '<ol class="quiz-done-list"><li>' + I.t('done.1') + '</li><li>' + I.t('done.2') + '</li><li>' + I.t('done.3') + '</li></ol>' +
        '</div>';
    }

    function render(animate) {
      clearTimeout(scanTimer);
      var step = steps[state.index];
      var html = header();
      html += '<div class="quiz-body' + (animate && !reduceMotion ? ' is-entering' : '') + '">';
      if (state.done) {
        html += renderDone();
      } else {
        html += '<h2 class="quiz-title" id="qt-' + step.id + '" tabindex="-1">' + title(step) + '</h2>';
        if (step.sub) html += '<p class="quiz-sub">' + I.t(step.sub, { name: firstName() }) + '</p>';
        if (step.kind === 'choice') html += renderChoice(step);
        else if (step.kind === 'fields') html += renderFields(step, state.index);
        else if (step.kind === 'scan') html += renderScan(step);
        if (step.kind !== 'scan') html += '<p class="quiz-private">' + ICONS.lock + '<span>' + I.t('q.private') + '</span></p>';
      }
      html += '</div>';
      root.innerHTML = html;

      if (animate) {
        var body = root.querySelector('.quiz-body');
        requestAnimationFrame(function () { requestAnimationFrame(function () { body.classList.remove('is-entering'); }); });
        var heading = root.querySelector('.quiz-title');
        if (heading) heading.focus({ preventScroll: true });
        var rect = root.getBoundingClientRect();
        if (rect.top < 0 || rect.top > window.innerHeight * 0.6) {
          root.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }

      if (!state.done && step.kind === 'scan') {
        scanTimer = setTimeout(function () { go(state.index + 1); }, scanDuration(step));
      }
      if (typeof opts.onStep === 'function') opts.onStep(ctx());
    }

    function go(index) {
      if (index !== state.index) state.history.push(state.index);
      state.index = Math.max(0, Math.min(index, steps.length - 1));
      track('quiz_step', { landing_page: opts.variant, quiz_step: state.index + 1, quiz_step_id: steps[state.index].id });
      render(true);
    }

    function back() {
      // Never land back on an animated scan screen.
      var prev = state.history.pop();
      while (prev !== undefined && steps[prev].kind === 'scan') prev = state.history.pop();
      if (prev === undefined) {
        prev = state.index - 1;
        while (prev > 0 && steps[prev].kind === 'scan') prev--;
      }
      state.index = Math.max(0, prev);
      render(true);
    }

    function markStarted() {
      if (state.started) return;
      state.started = true;
      track('quiz_start', { landing_page: opts.variant, language: I.lang });
      if (typeof opts.onStart === 'function') opts.onStart(ctx());
    }

    function validate(form) {
      var firstBad = null;
      form.querySelectorAll('input[required]').forEach(function (input) {
        var ok = VALIDATORS[input.name](input.value);
        var err = form.querySelector('#qe-' + input.name);
        input.setAttribute('aria-invalid', ok ? 'false' : 'true');
        if (err) err.hidden = ok;
        if (!ok && !firstBad) firstBad = input;
      });
      if (firstBad) firstBad.focus();
      return !firstBad;
    }

    function englishLabel(stepId, value) {
      var q = QUESTIONS[stepId];
      if (!q) return value;
      for (var i = 0; i < q.options.length; i++) {
        if (q.options[i].value === value) return I.t(q.options[i].label, null, 'en').replace(/&amp;/g, '&');
      }
      return value;
    }

    function buildLead(form) {
      var params = new URLSearchParams(window.location.search);
      var a = state.answers;
      var full = String(state.fields.name || '').trim().replace(/\s+/g, ' ');
      var parts = full.split(' ');
      var digits = phoneDigits(state.fields.phone);
      var lead = {
        full_name: full,
        first_name: parts[0] || '',
        last_name: parts.slice(1).join(' '),
        email: String(state.fields.email || '').trim(),
        phone: '+1' + digits,
        phone_display: formatPhone(digits),
        accident_type: a.accident_type || '',
        accident_type_label: englishLabel('accident_type', a.accident_type),
        accident_date: a.accident_date || '',
        accident_date_label: englishLabel('accident_date', a.accident_date),
        police_report: a.police_report || '',
        injured: a.injured || '',
        has_attorney: a.has_attorney || '',
        qualified: a.injured === 'yes' && a.has_attorney === 'no' ? 'yes' : 'no',
        language: I.lang,
        landing_page: opts.variant || '',
        page_url: window.location.href,
        referrer: document.referrer || '',
        user_agent: navigator.userAgent,
        submitted_at: new Date().toISOString(),
        tcpa_consent: 'yes',
        tcpa_consent_text: (form.querySelector('.quiz-consent') || {}).textContent || ''
      };
      ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'gclid', 'gbraid', 'wbraid', 'fbclid', 'msclkid', 'ttclid'].forEach(function (key) {
        lead[key] = params.get(key) || '';
      });
      var yn = function (v) { return v === 'yes' ? 'Yes' : v === 'no' ? 'No' : ''; };
      lead.language_label = I.lang === 'es' ? 'Spanish' : 'English';
      lead.police_report_label = yn(lead.police_report);
      lead.injured_label = yn(lead.injured);
      lead.has_attorney_label = yn(lead.has_attorney);
      lead.tags = ['305 quiz lead', 'lp ' + lead.landing_page, 'lang ' + lead.language].join(',');
      // Plain text recap, handy for notification emails and contact notes.
      lead.lead_summary = [
        'Name: ' + lead.full_name,
        'Phone: ' + lead.phone_display,
        'Email: ' + lead.email,
        'Accident type: ' + lead.accident_type_label,
        'When: ' + lead.accident_date_label,
        'Police report: ' + lead.police_report_label,
        'Injured: ' + lead.injured_label,
        'Already has an attorney: ' + lead.has_attorney_label,
        'Language: ' + lead.language_label,
        'Landing page: ' + lead.landing_page
      ].join('\n');
      return lead;
    }

    function send(lead) {
      if (!CFG.webhookUrl) {
        console.info('[LPQuiz] No webhookUrl set in assets/js/config.js. Lead not sent:', lead);
        return Promise.resolve();
      }
      if (CFG.webhookFormat === 'form') {
        // Form encoded + no-cors is a "simple" request that works with any
        // webhook, even ones that do not allow browser (CORS) requests.
        return fetch(CFG.webhookUrl, {
          method: 'POST',
          mode: 'no-cors',
          keepalive: true,
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams(lead).toString()
        });
      }
      // JSON (default): GoHighLevel, Zapier and Make read it field by field.
      return fetch(CFG.webhookUrl, {
        method: 'POST',
        keepalive: true,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(lead)
      }).then(function (res) {
        if (!res.ok) throw new Error('Webhook responded ' + res.status);
      });
    }

    function submit(form) {
      var btn = form.querySelector('.quiz-submit');
      var label = form.querySelector('.quiz-submit-label');
      var errorEl = form.querySelector('.quiz-form-error');
      var lead = buildLead(form);
      var isBot = form.company && form.company.value;

      btn.disabled = true;
      label.innerHTML = I.t('f.sending');
      errorEl.hidden = true;

      (isBot ? Promise.resolve() : send(lead)).then(function () {
        track('lead_submit', { landing_page: opts.variant, language: I.lang, accident_type: lead.accident_type, qualified: lead.qualified });
        if (typeof window.fbq === 'function') window.fbq('track', 'Lead');
        if (typeof opts.onComplete === 'function') opts.onComplete(ctx(), lead);
        if (CFG.redirectUrl) {
          window.location.href = CFG.redirectUrl.replace('{lang}', I.lang);
          return;
        }
        state.done = true;
        render(true);
      }).catch(function () {
        btn.disabled = false;
        label.innerHTML = I.t(steps[state.index].submit || 'f.submit');
        errorEl.innerHTML = I.t('f.error');
        errorEl.hidden = false;
      });
    }

    root.addEventListener('click', function (e) {
      var el = e.target.closest('[data-act]');
      if (!el || !root.contains(el)) return;
      var act = el.getAttribute('data-act');
      if (act === 'back') { back(); return; }
      if (act === 'choose') {
        var step = steps[state.index];
        markStarted();
        state.answers[step.id] = el.getAttribute('data-value');
        root.querySelectorAll('.quiz-option').forEach(function (b) {
          var on = b === el;
          b.classList.toggle('is-selected', on);
          b.setAttribute('aria-pressed', on);
        });
        if (typeof opts.onAnswer === 'function') opts.onAnswer(ctx());
        var at = state.index;
        setTimeout(function () { if (state.index === at) go(at + 1); }, reduceMotion ? 0 : 260);
      }
    });

    root.addEventListener('input', function (e) {
      var input = e.target;
      if (!(input.name in state.fields)) return;
      if (input.name === 'phone') {
        var formatted = formatPhone(input.value);
        if (formatted !== input.value) input.value = formatted;
      }
      state.fields[input.name] = input.value;
      if (input.getAttribute('aria-invalid') === 'true' && VALIDATORS[input.name](input.value)) {
        input.setAttribute('aria-invalid', 'false');
        var err = root.querySelector('#qe-' + input.name);
        if (err) err.hidden = true;
      }
      markStarted();
      if (typeof opts.onAnswer === 'function') opts.onAnswer(ctx());
    });

    root.addEventListener('submit', function (e) {
      e.preventDefault();
      var form = e.target;
      if (!validate(form)) return;
      markStarted();
      if (form.getAttribute('data-final') === 'true') submit(form);
      else go(state.index + 1);
    });

    I.onChange(function () { render(false); });
    render(false);

    return {
      state: state,
      steps: steps,
      go: go,
      render: render,
      reset: function () { state.index = 0; state.done = false; state.history = []; render(true); }
    };
  }

  window.LPQuiz = { mount: mount, icons: ICONS, questions: QUESTIONS };
})();
