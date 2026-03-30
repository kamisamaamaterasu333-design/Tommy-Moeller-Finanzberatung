/**
 * i18n.js – Mehrsprachigkeitssystem (DE / EN)
 * ─────────────────────────────────────────────
 * Verwendung:
 *   1. Datei in jede HTML-Seite einbinden (nach main.js):
 *      <script src="../assets/js/i18n.js"></script>
 *
 *   2. Übersetzbare Elemente mit data-i18n-Attribut markieren:
 *      <h1 data-i18n="hero.title">Wird ersetzt</h1>
 *
 *   3. Sprachumschalter ins HTML einfügen:
 *      <div id="lang-switcher"></div>
 *
 * Sprache wird in localStorage gespeichert und auf allen
 * Seiten automatisch angewendet.
 */

'use strict';

/* ═══ ÜBERSETZUNGEN ══════════════════════════════════════════════════════ */
const TRANSLATIONS = {

  de: {
    /* ── Navigation ── */
    'nav.home':        'Start',
    'nav.about':       'Über mich',
    'nav.services':    'Dienstleistungen',
    'nav.blog':        'Blog',
    'nav.contact':     'Kontakt',
    'nav.login':       'Login',
    'nav.admin':       'Admin',
    'nav.logout':      'Logout',

    /* ── Homepage Hero ── */
    'hero.eyebrow':    'Willkommen',
    'hero.title':      'Tommy Möller',
    'hero.subtitle':   'Planung & Steuerung · Controlling · Finanzanalyse',
    'hero.text':       'Referent Planung und Steuerung mit Expertise in Power BI, SAP ERP und der Automatisierung von Finanzprozessen.',
    'hero.cta1':       'Meine Leistungen',
    'hero.cta2':       'Kontakt aufnehmen',
    'hero.stat1.num':  '3+',
    'hero.stat1.lbl':  'Jahre Erfahrung',
    'hero.stat2.num':  'M.Sc.',
    'hero.stat2.lbl':  'FACT – Note 2,0',
    'hero.stat3.num':  'DB',
    'hero.stat3.lbl':  'BahnbauGruppe',

    /* ── Teaser ── */
    'teaser.tax.title':  'Planung & Steuerung',
    'teaser.tax.text':   'Monatliches Berichtswesen, P&L-Kommentierung und Budget-Forecasting für die Geschäftsführung.',
    'teaser.tax.link':   'Mehr erfahren →',
    'teaser.ctrl.title': 'Prozessautomatisierung',
    'teaser.ctrl.text':  'Automatisierung von Reporting-Prozessen mit Power Automate, SharePoint und Power BI.',
    'teaser.ctrl.link':  'Mehr erfahren →',
    'teaser.acc.title':  'IT-Controlling',
    'teaser.acc.text':   'Planung von IT-Projekten, kaufmännischer Ansprechpartner und monatliches Reporting zu IT-Kosten.',
    'teaser.acc.link':   'Mehr erfahren →',

    /* ── Über mich ── */
    'about.title':       'Über mich',
    'about.subtitle':    'Referent Planung & Steuerung · Controller · Finanzanalyst',
    'about.location':    'Erkner / Berlin',
    'about.experience':  '3+ Jahre Berufserfahrung',
    'about.languages':   'Deutsch (C2) · Englisch (C1) · Japanisch (A2)',
    'about.p1':          'Engagierter Referent Planung und Steuerung mit über 3 Jahren Erfahrung in der budgettechnischen Planung und im IT-Controlling.',
    'about.p2':          'Starke analytische Fähigkeiten und fundiertes Wissen im Controlling ermöglichen es, zur Optimierung der Geschäftsprozesse maßgeblich beizutragen.',
    'about.career':      'Werdegang',
    'about.dl.title':    'Dokumente & Downloads',
    'about.dl.subtitle.guest':  'Bitte melde dich an, um Dokumente herunterzuladen.',
    'about.dl.subtitle.admin':  'Admin: Vollzugriff auf alle Dokumente.',
    'about.dl.subtitle.user':   'Du kannst freigegebene Dokumente herunterladen.',
    'about.dl.download':        '⬇ Herunterladen',
    'about.dl.locked':          '🔒 Login erforderlich',
    'about.upload.title':       'Dokument hochladen',
    'about.upload.hint':        'Datei hierher ziehen oder klicken',

    /* ── Dienstleistungen ── */
    'srv.title':         'Meine Dienstleistungen',
    'srv.subtitle':      'Maßgeschneiderte Lösungen für Ihre finanzielle und persönliche Situation',
    'srv.ctrl.title':    'Controlling & Finanzanalyse',
    'srv.cta.text':      'Jede Situation ist einzigartig. Lassen Sie uns in einem unverbindlichen Erstgespräch sprechen.',
    'srv.cta.btn':       'Kostenloses Erstgespräch →',

    /* ── Blog ── */
    'blog.title':        'Blog',
    'blog.subtitle':     'Steuertipps, Finanzwissen und Controlling-Praxis',
    'blog.readmore':     'Weiterlesen →',
    'blog.back':         '← Zurück zum Blog',
    'blog.comment.title':'Kommentar hinterlassen',
    'blog.comment.name': 'Name',
    'blog.comment.text': 'Kommentar',
    'blog.comment.send': 'Kommentar absenden',
    'blog.comment.ph.name': 'Dein Name',
    'blog.comment.ph.text': 'Dein Kommentar...',
    'blog.comments':     'Kommentare',
    'blog.new':          '+ Neuer Beitrag',

    /* ── Kontakt ── */
    'contact.title':     'Kontakt aufnehmen',
    'contact.subtitle':  'Ich freue mich auf Ihre Anfrage und melde mich innerhalb von 24 Stunden.',
    'contact.direct':    'Direktkontakt',
    'contact.form':      'Kontaktformular',
    'contact.gdpr':      'Ihre Daten werden verschlüsselt übertragen. (DSGVO-konform)',
    'contact.loc.label': 'ADRESSE',
    'contact.tel.label': 'TELEFON',
    'contact.mail.label':'E-MAIL',
    'contact.hours.label':'ERREICHBARKEIT',
    'contact.hours.val': 'Mo–Fr: 9:00–18:00 Uhr',

    /* ── Login ── */
    'login.title':       'Anmelden',
    'login.sub':         'Zugang für registrierte Nutzer und Administratoren',
    'login.user':        'Benutzername',
    'login.pass':        'Passwort',
    'login.btn':         'Anmelden',
    'login.back':        '← Zurück zur Website',

    /* ── Newsletter ── */
    'nl.title':          'Newsletter',
    'nl.subtitle':       'Bleiben Sie informiert – Steuertipps und Finanzwissen direkt ins Postfach.',
    'nl.placeholder':    'Ihre E-Mail-Adresse',
    'nl.btn':            'Jetzt anmelden',
    'nl.success':        'Danke! Sie erhalten eine Bestätigungs-E-Mail.',
    'nl.privacy':        'Kein Spam. Jederzeit abmeldbar. Datenschutz beachten.',

    /* ── Footer ── */
    'footer.nav':        'Navigation',
    'footer.legal':      'Rechtliches',
    'footer.contact':    'Kontakt',
    'footer.imprint':    'Impressum',
    'footer.privacy':    'Datenschutz',
    'footer.copy':       '© {2026} Tommy Möller. Alle Rechte vorbehalten.',

    /* ── Impressum / Datenschutz ── */
    'imprint.title':     'Impressum',
    'privacy.title':     'Datenschutzerklärung',

    /* ── Allgemein ── */
    'btn.more':          'Mehr erfahren',
    'btn.back':          '← Zurück',
    'breadcrumb.home':   'Start',
  },

  en: {
    /* ── Navigation ── */
    'nav.home':        'Home',
    'nav.about':       'About',
    'nav.services':    'Services',
    'nav.blog':        'Blog',
    'nav.contact':     'Contact',
    'nav.login':       'Login',
    'nav.admin':       'Admin',
    'nav.logout':      'Logout',

    /* ── Homepage Hero ── */
    'hero.eyebrow':    'Welcome',
    'hero.title':      'Max Mustermann',
    'hero.subtitle':   'Tax Advisor · Controller · Finance Strategist',
    'hero.text':       'I help businesses and individuals understand, optimise and strategically manage their financial situation for long-term success.',
    'hero.cta1':       'My Services',
    'hero.cta2':       'Get in Touch',
    'hero.stat1.num':  '10+',
    'hero.stat1.lbl':  'Years Experience',
    'hero.stat2.num':  '200+',
    'hero.stat2.lbl':  'Satisfied Clients',
    'hero.stat3.num':  '98%',
    'hero.stat3.lbl':  'Success Rate',

    /* ── Teaser ── */
    'teaser.tax.title':  'Tax Advisory',
    'teaser.tax.text':   'Individual tax optimisation for private individuals, freelancers and businesses.',
    'teaser.tax.link':   'Learn more →',
    'teaser.ctrl.title': 'Controlling',
    'teaser.ctrl.text':  'KPI analysis, budget planning and financial reporting for well-informed decisions.',
    'teaser.ctrl.link':  'Learn more →',
    'teaser.acc.title':  'Annual Accounts',
    'teaser.acc.text':   'Professional preparation of annual financial statements under HGB and IFRS.',
    'teaser.acc.link':   'Learn more →',

    /* ── About ── */
    'about.title':       'About Me',
    'about.subtitle':    'controller and finance strategist by passion',
    'about.location':    'Berlin, Germany',
    'about.experience':  '3+ Years',
    'about.languages':   'German, English, Japanese',
    'about.p1':          '[Placeholder: Replace this with your personal introduction.]',
    'about.p2':          '[Placeholder: Second paragraph – your advisory approach and values.]',
    'about.career':      'Career',
    'about.dl.title':    'Documents & Downloads',
    'about.dl.subtitle.guest':  'Please log in to download documents.',
    'about.dl.subtitle.admin':  'Admin: Full access to all documents.',
    'about.dl.subtitle.user':   'You can download approved documents.',
    'about.dl.download':        '⬇ Download',
    'about.dl.locked':          '🔒 Login required',
    'about.upload.title':       'Upload document',
    'about.upload.hint':        'Drag file here or click to select',

    /* ── Services ── */
    'srv.title':         'My Services',
    'srv.subtitle':      'Tailored solutions for your financial and personal situation',
    'srv.ctrl.title':    'Controlling & Financial Analysis',
    'srv.cta.text':      'Every situation is unique. Let\'s talk in a free initial consultation.',
    'srv.cta.btn':       'Free Consultation →',

    /* ── Blog ── */
    'blog.title':        'Blog',
    'blog.subtitle':     'financial knowledge and controlling in practice',
    'blog.readmore':     'Read more →',
    'blog.back':         '← Back to Blog',
    'blog.comment.title':'Leave a Comment',
    'blog.comment.name': 'Name',
    'blog.comment.text': 'Comment',
    'blog.comment.send': 'Submit Comment',
    'blog.comment.ph.name': 'Your name',
    'blog.comment.ph.text': 'Your comment...',
    'blog.comments':     'Comments',
    'blog.new':          '+ New Post',

    /* ── Contact ── */
    'contact.title':     'Get in Touch',
    'contact.subtitle':  'I look forward to your enquiry and will respond within 24 hours.',
    'contact.direct':    'Direct Contact',
    'contact.form':      'Contact Form',
    'contact.gdpr':      'Your data is transmitted encrypted. (GDPR compliant)',
    'contact.loc.label': 'ADDRESS',
    'contact.tel.label': 'PHONE',
    'contact.mail.label':'EMAIL',
    'contact.hours.label':'AVAILABILITY',
    'contact.hours.val': 'Mon–Fri: 9:00 AM – 6:00 PM',

    /* ── Login ── */
    'login.title':       'Sign In',
    'login.sub':         'Access for registered users and administrators',
    'login.user':        'Username',
    'login.pass':        'Password',
    'login.btn':         'Sign In',
    'login.back':        '← Back to Website',

    /* ── Newsletter ── */
    'nl.title':          'Newsletter',
    'nl.subtitle':       'Stay informed – tax tips and financial insights delivered to your inbox.',
    'nl.placeholder':    'Your email address',
    'nl.btn':            'Subscribe',
    'nl.success':        'Thank you! You will receive a confirmation email.',
    'nl.privacy':        'No spam. Unsubscribe anytime. Privacy policy applies.',

    /* ── Footer ── */
    'footer.nav':        'Navigation',
    'footer.legal':      'Legal',
    'footer.contact':    'Contact',
    'footer.imprint':    'Imprint',
    'footer.privacy':    'Privacy Policy',
    'footer.copy':       '© {2026} Tommy Möller. All rights reserved.',

    /* ── Imprint / Privacy ── */
    'imprint.title':     'Legal Notice',
    'privacy.title':     'Privacy Policy',

    /* ── General ── */
    'btn.more':          'Learn more',
    'btn.back':          '← Back',
    'breadcrumb.home':   'Home',
  }
};

/* ═══ I18N ENGINE ═══════════════════════════════════════════════════════ */
const I18n = (() => {

  const STORAGE_KEY = 'preferred_lang';
  const SUPPORTED   = ['de', 'en'];
  let   currentLang = 'de';

  /* Gespeicherte oder Browser-Sprache laden */
  function init() {
    const stored   = localStorage.getItem(STORAGE_KEY);
    const browser  = navigator.language?.slice(0, 2).toLowerCase();
    currentLang    = SUPPORTED.includes(stored)  ? stored
                   : SUPPORTED.includes(browser) ? browser
                   : 'de';
    applyLang(currentLang);
  }

  /* Sprache wechseln (von Schalter aufgerufen) */
  function setLang(lang) {
    if (!SUPPORTED.includes(lang)) return;
    currentLang = lang;
    localStorage.setItem(STORAGE_KEY, lang);
    applyLang(lang);
    renderSwitcher();
  }

  /* Alle data-i18n Elemente übersetzen */
  function applyLang(lang) {
    const dict = TRANSLATIONS[lang] || TRANSLATIONS['de'];

    /* Text-Übersetzungen */
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.dataset.i18n;
      if (dict[key] !== undefined) {
        el.textContent = dict[key].replace('{year}', new Date().getFullYear());
      }
    });

    /* Placeholder-Übersetzungen */
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.dataset.i18nPh;
      if (dict[key] !== undefined) el.placeholder = dict[key];
    });

    /* HTML lang-Attribut aktualisieren */
    document.documentElement.lang = lang;

    /* Meta-Description aktualisieren */
    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      meta.content = lang === 'en'
        ? 'Tommy Möller – Controller and Finance-Consultant'
        : 'Tommy – Controller und Finanzberater';
    }
  }

  /* Übersetzen-Funktion für JS (dynamisch erzeugte Inhalte) */
  function t(key, replacements = {}) {
    const dict = TRANSLATIONS[currentLang] || TRANSLATIONS['de'];
    let   text = dict[key] || TRANSLATIONS['de'][key] || key;
    Object.entries(replacements).forEach(([k, v]) => {
      text = text.replace(`{${k}}`, v);
    });
    return text;
  }

  function getLang()    { return currentLang; }
  function isDE()       { return currentLang === 'de'; }

  /* Sprachumschalter rendern */
  function renderSwitcher() {
    document.querySelectorAll('.lang-switcher').forEach(el => {
      el.innerHTML = SUPPORTED.map(lang => `
        <button
          onclick="I18n.setLang('${lang}')"
          class="lang-btn ${lang === currentLang ? 'active' : ''}"
          title="${lang === 'de' ? 'Deutsch' : 'English'}"
          aria-pressed="${lang === currentLang}"
        >${lang.toUpperCase()}</button>
      `).join('<span class="lang-sep">|</span>');
    });
  }

  return { init, setLang, t, getLang, isDE, renderSwitcher, applyLang };
})();

/* ═══ SWITCHER CSS (inline injiziert) ══════════════════════════════════ */
(function injectSwitcherStyles() {
  const css = `
    .lang-switcher {
      display: inline-flex;
      align-items: center;
      gap: 4px;
      background: var(--panel, #141920);
      border: 1px solid var(--border, #243047);
      border-radius: 20px;
      padding: 3px 10px;
    }
    .lang-btn {
      background: none;
      border: none;
      color: var(--text-dim, #8da4bc);
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
      padding: 2px 4px;
      border-radius: 4px;
      font-family: var(--font-mono, monospace);
      letter-spacing: 0.5px;
      transition: color 0.15s;
    }
    .lang-btn.active {
      color: var(--gold, #c9a84c);
    }
    .lang-btn:hover:not(.active) {
      color: var(--bright, #e8f0f8);
    }
    .lang-sep {
      color: var(--border, #243047);
      font-size: 11px;
    }
  `;
  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);
})();

/* ═══ AUTO-INIT ════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  I18n.init();
  I18n.renderSwitcher();
});

/* Global verfügbar machen */
window.I18n = I18n;
