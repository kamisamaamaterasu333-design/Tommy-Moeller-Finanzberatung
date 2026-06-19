/**
 * main.js – Gemeinsame Logik für alle Seiten
 * Enthält: Auth-Helpers (Supabase), Navigation, Sanitizer, Toast
 *
 * AUTH:
 * - Login/Logout/Sessions laufen vollständig über Supabase Auth.
 * - Supabase persistiert die Session selbst im localStorage und
 *   refresht das Token automatisch im Hintergrund. Dadurch bleibt
 *   man über Seitenwechsel und Browser-Neustarts hinweg eingeloggt,
 *   bis man sich aktiv ausloggt.
 * - Admin-Rolle wird aus user_metadata.role gelesen (Supabase Auth
 *   "User Metadata"). Ist sie nicht gesetzt, gilt der Nutzer als
 *   normaler User (kein Fehler).
 */

'use strict';

/* ═══ 1. SUPABASE CLIENT (einmalig, global) ═══════════════════════════ */

const SUPABASE_URL = 'https://kalonkzgzbpsndkuznqp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImthbG9ua3pnemJwc25ka3V6bnFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0NjkxMjQsImV4cCI6MjA5MTA0NTEyNH0.FChiR30MGNLUv3L2hSi-d-hNTg8pVLoMNN5XgWrX1ZQ';

// supabase-js muss VOR main.js eingebunden sein:
// <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
const sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    persistSession: true,    // Session in localStorage merken
    autoRefreshToken: true,  // Token im Hintergrund erneuern
    detectSessionInUrl: true
  }
});

/* ═══ 2. AUTH-SYSTEM (Supabase-basiert) ════════════════════════════════ */

const Auth = (() => {

  let cachedUser = null; // letzter bekannter Supabase-User (synchron abrufbar)

  // Supabase informiert uns bei jeder Änderung (Login, Logout, Token-Refresh)
  sb.auth.onAuthStateChange((_event, session) => {
    cachedUser = session?.user || null;
    updateAuthNav();
  });

  // Aktuell eingeloggten User holen (asynchron, verlässlich)
  async function getCurrentUser() {
    const { data: { session } } = await sb.auth.getSession();
    cachedUser = session?.user || null;
    return cachedUser;
  }

  // Synchroner Zugriff auf den zuletzt bekannten User (z.B. für UI-Updates
  // ohne await). Direkt nach dem Laden der Seite kann das noch null sein,
  // bis getCurrentUser()/onAuthStateChange einmal gelaufen ist.
  function getCachedUser() {
    return cachedUser;
  }

  // Login
  async function login(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    cachedUser = data.user;
    return { success: true, user: data.user };
  }

  // Logout – nur dies meldet wirklich ab, niemals ein Seitenwechsel
  async function logout() {
    await sb.auth.signOut();
    cachedUser = null;
    window.location.href = getRoot() + 'index.html';
  }

  // Rollen-Prüfung (liest user_metadata.role, Standard: kein Admin)
  function isAdmin() {
    return cachedUser?.user_metadata?.role === 'admin';
  }

  function isLoggedIn() {
    return cachedUser !== null;
  }

  // Route-Guard: Seite nur für eingeloggte User.
  // WICHTIG: async, da Supabase die Session erst aus dem Storage laden muss.
  // Erst NACH diesem Check entscheiden, ob umgeleitet wird – so wird
  // niemand fälschlich rausgeworfen, nur weil die Session noch lädt.
  async function requireLogin() {
    const user = await getCurrentUser();
    if (!user) {
      window.location.href = getRoot() + 'pages/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    }
    return user;
  }

  // Route-Guard: Seite nur für Admins
  async function requireAdmin() {
    const user = await getCurrentUser();
    if (!user) {
      window.location.href = getRoot() + 'pages/login.html?redirect=' + encodeURIComponent(window.location.pathname);
      return null;
    }
    if (!isAdmin()) {
      showToast('Zugriff verweigert.', 'error');
      setTimeout(() => window.location.href = getRoot() + 'index.html', 1500);
      return null;
    }
    return user;
  }

  return { getCurrentUser, getCachedUser, login, logout, isAdmin, isLoggedIn, requireLogin, requireAdmin };
})();

/* ═══ 3. SICHERHEITS-HELPER ══════════════════════════════════════════════ */

/**
 * XSS-Schutz: HTML-Sonderzeichen escapen
 * IMMER verwenden wenn User-Input ins DOM eingefügt wird!
 */
function escHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

/**
 * Input-Validierung
 */
const Validator = {
  // Maximale Länge prüfen
  maxLength(value, max) { return value.length <= max; },
  // E-Mail-Format prüfen
  isEmail(value) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); },
  // Leeren String prüfen
  notEmpty(value) { return value.trim().length > 0; },
  // Alphanumerisch + Leerzeichen (für Namen)
  safeName(value) { return /^[\w\s\-äöüÄÖÜß]{1,80}$/.test(value); },
};

/* ═══ 4. NAVIGATION ══════════════════════════════════════════════════════ */

function initNavbar() {
  // Scrolled-Klasse für Schatten-Effekt
  window.addEventListener('scroll', () => {
    document.getElementById('navbar')?.classList.toggle('scrolled', window.scrollY > 20);
  });

  // Hamburger-Menü (Mobile)
  const toggle = document.getElementById('nav-toggle');
  const links  = document.getElementById('nav-links');
  if (toggle && links) {
    toggle.addEventListener('click', () => {
      links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', links.classList.contains('open'));
    });
    // Schließen bei Klick auf Link
    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => links.classList.remove('open'));
    });
  }

  // Auth-Status in Navbar anzeigen (sobald Session geladen ist)
  updateAuthNav();
}

async function updateAuthNav() {
  const item = document.getElementById('auth-nav-item');
  if (!item) return;
  const user = await Auth.getCurrentUser();
  if (user) {
    const displayName = user.email || user.user_metadata?.username || 'Nutzer';
    item.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px">
        ${Auth.isAdmin() ? '<a href="' + getRoot() + 'pages/admin.html" class="btn-nav">Admin</a>' : ''}
        <button onclick="Auth.logout()" style="background:none;border:1px solid var(--border);color:var(--text-dim);padding:6px 14px;border-radius:6px;cursor:pointer;font-size:13px">
          Logout (${escHtml(displayName)})
        </button>
      </div>`;
  } else {
    item.innerHTML = '';
  }
}

/* ═══ 5. TOAST-BENACHRICHTIGUNG ══════════════════════════════════════════ */

let toastTimer;
function showToast(message, type = '') {
  let toast = document.getElementById('global-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'global-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  const icons = { success: '✓', error: '✗', info: 'ℹ' };
  toast.innerHTML = `<span>${icons[type] || 'ℹ'}</span> ${escHtml(message)}`;
  toast.className = `toast show ${type}`;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3500);
}

/* ═══ 6. DATUM-FORMATTER ═════════════════════════════════════════════════ */

function formatDateTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
       + ' ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
}

/* ═══ 7. ROOT-PFAD-HELPER ════════════════════════════════════════════════ */
// Gibt relativen Pfad zur Root zurück (nötig da Seiten in /pages/ liegen)
function getRoot() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

/* ═══ 8. INIT ════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
});

// Global verfügbar machen (für onclick-Attribute im HTML und andere Skripte)
window.Auth = Auth;
window.sb = sb;
window.showToast = showToast;
window.escHtml = escHtml;
