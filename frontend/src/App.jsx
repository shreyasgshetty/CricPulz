import { BrowserRouter, Routes, Route } from "react-router-dom";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
import EmployeeLogin from "./pages/auth/EmployeeLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/employee" element={<EmployeeLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;

