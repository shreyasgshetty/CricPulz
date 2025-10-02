import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";


export default function AdminLogin() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/admin-login", form);
      localStorage.setItem("adminToken", res.data.token);
      toast.success("Admin Login successfull!", { duration: 4000 });
      navigate("/admin-dashboard"); // redirect to admin area
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed", { duration: 4000 });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-r from-red-900 to-black">
      <div className="bg-gray-800 p-10 rounded-3xl shadow-2xl w-96">
        <h1 className="text-3xl font-extrabold mb-8 text-center bg-gradient-to-r from-red-500 via-yellow-500 to-orange-500 bg-clip-text text-transparent">
          Admin Panel Login
        </h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="email"
            placeholder="Admin Email"
            className="w-full p-4 bg-gray-700 placeholder-gray-400 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 bg-gray-700 placeholder-gray-400 text-white rounded-xl border border-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500 transition"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 shadow-lg"
          >
            Login as Admin
          </button>
        </form>
        <p className="text-center text-gray-400 mt-6">
          Not an Admin?{" "}
          <span
            className="text-red-400 hover:text-red-300 cursor-pointer"
            onClick={() => navigate("/login")}
          >
            Go Back
          </span>
        </p>
      </div>
    </div>
  );
}
