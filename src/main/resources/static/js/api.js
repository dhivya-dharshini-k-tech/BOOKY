// =============================================================
// api.js — Centralized backend communication layer
// All REST calls go through this file. Change API_BASE here only.
// =============================================================

// Same-origin API in Spring Boot; Vite proxies /api during development.
const API_BASE = ''

/**
 * Extract a human-readable error message from any fetch failure.
 * Tries the backend JSON message first, then falls back to a generic label.
 */
async function parseErrorMessage(response, fallback) {
  try {
    const text = await response.text()
    if (text) {
      try {
        const data = JSON.parse(text)
        if (data.message) return data.message
        if (data.error) return data.error
        if (typeof data === 'string') return data
      } catch {
        return text.trim()
      }
    }
  } catch {
    // response body already consumed or empty
  }
  return fallback
}

/**
 * Generic request wrapper used by apiGet/apiPost/apiPut/apiDelete.
 * Throws an Error with a readable message on any failure.
 */
async function apiRequest(method, path, body) {
  let response
  try {
    response = await fetch(API_BASE + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch {
    // Network-level failure (server down, CORS blocked, etc.)
    throw new Error('Server connection failed. Is the backend running on ' + API_BASE + '?')
  }

  if (!response.ok) {
    const fallback = `${method} ${path} failed (HTTP ${response.status})`
    const msg = await parseErrorMessage(response, fallback)
    throw new Error(msg)
  }

  // Some responses (204 No Content) have no body
  if (response.status === 204) return null
  const text = await response.text()
  return text ? JSON.parse(text) : null
}

// Reusable HTTP helpers — import these everywhere else
function apiGet(path)              { return apiRequest('GET',    path) }
function apiPost(path, body)       { return apiRequest('POST',   path, body) }
function apiPut(path, body)        { return apiRequest('PUT',    path, body) }
function apiDelete(path)           { return apiRequest('DELETE', path) }

// Expose globally so non-module scripts (loaded without type=module) can use them
window.API_BASE = API_BASE
window.apiGet = apiGet
window.apiPost = apiPost
window.apiPut = apiPut
window.apiDelete = apiDelete
