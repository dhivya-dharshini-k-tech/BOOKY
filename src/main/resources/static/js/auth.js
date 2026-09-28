// =============================================================
// auth.js — Frontend-only authentication (PROTOTYPE)
// NOT secure. For demo only. Production auth belongs on the
// Spring Boot backend (Spring Security, JWT, hashing, RBAC).
// =============================================================

const SESSION_KEY = 'bmr_session'
const USERS_KEY = 'bmr_users' // localStorage signup accounts (prototype)

// Hardcoded prototype administrator account
const PROTOTYPE_USER = {
  name: 'Administrator',
  email: 'admin@bookmyroom.com',
  password: 'admin123',
}

// ---- Core auth functions ----

function loginUser(name) {
  sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name, time: Date.now() }))
}

function logoutUser() {
  sessionStorage.removeItem(SESSION_KEY)
  window.location.href = 'login.html'
}

function isLoggedIn() {
  return sessionStorage.getItem(SESSION_KEY) !== null
}

function getCurrentUser() {
  try {
    return JSON.parse(sessionStorage.getItem(SESSION_KEY))
  } catch {
    return null
  }
}

// Redirect to login if not authenticated — call at top of protected pages
function requireLogin() {
  if (!isLoggedIn()) {
    window.location.href = 'login.html'
    return false
  }
  return true
}

// Redirect to dashboard if already logged in — call on login page
function redirectIfLoggedIn() {
  if (isLoggedIn()) {
    window.location.href = 'index.html'
  }
}

// Validate prototype credentials; returns {ok, name} or {ok:false}
function validateLogin(email, password) {
  const e = (email || '').trim().toLowerCase()
  const p = password || ''

  if (e === PROTOTYPE_USER.email && p === PROTOTYPE_USER.password) {
    return { ok: true, name: PROTOTYPE_USER.name }
  }

  // Check localStorage signup accounts
  const users = getStoredUsers()
  const found = users.find(u => u.email.toLowerCase() === e && u.password === p)
  if (found) return { ok: true, name: found.name }

  return { ok: false }
}

// ---- Signup (localStorage prototype) ----

function getStoredUsers() {
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY)) || []
  } catch {
    return []
  }
}

function emailExists(email) {
  const e = (email || '').trim().toLowerCase()
  if (e === PROTOTYPE_USER.email) return true
  return getStoredUsers().some(u => u.email.toLowerCase() === e)
}

function createSignupAccount(name, email, password) {
  const users = getStoredUsers()
  users.push({ name, email: email.trim(), password })
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

// Expose globally
window.loginUser = loginUser
window.logoutUser = logoutUser
window.isLoggedIn = isLoggedIn
window.getCurrentUser = getCurrentUser
window.requireLogin = requireLogin
window.redirectIfLoggedIn = redirectIfLoggedIn
window.validateLogin = validateLogin
window.emailExists = emailExists
window.createSignupAccount = createSignupAccount
window.PROTOTYPE_USER = PROTOTYPE_USER
