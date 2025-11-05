import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// 🔹 Auth Pages
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
import EmployeeLogin from "./pages/auth/EmployeeLogin";

// 🔹 Dashboard Pages
import AdminDashboard from "./pages/admin/AdminDashboard";

// 🔹 Public Pages
import HomePage from "./pages/HomePage";
import SeriesPage from "./pages/SeriesPage";
import MatchesPage from "./pages/MatchesPage";
import TournamentsPage from "./pages/TournamentsPage";
import RankingsPage from "./pages/RankingsPage";
import NewsPage from "./pages/NewsPage";
import ProfilePage from "./pages/ProfilePage";

// 🔹 Components
import Header from "./components/Header";

function App() {
  return (
    <BrowserRouter>
      {/* Header always visible */}
      <Header />

      <main className="p-6 bg-gray-900 min-h-screen">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<HomePage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/matches" element={<MatchesPage />} />
          <Route path="/tournaments" element={<TournamentsPage />} />
          <Route path="/rankings" element={<RankingsPage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/profile" element={<ProfilePage />} />

          {/* Auth Pages */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/employee" element={<EmployeeLogin />} />

          {/* Dashboards */}
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
