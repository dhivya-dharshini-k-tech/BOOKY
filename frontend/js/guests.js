// =============================================================
// guests.js — Guest CRUD: list, add, edit, delete
// =============================================================

;(function () {
  if (!requireLogin()) return
  mountLayout('guests', 'Guests', 'Manage guest directory')

  const container = document.getElementById('guestsContainer')

  async function loadGuests() {
    container.innerHTML = loadingState('Loading guests...')
    try {
      const guests = await apiGet('/api/guests')
      if (!Array.isArray(guests) || guests.length === 0) {
        container.innerHTML = emptyState('No guests found. Click "Add Guest" to create one.', '👤')
        return
      }
      renderGuestsTable(guests)
    } catch (err) {
      container.innerHTML = errorState(err.message || 'Unable to load guests.')
    }
  }

  function renderGuestsTable(guests) {
    container.innerHTML = `<div class="table-wrap"><table class="data-table">
      <thead><tr>
        <th>Guest Name</th><th>Email</th><th>Phone</th><th>Actions</th>
      </tr></thead>
      <tbody>${guests.map(g => `
        <tr>
          <td class="cell-strong">${escapeHtml(g.name ?? g.fullName ?? '—')}</td>
          <td>${escapeHtml(g.email ?? '—')}</td>
          <td class="cell-mono">${escapeHtml(g.phone ?? '—')}</td>
          <td><div class="row-actions">
            <button class="btn btn-secondary btn-sm" onclick='editGuest(${JSON.stringify(g).replace(/'/g, "&#39;")})'>✎ Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteGuest(${g.id})">🗑 Delete</button>
          </div></td>
        </tr>`).join('')}
      </tbody></table></div>`
  }

  let editingId = null

  window.openGuestModal = function () {
    editingId = null
    document.getElementById('guestModalTitle').textContent = 'Add Guest'
    document.getElementById('guestForm').reset()
    document.getElementById('guestId').value = ''
    document.getElementById('guestSaveBtn').textContent = 'Save Guest'
    openModal('guestModal')
  }

  window.editGuest = function (g) {
    editingId = g.id
    document.getElementById('guestModalTitle').textContent = 'Edit Guest'
    document.getElementById('guestId').value = g.id
    document.getElementById('guestName').value = g.name ?? g.fullName ?? ''
    document.getElementById('guestEmail').value = g.email ?? ''
    document.getElementById('guestPhone').value = g.phone ?? ''
    document.getElementById('guestSaveBtn').textContent = 'Update Guest'
    openModal('guestModal')
  }

  window.deleteGuest = async function (id) {
    if (!confirmAction('Are you sure you want to delete this guest?')) return
    try {
      await apiDelete('/api/guests/' + id)
      showToastSuccess('Guest deleted successfully')
      loadGuests()
    } catch (err) {
      showToastError(err.message || 'Unable to delete guest.')
    }
  }

  window.submitGuest = async function (e) {
    e.preventDefault()
    const btn = document.getElementById('guestSaveBtn')
    const payload = {
      name: document.getElementById('guestName').value.trim(),
      email: document.getElementById('guestEmail').value.trim(),
      phone: document.getElementById('guestPhone').value.trim(),
    }
    btn.disabled = true
    btn.innerHTML = '<span class="spinner"></span> Saving...'
    try {
      if (editingId !== null) {
        await apiPut('/api/guests/' + editingId, payload)
        showToastSuccess('Guest updated successfully')
      } else {
        await apiPost('/api/guests', payload)
        showToastSuccess('Guest created successfully')
      }
      closeModal('guestModal')
      loadGuests()
    } catch (err) {
      showToastError(err.message || 'Unable to save guest.')
    } finally {
      btn.disabled = false
      btn.textContent = editingId !== null ? 'Update Guest' : 'Save Guest'
    }
  }

  loadGuests()
})()
