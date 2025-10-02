import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/auth/register", form);
      toast.success("✅ Registered successfully!", { duration: 4000 });
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed", { duration: 4000 });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-900 via-teal-900 to-gray-900">
      <div className="relative w-96 p-10 bg-gray-850 rounded-3xl shadow-2xl border-2 border-transparent
                      hover:border-gradient-to-r hover:from-blue-400 hover:via-teal-400 hover:to-yellow-400 transition-all duration-500 overflow-hidden">
        <div className="absolute -inset-1 bg-gradient-to-r from-gray-900 via-teal-400 to-gray-900 opacity-20 blur-2xl rounded-3xl"></div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-8 text-center bg-black bg-clip-text text-transparent tracking-wide">
            Create Account
          </h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-4 bg-gray-800 text-white placeholder-gray-400 rounded-xl border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 bg-gray-800 text-white placeholder-gray-400 rounded-xl border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-teal-400 transition"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full p-4 bg-gray-800 text-white placeholder-gray-400 rounded-xl border border-gray-700
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 transition"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-teal-400 via-gray-900 to-teal-400
                         text-white font-semibold text-lg hover:scale-105 hover:shadow-lg transition-all duration-300"
            >
              Register
            </button>
          </form>
          <p className="text-center text-gray-300 mt-6 text-sm">
            Already have an account?{" "}
            <span
              className="text-blue-400 hover:text-teal-300 cursor-pointer font-medium transition-colors duration-300"
              onClick={() => navigate("/login")}
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
