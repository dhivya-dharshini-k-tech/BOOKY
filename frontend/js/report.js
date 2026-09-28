// =============================================================
// report.js — Occupancy report generator
// Displays backend response as stat cards + readable report.
// Does NOT invent values — only renders what the backend returns.
// =============================================================

;(function () {
  if (!requireLogin()) return
  mountLayout('report', 'Occupancy Report', 'Monthly occupancy statistics')

  const resultsEl = document.getElementById('reportResults')
  const generateBtn = document.getElementById('generateBtn')

  // Default year/month = current
  const now = new Date()
  document.getElementById('reportYear').value  = now.getFullYear()
  document.getElementById('reportMonth').value = now.getMonth() + 1

  const MONTH_NAMES = ['', 'January','February','March','April','May','June',
    'July','August','September','October','November','December']

  window.generateReport = async function () {
    const year  = document.getElementById('reportYear').value
    const month = document.getElementById('reportMonth').value

    if (!year || !month) {
      showToastError('Please select both year and month.')
      return
    }

    generateBtn.disabled = true
    generateBtn.innerHTML = '<span class="spinner"></span> Generating...'
    resultsEl.innerHTML = loadingState('Generating report...')

    try {
      const data = await apiGet(`/api/reports/occupancy?year=${year}&month=${month}`)
      renderReport(data, year, month)
    } catch (err) {
      resultsEl.innerHTML = errorState(err.message || 'Unable to generate report.')
      showToastError(err.message || 'Unable to generate report.')
    } finally {
      generateBtn.disabled = false
      generateBtn.innerHTML = '📊 Generate Report'
    }
  }

  // Render the backend response — adapt to various field naming conventions
  function renderReport(data, year, month) {
    if (!data || (typeof data !== 'object')) {
      resultsEl.innerHTML = errorState('The report response was not in the expected format.')
      return
    }

    // Map common field names the backend might use
    const totalRooms       = data.totalRooms       ?? data.totalRoomCount       ?? null
    const bookedRooms      = data.bookedRooms      ?? data.bookedRoomCount      ?? data.occupiedRooms ?? null
    const availableRooms   = data.availableRooms   ?? data.availableRoomCount   ?? null
    const totalBookings    = data.totalBookings    ?? data.bookingCount         ?? null
    const occupancyRate    = data.occupancyRate    ?? data.occupancyPercentage  ?? data.occupancy ?? null
    const revenue          = data.revenue          ?? data.totalRevenue         ?? data.totalPrice ?? null
    const cancelledBookings= data.cancelledBookings?? data.cancelledCount       ?? null
    const confirmedBookings= data.confirmedBookings?? data.confirmedCount       ?? null

    const cards = []

    if (totalRooms != null)      cards.push({ label: 'Total Rooms',        value: totalRooms,       icon: '🚪', cls: 'navy' })
    if (bookedRooms != null)     cards.push({ label: 'Booked Room-Nights', value: bookedRooms,      icon: '📅', cls: 'amber' })
    if (availableRooms != null)  cards.push({ label: 'Available Room-Nights', value: availableRooms, icon: '✓', cls: 'green' })
    if (occupancyRate != null)   cards.push({ label: 'Occupancy Rate',     value: formatPercent(occupancyRate), icon: '📊', cls: 'blue' })
    if (totalBookings != null)   cards.push({ label: 'Total Bookings',     value: totalBookings,    icon: '📋', cls: 'navy' })
    if (confirmedBookings != null) cards.push({ label: 'Confirmed',        value: confirmedBookings, icon: '✓', cls: 'green' })
    if (cancelledBookings != null) cards.push({ label: 'Cancelled',        value: cancelledBookings, icon: '✕', cls: 'red' })
    if (revenue != null)         cards.push({ label: 'Revenue',            value: formatPrice(revenue), icon: '₹', cls: 'green' })

    const statsHTML = cards.length > 0
      ? `<div class="stats-grid">${cards.map(c => `
          <div class="stat-card">
            <div class="stat-icon ${c.cls}">${c.icon}</div>
            <div class="stat-body">
              <div class="stat-label">${c.label}</div>
              <div class="stat-value">${c.value}</div>
            </div>
          </div>`).join('')}</div>`
      : ''

    // Build a readable report section from the full response
    const monthName = MONTH_NAMES[parseInt(month, 10)] || '—'
    const reportHTML = `
      <div class="panel">
        <div class="panel-header"><h3>Occupancy Report — ${monthName} ${year}</h3></div>
        <div class="panel-body">
          <pre style="font-family:var(--mono);font-size:13px;color:var(--gray-700);white-space:pre-wrap;word-wrap:break-word;background:var(--gray-50);padding:18px;border-radius:8px;border:1px solid var(--gray-200);margin:0">${escapeHtml(JSON.stringify(data, null, 2))}</pre>
        </div>
      </div>`

    resultsEl.innerHTML = statsHTML + reportHTML
  }

  function formatPercent(val) {
    const n = Number(val)
    if (isNaN(n)) return escapeHtml(String(val))
    // If it looks like a fraction (0–1), convert to percentage
    const pct = n <= 1 ? n * 100 : n
    return pct.toFixed(1) + '%'
  }
})()
