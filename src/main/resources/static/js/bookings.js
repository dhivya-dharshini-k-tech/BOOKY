// =============================================================
// bookings.js — List all bookings and cancel confirmed ones
// =============================================================

;(function () {
  if (!requireLogin()) return
  mountLayout('bookings', 'Bookings', 'View and manage reservations')

  const container = document.getElementById('bookingsContainer')

  async function loadBookings() {
    container.innerHTML = loadingState('Loading bookings...')
    try {
      const bookings = await apiGet('/api/bookings')
      if (!Array.isArray(bookings) || bookings.length === 0) {
        container.innerHTML = emptyState('No bookings found. Click "New Booking" to create one.', '📅')
        return
      }
      renderBookingsTable(bookings)
    } catch (err) {
      container.innerHTML = errorState(err.message || 'Unable to load bookings.')
    }
  }

  function renderBookingsTable(bookings) {
    container.innerHTML = `<div class="table-wrap"><table class="data-table">
      <thead><tr>
        <th>Booking ID</th><th>Guest</th><th>Room</th>
        <th>Check-in</th><th>Check-out</th><th>Total Price</th>
        <th>Status</th><th>Action</th>
      </tr></thead>
      <tbody>${bookings.map(b => {
        const status = (b.status || '').toUpperCase()
        const canCancel = status === 'CONFIRMED'
        return `
        <tr>
          <td class="cell-mono">#${b.id ?? '—'}</td>
          <td class="cell-strong">${escapeHtml(b.guestName || b.guest?.name || '—')}</td>
          <td>${escapeHtml(String(b.roomNumber ?? b.room?.roomNumber ?? '—'))}</td>
          <td>${formatDate(b.checkInDate)}</td>
          <td>${formatDate(b.checkOutDate)}</td>
          <td class="cell-strong">${formatPrice(b.totalPrice ?? b.totalAmount)}</td>
          <td>${statusBadge(b.status)}</td>
          <td>${canCancel
            ? `<button class="btn btn-danger btn-sm" onclick="cancelBooking(${b.id})">Cancel</button>`
            : '<span style="color:var(--gray-400);font-size:13px">—</span>'}</td>
        </tr>`
      }).join('')}
      </tbody></table></div>`
  }

  window.cancelBooking = async function (id) {
    if (!confirmAction('Are you sure you want to cancel this booking?')) return
    try {
      await apiPut('/api/bookings/' + id + '/cancel', {})
      showToastSuccess('Booking cancelled successfully')
      loadBookings()
    } catch (err) {
      showToastError(err.message || 'Unable to cancel booking.')
    }
  }

  loadBookings()
})()
