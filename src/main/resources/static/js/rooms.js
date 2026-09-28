// =============================================================
// rooms.js — Room CRUD: list, add, edit, delete
// =============================================================

;(function () {
  if (!requireLogin()) return
  mountLayout('rooms', 'Rooms', 'Manage room inventory')

  const container = document.getElementById('roomsContainer')

  // ---- Load & render ----
  async function loadRooms() {
    container.innerHTML = loadingState('Loading rooms...')
    try {
      const rooms = await apiGet('/api/rooms')
      if (!Array.isArray(rooms) || rooms.length === 0) {
        container.innerHTML = emptyState('No rooms found. Click "Add Room" to create one.', '🚪')
        return
      }
      renderRoomsTable(rooms)
    } catch (err) {
      container.innerHTML = errorState(err.message || 'Unable to load rooms.')
    }
  }

  function renderRoomsTable(rooms) {
    container.innerHTML = `<div class="table-wrap"><table class="data-table">
      <thead><tr>
        <th>Room Number</th><th>Room Type</th><th>Capacity</th>
        <th>Price Per Night</th><th>Availability</th><th>Actions</th>
      </tr></thead>
      <tbody>${rooms.map(r => `
        <tr>
          <td class="cell-strong">${escapeHtml(r.roomNumber ?? '—')}</td>
          <td>${escapeHtml(r.roomType ?? '—')}</td>
          <td>${escapeHtml(String(r.capacity ?? '—'))}</td>
          <td class="cell-strong">${formatPrice(r.pricePerNight)}</td>
          <td>${r.available === true || r.available === 'true'
            ? '<span class="badge badge-success">Available</span>'
            : '<span class="badge badge-danger">Occupied</span>'}</td>
          <td><div class="row-actions">
            <button class="btn btn-secondary btn-sm" onclick='editRoom(${JSON.stringify(r).replace(/'/g, "&#39;")})'>✎ Edit</button>
            <button class="btn btn-danger btn-sm" onclick="deleteRoom(${r.id})">🗑 Delete</button>
          </div></td>
        </tr>`).join('')}
      </tbody></table></div>`
  }

  // ---- Add / Edit modal ----
  let editingId = null

  window.openRoomModal = function () {
    editingId = null
    document.getElementById('roomModalTitle').textContent = 'Add Room'
    document.getElementById('roomForm').reset()
    document.getElementById('roomId').value = ''
    document.getElementById('roomAvailable').checked = true
    document.getElementById('roomSaveBtn').textContent = 'Save Room'
    openModal('roomModal')
  }

  window.editRoom = function (room) {
    editingId = room.id
    document.getElementById('roomModalTitle').textContent = 'Edit Room'
    document.getElementById('roomId').value = room.id
    document.getElementById('roomNumber').value = room.roomNumber ?? ''
    document.getElementById('roomType').value = room.roomType ?? ''
    document.getElementById('capacity').value = room.capacity ?? ''
    document.getElementById('pricePerNight').value = room.pricePerNight ?? ''
    document.getElementById('roomAvailable').checked = room.available === true || room.available === 'true'
    document.getElementById('roomSaveBtn').textContent = 'Update Room'
    openModal('roomModal')
  }

  window.deleteRoom = async function (id) {
    if (!confirmAction('Are you sure you want to delete this room?')) return
    try {
      await apiDelete('/api/rooms/' + id)
      showToastSuccess('Room deleted successfully')
      loadRooms()
    } catch (err) {
      showToastError(err.message || 'Unable to delete room.')
    }
  }

  window.submitRoom = async function (e) {
    e.preventDefault()
    const btn = document.getElementById('roomSaveBtn')
    const payload = {
      roomNumber: document.getElementById('roomNumber').value.trim(),
      roomType: document.getElementById('roomType').value,
      capacity: parseInt(document.getElementById('capacity').value, 10),
      pricePerNight: parseFloat(document.getElementById('pricePerNight').value),
      available: document.getElementById('roomAvailable').checked,
    }

    btn.disabled = true
    btn.innerHTML = '<span class="spinner"></span> Saving...'
    try {
      if (editingId !== null) {
        await apiPut('/api/rooms/' + editingId, payload)
        showToastSuccess('Room updated successfully')
      } else {
        await apiPost('/api/rooms', payload)
        showToastSuccess('Room created successfully')
      }
      closeModal('roomModal')
      loadRooms()
    } catch (err) {
      showToastError(err.message || 'Unable to save room.')
    } finally {
      btn.disabled = false
      btn.textContent = editingId !== null ? 'Update Room' : 'Save Room'
    }
  }

  loadRooms()
})()
