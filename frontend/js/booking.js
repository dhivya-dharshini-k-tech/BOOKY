// =============================================================
// booking.js — Create a new booking
// Loads guests + available rooms (by date range), posts booking
// =============================================================

;(function () {
  if (!requireLogin()) return
  mountLayout('booking', 'New Booking', 'Create a reservation')

  const guestSelect  = document.getElementById('guestSelect')
  const roomSelect   = document.getElementById('roomSelect')
  const roomHint     = document.getElementById('roomHint')
  const checkInEl    = document.getElementById('checkInDate')
  const checkOutEl   = document.getElementById('checkOutDate')
  const nightsInfo   = document.getElementById('nightsInfo')

  // ---- Load guests dropdown ----
  async function loadGuests() {
    try {
      const guests = await apiGet('/api/guests')
      if (!Array.isArray(guests) || guests.length === 0) {
        guestSelect.innerHTML = '<option value="">No guests available — add a guest first</option>'
        return
      }
      guestSelect.innerHTML = '<option value="">Select a guest...</option>' +
        guests.map(g => `<option value="${g.id}">${escapeHtml(g.name ?? g.fullName ?? 'Guest')} — ${escapeHtml(g.email ?? '')}</option>`).join('')
    } catch (err) {
      guestSelect.innerHTML = '<option value="">Unable to load guests</option>'
      showToastError(err.message || 'Unable to load guests.')
    }
  }

  // ---- When dates change, load available rooms ----
  window.onDateChange = async function () {
    const ci = checkInEl.value
    const co = checkOutEl.value
    nightsInfo.innerHTML = ''

    if (!ci || !co) {
      roomSelect.innerHTML = '<option value="">Select dates first to load available rooms</option>'
      roomSelect.disabled = true
      roomHint.textContent = 'Choose check-in and check-out dates to see available rooms.'
      return
    }

    if (new Date(co) <= new Date(ci)) {
      roomSelect.innerHTML = '<option value="">Select dates first to load available rooms</option>'
      roomSelect.disabled = true
      roomHint.textContent = 'Check-out date must be after check-in date.'
      nightsInfo.innerHTML = '<span style="color:var(--danger)">⚠ Check-out date must be after check-in date.</span>'
      return
    }

    const nights = Math.round((new Date(co) - new Date(ci)) / 86400000)
    nightsInfo.innerHTML = `<strong>${nights}</strong> night${nights !== 1 ? 's' : ''}`

    roomSelect.disabled = true
    roomSelect.innerHTML = '<option value="">Loading available rooms...</option>'
    roomHint.textContent = ''

    try {
      const rooms = await apiGet(`/api/rooms/available?checkIn=${ci}&checkOut=${co}`)
      if (!Array.isArray(rooms) || rooms.length === 0) {
        roomSelect.innerHTML = '<option value="">No rooms available for these dates</option>'
        roomHint.textContent = 'No rooms are available for the selected dates.'
        return
      }
      roomSelect.innerHTML = '<option value="">Select a room...</option>' +
        rooms.map(r => `<option value="${r.id}">Room ${escapeHtml(r.roomNumber)} — ${escapeHtml(r.roomType)} — ${formatPrice(r.pricePerNight)}/night</option>`).join('')
      roomSelect.disabled = false
      roomHint.textContent = `${rooms.length} room${rooms.length !== 1 ? 's' : ''} available.`
    } catch (err) {
      roomSelect.innerHTML = '<option value="">Unable to load rooms</option>'
      roomHint.textContent = err.message || 'Unable to load available rooms.'
    }
  }

  // ---- Submit booking ----
  function setBookingError(msg) {
    document.getElementById('bookingError').innerHTML = `<div class="form-error">⚠ ${escapeHtml(msg)}</div>`
  }
  function clearBookingError() {
    document.getElementById('bookingError').innerHTML = ''
  }

  window.submitBooking = async function (e) {
    e.preventDefault()
    clearBookingError()

    const guestId   = guestSelect.value
    const roomId    = roomSelect.value
    const checkIn   = checkInEl.value
    const checkOut  = checkOutEl.value

    if (!guestId)  { setBookingError('Please select a guest.'); return }
    if (!roomId)   { setBookingError('Please select a room.'); return }
    if (!checkIn || !checkOut) { setBookingError('Please select check-in and check-out dates.'); return }
    if (new Date(checkOut) <= new Date(checkIn)) {
      setBookingError('Check-out date must be after check-in date.'); return
    }

    const btn = document.getElementById('bookingSubmitBtn')
    btn.disabled = true
    btn.innerHTML = '<span class="spinner"></span> Creating booking...'
    try {
      const payload = {
        roomId: Number(roomId),
        guestId: Number(guestId),
        checkInDate: checkIn,
        checkOutDate: checkOut,
      }
      await apiPost('/api/bookings', payload)
      showToastSuccess('Booking created successfully')
      setTimeout(() => { window.location.href = 'bookings.html' }, 600)
    } catch (err) {
      setBookingError(err.message || 'Unable to create booking.')
      showToastError(err.message || 'Unable to create booking.')
    } finally {
      btn.disabled = false
      btn.textContent = 'Create Booking'
    }
  }

  window.resetBookingForm = function () {
    clearBookingError()
    nightsInfo.innerHTML = ''
    roomSelect.innerHTML = '<option value="">Select dates first to load available rooms</option>'
    roomSelect.disabled = true
    roomHint.textContent = 'Choose check-in and check-out dates to see available rooms.'
  }

  loadGuests()
})()
