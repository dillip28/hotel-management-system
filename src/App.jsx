import { useEffect } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { seedDatabase } from "./lib/seed.js";
import { LandingPage } from "./pages/LandingPage.jsx";
import { BookingPage } from "./pages/BookingPage.jsx";
import { LoginPage } from "./pages/LoginPage.jsx";
import { RegisterPage } from "./pages/RegisterPage.jsx";
import { DashboardLayout } from "./components/DashboardLayout.jsx";
import { DashboardPage } from "./pages/DashboardPage.jsx";
import { RoomsPage } from "./pages/RoomsPage.jsx";
import { BookingsPage } from "./pages/BookingsPage.jsx";
import { ReceptionPage } from "./pages/ReceptionPage.jsx";
import { GuestsPage } from "./pages/GuestsPage.jsx";
import { PaymentsPage } from "./pages/PaymentsPage.jsx";
import { LedgerPage } from "./pages/LedgerPage.jsx";
import { InvoicesPage } from "./pages/InvoicesPage.jsx";
import { HousekeepingPage } from "./pages/HousekeepingPage.jsx";
import { MaintenancePage } from "./pages/MaintenancePage.jsx";
import { AutomationPage } from "./pages/AutomationPage.jsx";
import { AnalyticsPage } from "./pages/AnalyticsPage.jsx";
import { StaffPage } from "./pages/StaffPage.jsx";
import { SettingsPage } from "./pages/SettingsPage.jsx";

async function initializeApp() {
  await seedDatabase();
}

function App() {
  return (
    useEffect(() => {
      initializeApp();
    }, []),
    (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/book/:roomId" element={<BookingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/" element={<DashboardLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="rooms" element={<RoomsPage />} />
            <Route path="bookings" element={<BookingsPage />} />
            <Route path="my-bookings" element={<BookingsPage />} />
            <Route path="reception" element={<ReceptionPage />} />
            <Route path="guests" element={<GuestsPage />} />
            <Route path="payments" element={<PaymentsPage />} />
            <Route path="ledger" element={<LedgerPage />} />
            <Route path="invoices" element={<InvoicesPage />} />
            <Route path="housekeeping" element={<HousekeepingPage />} />
            <Route path="maintenance" element={<MaintenancePage />} />
            <Route path="automation" element={<AutomationPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="settings" element={<SettingsPage />} />
            <Route path="profile" element={<SettingsPage />} />
            <Route path="notifications" element={<DashboardPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace={true} />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3e3,
            style: {
              borderRadius: "12px",
              background: "#fff",
              color: "#111827",
              boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
            },
          }}
        />
      </BrowserRouter>
    )
  );
}

export default App;
