# Auralis — Enterprise Hotel Management Platform

A modern, frontend-only hotel management application built with **React**, **Vite**, and **Tailwind CSS v4**. All data is persisted in the browser's `localStorage` (seeded on first load), so there is no backend to run.

## Tech Stack

- **React 19** — UI library
- **Vite 8** — Build tool & dev server
- **Tailwind CSS 4** — Utility-first styling
- **React Router 7** — Client-side routing
- **Zustand** — Lightweight state management
- **Recharts** — Charts & analytics
- **Lucide React** — Icon library

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher)
- npm (comes with Node.js)

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build

```bash
npm run build    # outputs to dist/
npm run preview  # preview the production build locally
```

## Demo Logins

| Role         | Email                      | Password       |
| ------------ | -------------------------- | -------------- |
| Super Admin  | admin@auralis.com          | Admin@123      |
| Hotel Admin  | manager@auralis.com        | Manager@123    |
| Receptionist | reception@auralis.com      | Reception@123  |
| Accountant   | accounts@auralis.com       | Accounts@123   |
| Housekeeping | housekeeping@auralis.com   | House@123      |
| Guest        | guest@example.com          | Guest@123      |

## Project Structure

```
src/
  main.jsx                 Entry point
  App.jsx                  Routes + DB seeding on startup
  index.css                Tailwind import + custom styles
  lib/
    db.js                  LocalDatabase (localStorage-backed collections)
    auth.js                Token helpers, role permissions, authAPI
    seed.js                Demo data
    api.js                 Bookings / rooms / guests / payments / invoices /
                           housekeeping / maintenance / ledger / devices / reports APIs
    constants.js           Shared style + label maps
  store/
    useStore.js            Zustand store (auth + UI state, dark mode)
  components/
    Sidebar.jsx
    Header.jsx
    DashboardLayout.jsx
  pages/
    LandingPage.jsx
    BookingPage.jsx
    LoginPage.jsx
    RegisterPage.jsx
    DashboardPage.jsx
    RoomsPage.jsx
    BookingsPage.jsx
    ReceptionPage.jsx
    GuestsPage.jsx
    PaymentsPage.jsx
    LedgerPage.jsx
    InvoicesPage.jsx
    HousekeepingPage.jsx
    MaintenancePage.jsx
    AutomationPage.jsx
    AnalyticsPage.jsx
    StaffPage.jsx
    SettingsPage.jsx
```

## Features

- Role-based authentication (6 roles with different permissions)
- Dashboard with analytics & charts
- Room & booking management
- Guest management
- Payment & invoice tracking
- Housekeeping & maintenance workflows
- Staff management
- Smart automation settings
- Dark mode support
- Fully responsive layout

## Notes

- This project was reconstructed from a compiled build, so comments and original local variable names (`e`, `t`, `r` ...) are gone. Components, files, exports and JSX are readable and the behaviour is unchanged.
- Settings → "Reset Data" re-seeds the demo database.
