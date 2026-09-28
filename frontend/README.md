# BookMyRoom — Guest House Room Booking System (Frontend)

A professional, responsive **frontend prototype** for a Guest House / Hotel Management System, built with **HTML5, CSS3, and Vanilla JavaScript** only — no frameworks, no UI libraries.

> ⚠️ **Security Notice:** This login system is implemented only for frontend demonstration. It is **not secure authentication**. For production deployment, authentication and authorization should be implemented on the Spring Boot backend using **Spring Security**, password hashing, sessions/JWT, role-based authorization, and server-side validation.

---

## Demo Credentials

| Field    | Value                   |
|----------|-------------------------|
| Email    | `admin@bookmyroom.com`  |
| Password | `admin123`              |

You can also create a new account from the login page (stored in `localStorage` for the prototype only).

---

## File Structure

```
bookmyroom-frontend/
├── login.html          # Login + Create Account page (entry point)
├── index.html          # Dashboard with statistics
├── rooms.html          # Room management (CRUD)
├── guests.html         # Guest management (CRUD)
├── booking.html        # Create a new booking
├── bookings.html       # List & cancel bookings
├── availability.html   # Search available rooms by date
├── report.html         # Occupancy report
├── favicon.svg
├── vite.config.js
├── package.json
├── css/
│   ├── style.css       # Dashboard / app styles
│   └── login.css       # Login page styles
└── js/
    ├── api.js          # Centralized API config + fetch helpers
    ├── auth.js         # Prototype authentication
    ├── app.js          # Shared layout, toasts, modals, states
    ├── app-dashboard.js# Dashboard statistics
    ├── rooms.js        # Room CRUD
    ├── guests.js       # Guest CRUD
    ├── booking.js      # Create booking
    ├── bookings.js     # List / cancel bookings
    ├── availability.js # Availability search
    └── report.js       # Occupancy report
```

---

## Application Flow

```
LOGIN PAGE → DASHBOARD → ROOMS → GUESTS → BOOKINGS → AVAILABILITY → OCCUPANCY REPORT
```

The app always starts at **`login.html`**.

---

## Development

```bash
cd frontend
npm ci
npm run dev
```

Open `http://localhost:5173/login.html`. Vite proxies `/api` requests to Spring Boot on port 8080.

## Run Through Spring Boot

From the repository root, build the frontend and start the backend:

```powershell
cd frontend
npm ci
npm run build
cd ..
.\mvnw.cmd spring-boot:run
```

Vite writes the pages and assets to `src/main/resources/static`; Spring Boot serves the app at `http://localhost:8080/` and the API on the same origin. Ensure MySQL is running and the configured `bookmyroom` database exists.

### Booking JSON (POST /api/bookings)

```json
{
  "roomId": 10,
  "guestId": 1,
  "checkInDate": "2026-10-01",
  "checkOutDate": "2026-10-04"
}
```

The backend is expected to calculate the total price and return booking status. The frontend does **not** hardcode any application data.

---

## API Connection

When served by Spring Boot, the frontend sends requests to same-origin `/api/**` endpoints. During Vite development, the dev server proxies those requests to `http://localhost:8080`.

---

## Features

- Professional hotel management dashboard with sidebar navigation
- Responsive design (desktop, laptop, tablet, mobile)
- Collapsible sidebar on mobile with overlay
- Sign In / Create Account tabs on the login page
- Show/hide password toggle
- Loading states on every API-driven page
- Empty states ("No rooms found", etc.)
- Error states with backend error messages
- Toast notifications (success, error, info, warning)
- Modal forms for add/edit room and guest
- Status badges (Confirmed / Cancelled)
- Availability search with room cards
- Occupancy report with statistic cards
- No hardcoded application data — all data comes from the backend API

---

## Tech Stack

- HTML5
- CSS3 (custom, no framework)
- Vanilla JavaScript (ES6+)
- Fetch API
- `sessionStorage` for login state
- `localStorage` for prototype signup accounts
- Vite (optional dev server / build tool)

**No React, Angular, Vue, Bootstrap, Tailwind, jQuery, or any UI framework.**
