// =============================================================
// app.js — Shared dashboard chrome: sidebar, topbar, toasts,
// modals, loading & empty states. Loaded on every protected page.
// =============================================================

// ---- Sidebar HTML (injected into every page) ----
function getSidebarHTML(activePage) {
  const items = [
    { key: 'index',        href: 'index.html',        icon: '▣', label: 'Dashboard' },
    { key: 'rooms',        href: 'rooms.html',        icon: '🚪', label: 'Rooms' },
    { key: 'guests',       href: 'guests.html',       icon: '👤', label: 'Guests' },
    { key: 'bookings',     href: 'bookings.html',     icon: '📅', label: 'Bookings' },
    { key: 'booking',      href: 'booking.html',      icon: '✚', label: 'New Booking' },
    { key: 'availability', href: 'availability.html', icon: '🔍', label: 'Availability' },
    { key: 'report',       href: 'report.html',       icon: '📊', label: 'Occupancy Report' },
  ]
  const navItems = items.map(it =>
    `<li><a href="${it.href}" class="${it.key === activePage ? 'active' : ''}">
      <span class="nav-icon">${it.icon}</span><span>${it.label}</span>
    </a></li>`
  ).join('')

  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-brand">
        <div class="logo-mark">🏨</div>
        <div>
          <div class="brand-name">BookMyRoom</div>
          <div class="brand-sub">Guest House System</div>
        </div>
      </div>
      <div class="sidebar-section-label">Main Menu</div>
      <ul class="sidebar-nav">${navItems}</ul>
      <div class="sidebar-footer">
        <button class="sidebar-logout" onclick="logoutUser()">
          <span class="nav-icon">⏻</span> Logout
        </button>
      </div>
    </aside>
    <div class="sidebar-mask" id="sidebarMask" onclick="toggleSidebar()"></div>
  `
}

// ---- Topbar HTML ----
function getTopbarHTML(title, subtitle) {
  const user = getCurrentUser() || { name: 'User' }
  const initials = (user.name || 'U').split(' ').map(s => s[0]).join('').slice(0, 2).toUpperCase()
  return `
    <header class="topbar">
      <div class="topbar-left">
        <button class="hamburger" onclick="toggleSidebar()" aria-label="Menu">☰</button>
        <div>
          <div class="topbar-title">${title}</div>
          <div class="topbar-welcome">${subtitle || ''}</div>
        </div>
      </div>
      <div class="topbar-user">
        <div class="avatar">${initials}</div>
        <div>
          <div class="user-name">${escapeHtml(user.name)}</div>
          <div class="user-role">Administrator</div>
        </div>
      </div>
    </header>
  `
}

// ---- Mount layout chrome into the page ----
function mountLayout(activePage, pageTitle, subtitle) {
  const root = document.getElementById('app')
  if (!root) return
  const existing = root.innerHTML
  root.innerHTML = `
    <div class="app">
      ${getSidebarHTML(activePage)}
      <div class="main">
        ${getTopbarHTML(pageTitle, subtitle)}
        <main class="content">${existing}</main>
      </div>
    </div>
  `
}

// ---- Mobile sidebar toggle ----
function toggleSidebar() {
  document.getElementById('sidebar')?.classList.toggle('open')
}
window.toggleSidebar = toggleSidebar

// ---- Toast notifications ----
const TOAST_ICONS = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' }
const TOAST_TITLES = { success: 'Success', error: 'Error', info: 'Information', warning: 'Warning' }

function showToast(message, type = 'info', timeout = 4200) {
  ensureToastContainer()
  const container = document.getElementById('toastContainer')
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.innerHTML = `
    <span class="toast-icon">${TOAST_ICONS[type] || 'ℹ'}</span>
    <div class="toast-body">
      <div class="toast-title">${TOAST_TITLES[type] || 'Information'}</div>
      <div class="toast-msg">${escapeHtml(message)}</div>
    </div>
    <button class="toast-close" aria-label="Close">✕</button>
  `
  const remove = () => {
    toast.classList.add('removing')
    setTimeout(() => toast.remove(), 300)
  }
  toast.querySelector('.toast-close').addEventListener('click', remove)
  container.appendChild(toast)
  if (timeout) setTimeout(remove, timeout)
}
function showToastSuccess(msg, t) { showToast(msg, 'success', t) }
function showToastError(msg, t)   { showToast(msg, 'error', t || 6000) }

function ensureToastContainer() {
  let c = document.getElementById('toastContainer')
  if (!c) {
    c = document.createElement('div')
    c.id = 'toastContainer'
    c.className = 'toast-container'
    document.body.appendChild(c)
  }
}
window.showToast = showToast
window.showToastSuccess = showToastSuccess
window.showToastError = showToastError

// ---- Modal helpers ----
function openModal(id) {
  document.getElementById(id)?.classList.add('active')
  document.body.style.overflow = 'hidden'
}
function closeModal(id) {
  document.getElementById(id)?.classList.remove('active')
  document.body.style.overflow = ''
}
window.openModal = openModal
window.closeModal = closeModal
// Close modal when clicking the overlay
document.addEventListener('click', (e) => {
  if (e.target.classList?.contains('modal-overlay')) {
    e.target.classList.remove('active')
    document.body.style.overflow = ''
  }
})
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.active').forEach(m => {
      m.classList.remove('active')
      document.body.style.overflow = ''
    })
  }
})

// ---- Loading & empty & error state helpers (rendered into containers) ----
function loadingState(msg) {
  return `<div class="state-box loading">
    <div class="spinner" style="border-color:rgba(10,31,61,.15);border-top-color:var(--blue-500)"></div>
    <div class="loader-text">${escapeHtml(msg)}</div>
  </div>`
}
function emptyState(msg, icon = '📭') {
  return `<div class="state-box">
    <div class="state-icon">${icon}</div>
    <div class="state-title">Nothing here yet</div>
    <div class="state-msg">${escapeHtml(msg)}</div>
  </div>`
}
function errorState(msg) {
  return `<div class="state-box">
    <div class="state-icon" style="color:var(--danger);opacity:.7">⚠</div>
    <div class="state-title">Something went wrong</div>
    <div class="state-msg">${escapeHtml(msg)}</div>
  </div>`
}
window.loadingState = loadingState
window.emptyState = emptyState
window.errorState = errorState

// ---- Utility: escape HTML to prevent XSS when injecting dynamic text ----
function escapeHtml(str) {
  if (str == null) return ''
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
window.escapeHtml = escapeHtml

// ---- Status badge helper for bookings ----
function statusBadge(status) {
  const s = (status || '').toUpperCase()
  if (s === 'CONFIRMED') return '<span class="badge badge-success">Confirmed</span>'
  if (s === 'CANCELLED') return '<span class="badge badge-danger">Cancelled</span>'
  if (s === 'PENDING')   return '<span class="badge badge-warning">Pending</span>'
  return `<span class="badge badge-neutral">${escapeHtml(s || 'Unknown')}</span>`
}
window.statusBadge = statusBadge

// ---- Format currency ----
function formatPrice(val) {
  if (val == null || isNaN(val)) return '—'
  return '₹' + Number(val).toLocaleString('en-IN')
}
window.formatPrice = formatPrice

// ---- Format date for display ----
function formatDate(val) {
  if (!val) return '—'
  const d = new Date(val)
  if (isNaN(d)) return escapeHtml(val)
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })
}
window.formatDate = formatDate

// ---- Confirm dialog (uses native confirm for simplicity) ----
function confirmAction(msg) {
  return window.confirm(msg)
}
window.confirmAction = confirmAction
