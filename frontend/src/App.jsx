import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
=======
import { Toaster } from "react-hot-toast";
>>>>>>> 79857f564d784263d3bed131a4a666696b1a1172
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import AdminLogin from "./pages/auth/AdminLogin";
import EmployeeLogin from "./pages/auth/EmployeeLogin";

function App() {
  return (
    <BrowserRouter>
<<<<<<< HEAD
=======
      {/* Toast container should be outside Routes */}
      <Toaster position="top-right" reverseOrder={false} />

>>>>>>> 79857f564d784263d3bed131a4a666696b1a1172
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/employee" element={<EmployeeLogin />} />
<<<<<<< HEAD
        
=======
>>>>>>> 79857f564d784263d3bed131a4a666696b1a1172
      </Routes>
    </BrowserRouter>
  );
}

export default App;
<<<<<<< HEAD

=======
>>>>>>> 79857f564d784263d3bed131a4a666696b1a1172
