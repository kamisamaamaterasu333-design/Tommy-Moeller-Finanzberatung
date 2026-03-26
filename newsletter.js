/**
 * newsletter.js – Newsletter-System
 * ────────────────────────────────────────────────────────────
 * Features:
 *  - E-Mail-Anmeldung mit Double-Opt-In Simulation
 *  - Abmelde-Link / Unsubscribe
 *  - Admin-Ansicht: alle Abonnenten verwalten
 *  - Honeypot-Spam-Schutz
 *  - E-Mail-Validierung
 *
 * Datenspeicherung: localStorage (Demo)
 * In Produktion ersetzen durch:
 *   - Mailchimp API / Brevo (Sendinblue) API
 *   - Eigenes Backend: POST /api/newsletter/subscribe
 *
 * Integration in HTML:
 *   <div class="newsletter-widget" data-variant="inline|banner|footer"></div>
 *   <script src="../assets/js/newsletter.js"></script>
 */

'use strict';

/* ═══ KONFIGURATION ═════════════════════════════════════════════════════ */
const NL_CONFIG = {
  storageKey:    'newsletter_subscribers',
  maxPerHour:    3,     // Max. Anmeldeversuche pro Stunde (Rate-Limiting)
  rateLimitKey:  'nl_rate',
};

/* ═══ DATENSCHICHT ══════════════════════════════════════════════════════ */
const NewsletterDB = {
  getAll() {
    try { return JSON.parse(localStorage.getItem(NL_CONFIG.storageKey) || '[]'); }
    catch { return []; }
  },
  save(list) {
    localStorage.setItem(NL_CONFIG.storageKey, JSON.stringify(list));
  },
  add(email, lang = 'de') {
    const list = this.getAll();
    if (list.find(s => s.email === email)) return { ok: false, reason: 'exists' };
    list.push({
      id:          Date.now(),
      email:       email.toLowerCase().trim(),
      lang,
      status:      'pending',   // pending → confirmed (nach Double-Opt-In)
      subscribedAt: Date.now(),
      confirmedAt:  null,
      source:      window.location.pathname,
    });
    this.save(list);
    return { ok: true };
  },
  confirm(email) {
    const list = this.getAll();
    const sub  = list.find(s => s.email === email);
    if (!sub) return false;
    sub.status      = 'confirmed';
    sub.confirmedAt = Date.now();
    this.save(list);
    return true;
  },
  remove(email) {
    this.save(this.getAll().filter(s => s.email !== email));
  },
  isSubscribed(email) {
    return this.getAll().some(s => s.email === email.toLowerCase().trim());
  },
};

/* ═══ RATE-LIMITING ═════════════════════════════════════════════════════ */
function checkRateLimit() {
  try {
    const data  = JSON.parse(localStorage.getItem(NL_CONFIG.rateLimitKey) || '{"count":0,"since":0}');
    const now   = Date.now();
    const reset = now - data.since > 3600000; // 1 Stunde reset
    if (reset) {
      localStorage.setItem(NL_CONFIG.rateLimitKey, JSON.stringify({ count: 1, since: now }));
      return true;
    }
    if (data.count >= NL_CONFIG.maxPerHour) return false;
    data.count++;
    localStorage.setItem(NL_CONFIG.rateLimitKey, JSON.stringify(data));
    return true;
  } catch { return true; }
}

/* ═══ HAUPT-SUBSCRIBE-FUNKTION ══════════════════════════════════════════ */
function nlSubscribe(formId) {
  const form      = document.getElementById(formId);
  if (!form) return;

  const emailInput  = form.querySelector('[data-nl-email]');
  const honeypot    = form.querySelector('[data-nl-honey]');
  const statusEl    = form.querySelector('[data-nl-status]');
  const submitBtn   = form.querySelector('[data-nl-submit]');

  const email = emailInput?.value?.trim() || '';

  /* ── Honeypot: Bot-Erkennung ── */
  if (honeypot?.value) return;

  /* ── Rate-Limiting ── */
  if (!checkRateLimit()) {
    showStatus(statusEl, 'error',
      I18n ? I18n.t('nl.error.rate') || 'Zu viele Versuche. Bitte warten.' : 'Zu viele Versuche.');
    return;
  }

  /* ── E-Mail-Validierung ── */
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    showStatus(statusEl, 'error',
      I18n ? I18n.t('nl.error.email') || 'Bitte eine gültige E-Mail eingeben.' : 'Ungültige E-Mail.');
    emailInput?.focus();
    return;
  }

  /* ── Bereits angemeldet ── */
  if (NewsletterDB.isSubscribed(email)) {
    showStatus(statusEl, 'info',
      I18n ? I18n.t('nl.error.exists') || 'Diese E-Mail ist bereits angemeldet.' : 'Bereits angemeldet.');
    return;
  }

  /* ── Speichern ── */
  const lang   = window.I18n ? I18n.getLang() : 'de';
  const result = NewsletterDB.add(email, lang);

  if (result.ok) {
    /* In Produktion: API-Call an Mailchimp/Brevo/eigenes Backend */
    // await fetch('/api/newsletter/subscribe', {
    //   method: 'POST',
    //   body: JSON.stringify({ email, lang }),
    //   headers: { 'Content-Type': 'application/json' }
    // });

    emailInput.value = '';
    if (submitBtn) submitBtn.disabled = true;
    showStatus(statusEl, 'success',
      I18n ? I18n.t('nl.success') : 'Danke! Bitte bestätige deine E-Mail.');

    /* Demo: Auto-Bestätigung nach 2 Sek. (simuliert Double-Opt-In) */
    setTimeout(() => NewsletterDB.confirm(email), 2000);
  }
}

/* ── Hilfsfunktion: Status-Meldung ── */
function showStatus(el, type, msg) {
  if (!el) return;
  el.textContent  = msg;
  el.className    = `nl-status nl-status--${type}`;
  el.style.display = 'block';
  if (type === 'success') {
    setTimeout(() => { el.style.display = 'none'; }, 6000);
  }
}

/* ═══ WIDGET RENDERN ════════════════════════════════════════════════════ */
function renderNewsletterWidgets() {
  document.querySelectorAll('.newsletter-widget').forEach((container, idx) => {
    const variant = container.dataset.variant || 'inline';
    const id      = `nl-form-${idx}`;
    const lang    = window.I18n ? I18n.getLang() : 'de';
    const t       = (k, fb) => window.I18n ? I18n.t(k) || fb : fb;

    if (variant === 'banner') {
      container.innerHTML = `
        <div class="nl-banner">
          <div class="nl-banner__content">
            <div class="nl-banner__icon">✉</div>
            <div>
              <div class="nl-banner__title" data-i18n="nl.title">${t('nl.title','Newsletter')}</div>
              <div class="nl-banner__sub" data-i18n="nl.subtitle">${t('nl.subtitle','Bleiben Sie informiert.')}</div>
            </div>
          </div>
          <form id="${id}" class="nl-form nl-form--compact" onsubmit="event.preventDefault();nlSubscribe('${id}')">
            <input data-nl-honey name="website" type="text" style="display:none" tabindex="-1" />
            <input data-nl-email type="email" class="nl-input"
              placeholder="${t('nl.placeholder','E-Mail-Adresse')}"
              data-i18n-ph="nl.placeholder" maxlength="120" required />
            <button data-nl-submit type="submit" class="nl-btn">
              <span data-i18n="nl.btn">${t('nl.btn','Anmelden')}</span>
            </button>
          </form>
          <div data-nl-status class="nl-status" style="display:none"></div>
        </div>`;
    } else {
      /* inline / footer variant */
      container.innerHTML = `
        <div class="nl-inline">
          <h3 class="nl-inline__title" data-i18n="nl.title">${t('nl.title','Newsletter')}</h3>
          <p class="nl-inline__sub" data-i18n="nl.subtitle">${t('nl.subtitle','Bleiben Sie informiert.')}</p>
          <form id="${id}" class="nl-form" onsubmit="event.preventDefault();nlSubscribe('${id}')">
            <input data-nl-honey name="website" type="text" style="display:none" tabindex="-1" />
            <div class="nl-input-row">
              <input data-nl-email type="email" class="nl-input"
                placeholder="${t('nl.placeholder','Ihre E-Mail-Adresse')}"
                data-i18n-ph="nl.placeholder" maxlength="120" required />
              <button data-nl-submit type="submit" class="nl-btn">
                <span data-i18n="nl.btn">${t('nl.btn','Anmelden')}</span>
              </button>
            </div>
          </form>
          <div data-nl-status class="nl-status" style="display:none"></div>
          <p class="nl-privacy" data-i18n="nl.privacy">${t('nl.privacy','Kein Spam. Jederzeit abmeldbar.')}</p>
        </div>`;
    }
  });
  injectNewsletterStyles();
}

/* ═══ ABMELDEN (Unsubscribe-Link) ═══════════════════════════════════════ */
function nlUnsubscribe() {
  const params = new URLSearchParams(window.location.search);
  const email  = params.get('email');
  if (!email) return;
  const container = document.getElementById('unsubscribe-result');
  if (!container) return;
  if (NewsletterDB.isSubscribed(email)) {
    NewsletterDB.remove(email);
    container.innerHTML = `
      <div class="nl-status nl-status--success" style="display:block;margin-top:20px">
        ✓ ${window.escHtml ? escHtml(email) : email} wurde erfolgreich abgemeldet.
      </div>`;
  } else {
    container.innerHTML = `
      <div class="nl-status nl-status--info" style="display:block;margin-top:20px">
        Diese E-Mail ist nicht in unserer Liste.
      </div>`;
  }
}

/* ═══ ADMIN: ABONNENTEN-TABELLE ════════════════════════════════════════ */
function renderSubscriberAdmin(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const subs = NewsletterDB.getAll();
  if (!subs.length) {
    container.innerHTML = '<p style="color:var(--muted);font-size:14px">Noch keine Abonnenten.</p>';
    return;
  }
  container.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:14px">
      <span style="font-size:14px;color:var(--text-dim)">${subs.length} Abonnent${subs.length !== 1 ? 'en' : ''} gesamt
        · ${subs.filter(s=>s.status==='confirmed').length} bestätigt</span>
      <button onclick="nlExportCSV()" class="btn btn-ghost btn-sm" style="font-size:12px">⬇ CSV Export</button>
    </div>
    <table class="admin-table">
      <thead><tr>
        <th>E-Mail</th><th>Sprache</th><th>Status</th><th>Angemeldet</th><th>Aktion</th>
      </tr></thead>
      <tbody>
        ${subs.map(s => `
          <tr>
            <td style="color:var(--bright)">${window.escHtml ? escHtml(s.email) : s.email}</td>
            <td style="font-family:var(--font-mono,monospace);font-size:12px">${s.lang?.toUpperCase() || 'DE'}</td>
            <td><span style="font-size:11px;color:${s.status==='confirmed'?'var(--green)':'var(--amber,#f5a623)'}">
              ${s.status === 'confirmed' ? '✓ Bestätigt' : '⏳ Ausstehend'}
            </span></td>
            <td style="font-family:var(--font-mono,monospace);font-size:12px;color:var(--muted)">
              ${new Date(s.subscribedAt).toLocaleDateString('de-DE')}
            </td>
            <td><button onclick="nlAdminDelete('${s.email}')" class="btn btn-danger btn-sm" style="padding:3px 8px;font-size:11px">✕</button></td>
          </tr>`).join('')}
      </tbody>
    </table>`;
}

function nlAdminDelete(email) {
  if (!confirm(`${email} aus dem Newsletter entfernen?`)) return;
  NewsletterDB.remove(email);
  const container = document.getElementById('subscriber-admin');
  if (container) renderSubscriberAdmin('subscriber-admin');
  if (window.showToast) showToast('Abonnent entfernt', 'success');
}

function nlExportCSV() {
  const subs = NewsletterDB.getAll();
  const csv  = ['Email,Language,Status,SubscribedAt,ConfirmedAt',
    ...subs.map(s =>
      `${s.email},${s.lang||'de'},${s.status},${new Date(s.subscribedAt).toISOString()},${s.confirmedAt ? new Date(s.confirmedAt).toISOString() : ''}`
    )].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const a    = document.createElement('a');
  a.href     = URL.createObjectURL(blob);
  a.download = `newsletter-export-${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
}

/* ═══ STYLES (inline) ══════════════════════════════════════════════════ */
function injectNewsletterStyles() {
  if (document.getElementById('nl-styles')) return;
  const style = document.createElement('style');
  style.id = 'nl-styles';
  style.textContent = `
    /* Inline Widget */
    .nl-inline { }
    .nl-inline__title {
      font-family: var(--font-serif, Georgia, serif);
      font-size: 20px; color: var(--bright, #e8f0f8);
      margin-bottom: 6px;
    }
    .nl-inline__sub  { font-size: 14px; color: var(--text-dim, #8da4bc); margin-bottom: 16px; }

    .nl-form {}
    .nl-input-row { display: flex; gap: 8px; flex-wrap: wrap; }
    .nl-input {
      flex: 1; min-width: 220px;
      background: var(--card, #1a2233);
      border: 1px solid var(--border, #243047);
      border-radius: 8px; padding: 11px 16px;
      font-size: 15px; color: var(--text, #c8d8e8);
      outline: none; transition: border-color 0.2s;
      font-family: var(--font-sans, sans-serif);
    }
    .nl-input:focus { border-color: var(--gold, #c9a84c); box-shadow: 0 0 0 3px rgba(201,168,76,0.1); }
    .nl-input::placeholder { color: var(--muted, #4a607a); }
    .nl-btn {
      background: linear-gradient(135deg, var(--gold, #c9a84c), #b8943d);
      color: var(--bg, #0b0e14); border: none; border-radius: 8px;
      padding: 11px 22px; font-size: 14px; font-weight: 600;
      cursor: pointer; white-space: nowrap; transition: all 0.2s;
      font-family: var(--font-sans, sans-serif);
    }
    .nl-btn:hover   { filter: brightness(1.1); transform: translateY(-1px); }
    .nl-btn:disabled{ opacity: 0.5; cursor: not-allowed; transform: none; }
    .nl-privacy     { font-size: 12px; color: var(--muted, #4a607a); margin-top: 10px; }

    /* Status Messages */
    .nl-status {
      border-radius: 8px; padding: 12px 16px;
      font-size: 14px; margin-top: 12px;
    }
    .nl-status--success { background: rgba(34,197,94,0.1); border: 1px solid #22c55e; color: #86efac; }
    .nl-status--error   { background: rgba(239,68,68,0.1);  border: 1px solid #ef4444; color: #fca5a5; }
    .nl-status--info    { background: rgba(0,200,240,0.08); border: 1px solid #00c8f0; color: #a0dff0; }

    /* Banner Variant */
    .nl-banner {
      background: var(--card, #1a2233);
      border: 1px solid var(--border, #243047);
      border-radius: 12px; padding: 22px 26px;
      display: flex; align-items: center; gap: 24px; flex-wrap: wrap;
    }
    .nl-banner__content { display: flex; align-items: center; gap: 14px; flex: 1; min-width: 200px; }
    .nl-banner__icon    { font-size: 28px; }
    .nl-banner__title   { font-weight: 600; color: var(--bright, #e8f0f8); font-size: 16px; }
    .nl-banner__sub     { font-size: 13px; color: var(--text-dim, #8da4bc); margin-top: 2px; }
    .nl-form--compact   { display: flex; gap: 8px; }
    .nl-form--compact .nl-input { min-width: 200px; }
  `;
  document.head.appendChild(style);
}

/* ═══ AUTO-INIT ════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  renderNewsletterWidgets();
  nlUnsubscribe(); // prüft auf ?email= Parameter
});

/* Global */
window.nlSubscribe    = nlSubscribe;
window.nlAdminDelete  = nlAdminDelete;
window.nlExportCSV    = nlExportCSV;
window.NewsletterDB   = NewsletterDB;
window.renderSubscriberAdmin = renderSubscriberAdmin;
