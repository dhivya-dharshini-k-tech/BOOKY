// =============================================================
// availability.js — Search available rooms by date range
// =============================================================

;(function () {
  if (!requireLogin()) return
  mountLayout('availability', 'Availability', 'Search available rooms')

  const resultsEl = document.getElementById('availabilityResults')
  const searchBtn = document.getElementById('searchBtn')

  window.searchAvailability = async function () {
    const ci = document.getElementById('availCheckIn').value
    const co = document.getElementById('availCheckOut').value

    if (!ci || !co) {
      showToastError('Please select both check-in and check-out dates.')
      return
    }
    if (new Date(co) <= new Date(ci)) {
      showToastError('Check-out date must be after check-in date.')
      return
    }

    searchBtn.disabled = true
    searchBtn.innerHTML = '<span class="spinner"></span> Searching...'
    resultsEl.innerHTML = loadingState('Checking availability...')

    try {
      const rooms = await apiGet(`/api/rooms/available?checkIn=${ci}&checkOut=${co}`)
      if (!Array.isArray(rooms) || rooms.length === 0) {
        resultsEl.innerHTML = emptyState('No rooms are available for the selected dates.', '🚪')
        return
      }
      renderRoomCards(rooms)
    } catch (err) {
      resultsEl.innerHTML = errorState(err.message || 'Unable to check availability.')
      showToastError(err.message || 'Unable to check availability.')
    } finally {
      searchBtn.disabled = false
      searchBtn.innerHTML = '🔍 Search Rooms'
    }
  }

  function renderRoomCards(rooms) {
    resultsEl.innerHTML = `<div class="room-cards">${rooms.map(r => `
      <div class="room-card">
        <div class="room-card-head">
          <div>
            <div class="room-card-num">${escapeHtml(r.roomNumber ?? '—')}</div>
            <div class="room-card-type">${escapeHtml(r.roomType ?? '')}</div>
          </div>
          <span class="badge badge-success">Available</span>
        </div>
        <div class="room-card-specs">
          <div class="room-card-spec">
            <span class="spec-label">Capacity</span>
            <span class="spec-val">${escapeHtml(String(r.capacity ?? '—'))} guests</span>
          </div>
          <div class="room-card-spec">
            <span class="spec-label">Price / night</span>
            <span class="spec-val room-card-price">${formatPrice(r.pricePerNight)}</span>
          </div>
          <div class="room-card-spec">
            <span class="spec-label">Status</span>
            <span class="spec-val">${r.available === true || r.available === 'true' ? 'Available' : 'Occupied'}</span>
          </div>
        </div>
      </div>`).join('')}</div>`
  }
})()
