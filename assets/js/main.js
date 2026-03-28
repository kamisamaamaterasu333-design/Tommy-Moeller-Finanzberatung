/**
 * main.js – Gemeinsame Logik für alle Seiten
 * Enthält: Auth-Helpers, Navigation, Sanitizer, Toast
 *
 * SICHERHEITSHINWEISE:
 * - Dieses System nutzt localStorage für Demo-Zwecke.
 * - In Produktion: Server-seitiges Session-Management verwenden!
 * - Passwörter NIEMALS im Klartext speichern.
 */

'use strict';

/* ═══ 1. AUTH-SYSTEM (Demo – in Produktion: Backend erforderlich) ══════ */

const Auth = (() => {

  // Demo-Nutzer (in Produktion: aus Backend laden, Passwörter gehasht in DB)
  // SHA-256 Hash von "admin123" – Platzhalter, echtes Hashing im Backend!
  const DEMO_USERS = [
    { id: 1, username: 'admin',   passwordHash: 'admin123', role: 'admin' },
    { id: 2, username: 'user1',   passwordHash: 'user123',  role: 'user'  },
  ];

  // Aktuell eingeloggten User aus localStorage lesen
  function getCurrentUser() {
    try {
      const stored = localStorage.getItem('current_user');
      return stored ? JSON.parse(stored) : null;
    } catch { return null; }
  }

  // Login-Funktion
  function login(username, password) {
    const user = DEMO_USERS.find(
      u => u.username === username && u.passwordHash === password
    );
    if (user) {
      // Session-Daten speichern (ohne Passwort!)
      const session = { id: user.id, username: user.username, role: user.role, loginTime: Date.now() };
      localStorage.setItem('current_user', JSON.stringify(session));
      return { success: true, user: session };
    }
    return { success: false, error: 'Ungültige Zugangsdaten.' };
  }

  // Logout
  function logout() {
    localStorage.removeItem('current_user');
    window.location.href = getRoot() + 'index.html';
  }

  // Rollen-Prüfung
  function isAdmin() {
    const u = getCurrentUser();
    return u && u.role === 'admin';
  }

  function isLoggedIn() {
    return getCurrentUser() !== null;
  }

  // Route-Guard: Seite nur für eingeloggte User
  function requireLogin() {
    if (!isLoggedIn()) {
      window.location.href = getRoot() + 'pages/login.html?redirect=' + encodeURIComponent(window.location.pathname);
    }
  }

  // Route-Guard: Seite nur für Admins
  function requireAdmin() {
    if (!isAdmin()) {
      showToast('Zugriff verweigert.', 'error');
      setTimeout(() => window.location.href = getRoot() + 'index.html', 1500);
    }
  }

  return { getCurrentUser, login, logout, isAdmin, isLoggedIn, requireLogin, requireAdmin };
})();

/* ═══ 2. SICHERHEITS-HELPER ══════════════════════════════════════════════ */

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

/* ═══ 3. NAVIGATION ══════════════════════════════════════════════════════ */

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

  // Auth-Status in Navbar anzeigen
  updateAuthNav();
}

function updateAuthNav() {
  const item = document.getElementById('auth-nav-item');
  if (!item) return;
  const user = Auth.getCurrentUser();
  if (user) {
    item.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px">
        ${Auth.isAdmin() ? '<a href="' + getRoot() + 'pages/admin.html" class="btn-nav">Admin</a>' : ''}
        <button onclick="Auth.logout()" style="background:none;border:1px solid var(--border);color:var(--text-dim);padding:6px 14px;border-radius:6px;cursor:pointer;font-size:13px">
          Logout (${escHtml(user.username)})
        </button>
      </div>`;
  }
}

/* ═══ 4. TOAST-BENACHRICHTIGUNG ══════════════════════════════════════════ */

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

/* ═══ 5. DATUM-FORMATTER ═════════════════════════════════════════════════ */

function formatDateTime(timestamp) {
  const d = new Date(timestamp);
  return d.toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
       + ' ' + d.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
}

function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('de-DE', { day: '2-digit', month: 'long', year: 'numeric' });
}

/* ═══ 6. ROOT-PFAD-HELPER ════════════════════════════════════════════════ */
// Gibt relativen Pfad zur Root zurück (nötig da Seiten in /pages/ liegen)
function getRoot() {
  return window.location.pathname.includes('/pages/') ? '../' : '';
}

/* ═══ 7. INIT ════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
});

// Auth global verfügbar machen (für onclick-Attribute im HTML)
window.Auth = Auth;
window.showToast = showToast;
window.escHtml = escHtml;
