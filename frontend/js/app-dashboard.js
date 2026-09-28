// =============================================================
// app-dashboard.js — Dashboard statistics + recent bookings
// =============================================================

;(function () {
  if (!requireLogin()) return
  mountLayout('index', 'Dashboard', 'Welcome, ' + (getCurrentUser()?.name || 'Administrator'))

  const statsGrid = document.getElementById('statsGrid')
  const recentEl = document.getElementById('recentBookings')

  // Render skeleton stat cards while loading
  const SKELETON_CARDS = [
    { label: 'Total Rooms',        icon: '🚪', cls: 'navy' },
    { label: 'Available Rooms',    icon: '✓',  cls: 'green' },
    { label: 'Total Guests',       icon: '👤', cls: 'blue' },
    { label: 'Confirmed Bookings', icon: '📅', cls: 'amber' },
    { label: 'Cancelled Bookings', icon: '✕', cls: 'red' },
  ]
  function renderSkeletons() {
    statsGrid.innerHTML = SKELETON_CARDS.map(c => `
      <div class="stat-card">
        <div class="stat-icon ${c.cls}">${c.icon}</div>
        <div class="stat-body">
          <div class="stat-label">${c.label}</div>
          <div class="stat-value skeleton"></div>
        </div>
      </div>`).join('')
  }
  function renderStat(label, value, icon, cls, foot) {
    return `<div class="stat-card">
      <div class="stat-icon ${cls}">${icon}</div>
      <div class="stat-body">
        <div class="stat-label">${label}</div>
        <div class="stat-value">${value}</div>
        ${foot ? `<div class="stat-foot">${foot}</div>` : ''}
      </div>
    </div>`
  }

  async function loadDashboard() {
    renderSkeletons()

    try {
      const [rooms, guests, bookings] = await Promise.all([
        apiGet('/api/rooms').catch(() => null),
        apiGet('/api/guests').catch(() => null),
        apiGet('/api/bookings').catch(() => null),
      ])

      const roomList    = Array.isArray(rooms) ? rooms : []
      const guestList   = Array.isArray(guests) ? guests : []
      const bookingList = Array.isArray(bookings) ? bookings : []

      const totalRooms     = roomList.length
      const availableRooms = roomList.filter(r => r.available === true || r.available === 'true').length
      const totalGuests    = guestList.length
      const confirmed      = bookingList.filter(b => (b.status || '').toUpperCase() === 'CONFIRMED').length
      const cancelled      = bookingList.filter(b => (b.status || '').toUpperCase() === 'CANCELLED').length

      statsGrid.innerHTML = [
        renderStat('Total Rooms',        totalRooms,     '🚪', 'navy',   `${availableRooms} available`),
        renderStat('Available Rooms',    availableRooms, '✓',  'green',  `${totalRooms} total`),
        renderStat('Total Guests',       totalGuests,    '👤', 'blue',   'Registered guests'),
        renderStat('Confirmed Bookings', confirmed,      '📅', 'amber',  `${bookingList.length} total bookings`),
        renderStat('Cancelled Bookings', cancelled,      '✕', 'red',    `${bookingList.length} total bookings`),
      ].join('')

      // Recent bookings (latest 5)
      if (bookingList.length === 0) {
        recentEl.innerHTML = emptyState('No bookings found.', '📅')
        return
      }
      const recent = bookingList
        .slice()
        .sort((a, b) => new Date(b.checkInDate || b.id) - new Date(a.checkInDate || a.id))
        .slice(0, 5)

      recentEl.innerHTML = `<div class="table-wrap"><table class="data-table">
        <thead><tr>
          <th>Booking ID</th><th>Guest</th><th>Room</th>
          <th>Check-in</th><th>Check-out</th><th>Status</th>
        </tr></thead>
        <tbody>${recent.map(b => `
          <tr>
            <td class="cell-mono">#${b.id ?? '—'}</td>
            <td>${escapeHtml(b.guestName || b.guest?.name || '—')}</td>
            <td class="cell-strong">${escapeHtml(String(b.roomNumber ?? b.room?.roomNumber ?? '—'))}</td>
            <td>${formatDate(b.checkInDate)}</td>
            <td>${formatDate(b.checkOutDate)}</td>
            <td>${statusBadge(b.status)}</td>
          </tr>`).join('')}
        </tbody></table></div>`
    } catch (err) {
      statsGrid.innerHTML = ''
      recentEl.innerHTML = errorState(err.message || 'Unable to load dashboard data.')
      showToastError(err.message || 'Unable to load dashboard data.')
    }
  }

  loadDashboard()
})()
